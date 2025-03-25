const Appointment = require('../models/Appointment');

const createAppointment = async (req, res) => {
    const { doctorId, patientId, appointmentDate, appointmentTime, reason } = req.body;

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

module.exports = { createAppointment };
