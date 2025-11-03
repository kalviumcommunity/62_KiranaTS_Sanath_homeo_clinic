const Appointment = require('../models/Appointments');
const DoctorSchedule = require('../models/doctorSchedule');



const createAppointment = async (req, res) => {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;
    const patientId = req.user.id;

    try {
        // 1️⃣ Check if doctor has schedule
        const schedule = await DoctorSchedule.findOne({ doctorId });
        if (!schedule) {
            return res.status(404).json({ message: 'Doctor schedule not found' });
        }

        // 2️⃣ Find the weekday name (e.g. "Monday")
        const dayName = new Date(appointmentDate).toLocaleString('en-US', { weekday: 'long' });

        // 3️⃣ Get doctor’s availability for that day
        const dayAvailability = schedule.weeklyAvailability.find(day => day.day === dayName);

        // 4️⃣ Check if doctor is available at that time
        if (!dayAvailability || !dayAvailability.timeSlots.includes(appointmentTime)) {
            return res.status(400).json({ message: 'Doctor not available at this time' });
        }

        // 5️⃣ Check if slot is already booked
        const existingAppointment = await Appointment.findOne({
            doctorId,
            appointmentDate,
            appointmentTime
        });

        if (existingAppointment) {
            return res.status(409).json({ message: 'Slot already booked' });
        }

        // 6️⃣ Book new appointment
        const newAppointment = new Appointment({
            doctorId,
            patientId,
            appointmentDate,
            appointmentTime,
            reason
        });

        await newAppointment.save();

        res.status(201).json({
            message: 'Appointment successfully booked',
            appointment: newAppointment
        });

    } catch (err) {
        res.status(500).json({ message: 'Failed to book appointment', error: err.message });
    }
};


const getAllAppointments=async(req,res)=>{
    try {
        const appointments=await Appointment.find().populate('patientId').populate({path: 'doctorId', select:'-password'});
        res.status(200).json({appointments});
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
    }
}

const getAppointmentsByDoctor=async(req,res)=>{
    const doctorId=req.user.id
    try {
        const appointments=await Appointment.find({doctorId}).populate('patientId').populate({path: 'doctorId', select:'-password'});
        res.status(200).json({appointments});
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch appointments by doctor', error: error.message });
    }
}

module.exports = { createAppointment, getAllAppointments, getAppointmentsByDoctor };
