const mongoose = require('mongoose');
const Appointment = require('../models/Appointments');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const DoctorSchedule = require('../models/doctorSchedule');
const { io, getReceiverSocketId } = require("../lib/socket");


const createAppointment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { doctorId, appointmentDate, appointmentTime, reason, branch } = req.body;
        const patientId = req.user.id;

        // Validate doctor availability (same as before)
        const schedule = await DoctorSchedule.findOne({ doctorId });
        if (!schedule) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Doctor schedule not found' });
        }

        const dayName = new Date(appointmentDate).toLocaleString('en-US', { weekday: 'long' });
        const dayAvailability = schedule.weeklyAvailability.find(day => day.day === dayName);

        if (!dayAvailability || dayAvailability.timeSlots.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Doctor not available on this day' });
        }

        const isAvailable = dayAvailability.timeSlots.some(slot => {
            return (
                slot.branch === branch &&
                appointmentTime >= slot.from &&
                appointmentTime < slot.to
            );
        });

        if (!isAvailable) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Doctor not available at this time' });
        }

        // Check for existing appointment within transaction
        const existingAppointment = await Appointment.findOne({
            doctorId,
            appointmentDate,
            appointmentTime,
            status: { $in: ['Pending', 'Confirmed'] }
        }).session(session);

        if (existingAppointment) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'Slot already booked' });
        }

        // Create appointment within transaction
        const newAppointment = new Appointment({
            doctorId,
            patientId,
            appointmentDate,
            appointmentTime,
            reason,
            branch,
            status: 'Pending'
        });

        await newAppointment.save({ session });

        await session.commitTransaction();
        session.endSession();

        const populatedAppointment = await Appointment.findById(newAppointment._id)
            .populate('patientId', 'name phone email picture')
            .populate('doctorId', 'name specialization')
            .populate('confirmedBy', 'name');

        res.status(201).json({
            message: 'Appointment successfully booked',
            appointment: populatedAppointment
        });
        io.emit("appointmentStatusUpdated", {
            appointmentId: populatedAppointment._id,
            newStatus: populatedAppointment.status,
            doctorId: populatedAppointment.doctorId._id.toString(),
            patientId: populatedAppointment.patientId._id.toString(),
            updatedBy: "patient"
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        
        if (err.code === 11000) { // MongoDB duplicate key error
            return res.status(409).json({ message: 'Slot already booked' });
        }
        
        res.status(500).json({ 
            message: 'Failed to book appointment', 
            error: err.message 
        });
    }
};

const createAppointmentForPatient = async (req, res) => {
    try {
        const { patientId, doctorId, appointmentDate, appointmentTime, reason, branch, status = 'Confirmed' } = req.body;
        const currentUser = req.user;

        if (!patientId || !doctorId || !appointmentDate || !appointmentTime || !branch) {
            return res.status(400).json({ 
                message: 'Missing required fields: patientId, doctorId, appointmentDate, appointmentTime, branch' 
            });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (!doctor.branches.includes(branch)) {
            return res.status(400).json({ message: `Doctor not available at ${branch} branch` });
        }

        const schedule = await DoctorSchedule.findOne({ doctorId });
        if (!schedule) {
            return res.status(404).json({ message: 'Doctor schedule not found' });
        }

        const dayName = new Date(appointmentDate).toLocaleString('en-US', { weekday: 'long' });
        const dayAvailability = schedule.weeklyAvailability.find(day => day.day === dayName);

        if (!dayAvailability || dayAvailability.timeSlots.length === 0) {
            return res.status(400).json({ message: 'Doctor not available on this day' });
        }

        const isAvailable = dayAvailability.timeSlots.some(slot => {
            return (
                slot.branch === branch &&
                appointmentTime >= slot.from &&
                appointmentTime <= slot.to
            );
        });

        if (!isAvailable) {
            return res.status(400).json({ message: 'Doctor not available at this time for selected branch' });
        }

        const existingAppointment = await Appointment.findOne({
            doctorId,
            appointmentDate,
            appointmentTime,
            status: { $in: ['Pending', 'Confirmed'] }
        });

        if (existingAppointment) {
            return res.status(409).json({ message: 'Time slot already booked' });
        }

        let confirmedBy = null;
        if (currentUser.role === 'receptionist') {
            confirmedBy = currentUser.id;
        }

        const newAppointment = new Appointment({
            doctorId,
            patientId,
            appointmentDate,
            appointmentTime,
            reason,
            branch,
            status,
            confirmedBy
        });

        await newAppointment.save();

        const populatedAppointment = await Appointment.findById(newAppointment._id)
            .populate('patientId', 'name phone email picture')
            .populate('doctorId', 'name specialization')
            .populate('confirmedBy', 'name');

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment: populatedAppointment
        });

    } catch (err) {
        console.error('Error creating appointment:', err);
        res.status(500).json({ 
            message: 'Failed to book appointment', 
            error: err.message 
        });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patientId', 'name phone email picture')
            .populate('doctorId', 'name specialization email')
            .populate('confirmedBy', 'name')
            .sort({ appointmentDate: -1, appointmentTime: -1 });
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
    }
};

