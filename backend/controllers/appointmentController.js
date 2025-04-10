const Appointment = require('../models/Appointments');
const Prescription = require('../models/Prescription');


const createAppointment = async (req, res) => {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;
    const patientId = req.user.id;

    try {
        const existingAppointment = await Appointment.findOne({
            doctorId,
            appointmentDate,
            appointmentTime
        });
        if (existingAppointment) {
            return res.status(409).json({ message: 'Slot already booked' });
        }
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