const getAppointmentsByDoctor = async (req, res) => {
    const doctorId = req.user.id;
    try {
        const appointments = await Appointment.find({
            doctorId,
            status: { $in: ["Pending", "Confirmed", "Completed"] },
        })
            .populate('patientId', 'name phone email picture')
            .populate('doctorId', 'name specialization')
            .populate('confirmedBy', 'name')
            .sort({ appointmentDate: -1, appointmentTime: -1 });
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch appointments by doctor', error: error.message });
    }
};

const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { date } = req.query;
        
        const query = { 
            doctorId, 
            status: { $in: ["Pending", "Confirmed", "Completed"] } 
        };
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            
            query.appointmentDate = {
                $gte: startDate,
                $lt: endDate
            };
        }

        const appointments = await Appointment.find(query)
            .populate('patientId', 'name phone email picture')
            .populate('confirmedBy', 'name')
            .sort({ appointmentDate: 1, appointmentTime: 1 });

        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to fetch doctor appointments', 
            error: error.message 
        });
    }
};

const getPatientAppointments = async (req, res) => {
    try {
        const patientId = req.user.id;
        const appointments = await Appointment.find({ patientId })
            .populate('doctorId', 'name specialization picture')
            .populate('confirmedBy', 'name')
            .sort({ appointmentDate: -1, appointmentTime: -1 });

        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to fetch patient appointments', 
            error: error.message 
        });
    }
};

const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const appointment = await Appointment.findById(id)
            .populate('patientId')
            .populate('doctorId', '-password')
            .populate('confirmedBy', 'name');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ appointment });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to fetch appointment', 
            error: error.message 
        });
    }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const currentUser = req.user;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // 🧩 Authorization check
    if (currentUser.role === 'doctor' && appointment.doctorId.toString() !== currentUser.id) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    // 🕐 Check for schedule and conflicts if time or date is changing
    if (updates.appointmentDate || updates.appointmentTime) {
      const appointmentDate = updates.appointmentDate || appointment.appointmentDate;
      const appointmentTime = updates.appointmentTime || appointment.appointmentTime;
      const doctorId = updates.doctorId || appointment.doctorId;
      const branch = updates.branch || appointment.branch;

      const schedule = await DoctorSchedule.findOne({ doctorId });
      if (!schedule) {
        return res.status(404).json({ message: 'Doctor schedule not found' });
      }

      const dayName = new Date(appointmentDate).toLocaleString('en-US', { weekday: 'long' });
      const dayAvailability = schedule.weeklyAvailability.find(day => day.day === dayName);

      if (!dayAvailability || dayAvailability.timeSlots.length === 0) {
        return res.status(400).json({ message: 'Doctor not available on this day' });
      }

      const isAvailable = dayAvailability.timeSlots.some(slot => {
        return slot.branch === branch && appointmentTime >= slot.from && appointmentTime < slot.to;
      });

      if (!isAvailable) {
        return res.status(400).json({ message: 'Doctor not available at the selected time' });
      }

      // 🛑 Check for conflict with other appointments
      const conflicting = await Appointment.findOne({
        doctorId,
        appointmentDate,
        appointmentTime,
        _id: { $ne: id },
        status: { $in: ['Pending', 'Confirmed'] },
      });

      if (conflicting) {
        return res.status(409).json({ message: 'This time slot is already booked' });
      }

      // ✅ Mark rescheduled appointment as Confirmed
      updates.status = 'Confirmed';
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('patientId', 'name phone email picture')
      .populate('doctorId', 'name specialization')
      .populate('confirmedBy', 'name');

    res.status(200).json({
      message: 'Appointment updated and rescheduled successfully',
      appointment: updatedAppointment,
    });
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({
      message: 'Failed to update appointment',
      error: err.message,
    });
  }
};


const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const appointment = await Appointment.findById(id)
            .populate('patientId')
            .populate('doctorId');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (userRole === 'patient' && appointment.patientId._id.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
        }

        if (!['Pending', 'Confirmed'].includes(appointment.status)) {
            return res.status(400).json({ message: 'Cannot cancel completed or already cancelled appointments' });
        }

        appointment.status = 'Cancelled';
        await appointment.save();

        const updatedAppointment = await Appointment.findById(id)
            .populate('patientId', 'name phone email picture')
            .populate('doctorId', 'name specialization')
            .populate('confirmedBy', 'name');

        res.status(200).json({ 
            message: 'Appointment cancelled successfully',
            appointment: updatedAppointment
        });
        io.emit("appointmentStatusUpdated", {
            appointmentId: appointment._id,
            newStatus: "Cancelled",
            doctorId: appointment.doctorId._id.toString(),
            patientId: appointment.patientId._id.toString(),
            updatedBy: req.user.role
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to cancel appointment', 
            error: error.message 
        });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await Appointment.findByIdAndDelete(id);

        res.status(200).json({ 
            message: 'Appointment deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to delete appointment', 
            error: error.message 
        });
    }
};


const markAppointmentCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    const appointment = await Appointment.findById(id)
      .populate('patientId', 'name');

    if (!appointment)
      return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.doctorId.toString() !== doctorId)
      return res.status(403).json({ message: 'Not authorized to complete this appointment' });

    if (appointment.status !== 'Confirmed')
      return res.status(400).json({ message: 'Only confirmed appointments can be marked as completed' });

    if (!appointment.prescription)
      return res.status(400).json({ message: 'Prescription must be added before completion' });

    appointment.status = 'Completed';
    await appointment.save();

    res.status(200).json({ message: 'Appointment marked as completed ✅', appointment });
    io.emit("appointmentStatusUpdated", {
        appointmentId: appointment._id,
        newStatus: appointment.status,
        doctorId: appointment.doctorId.toString(),
        patientId: appointment.patientId._id.toString(),
        updatedBy: "doctor"
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark appointment completed', error: error.message });
  }
};


const attachPrescriptionToAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { prescriptionId } = req.body;
    const doctorId = req.user.id;

    const appointment = await Appointment.findById(id);

    if (!appointment)
      return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.doctorId.toString() !== doctorId)
      return res.status(403).json({ message: 'Not authorized to edit this appointment' });

    if (appointment.status !== 'Confirmed')
      return res.status(400).json({ message: 'Prescription can only be added to confirmed appointments' });

    appointment.prescription = prescriptionId;
    await appointment.save();

    res.status(200).json({ message: 'Prescription linked successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to link prescription', error: error.message });
  }
};


module.exports = {
    createAppointment,
    createAppointmentForPatient,
    getAllAppointments,
    getAppointmentsByDoctor,
    updateAppointment,
    getAppointmentById,
    getDoctorAppointments,
    getPatientAppointments,
    cancelAppointment,
    deleteAppointment,
    markAppointmentCompleted,
    attachPrescriptionToAppointment
};