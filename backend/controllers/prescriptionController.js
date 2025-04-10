const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointments');
const Doctor = require('../models/Doctor');

const createPrescription = async (req, res) => {
    const { appointmentId, medicines, instructions } = req.body;
    const doctorId = req.user.id;

    try {
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.doctorId.toString() !== doctorId) {
            return res.status(403).json({ message: 'This doctor is not assigned to this appointment' });
        }

        const prescription = new Prescription({
            appointmentId,
            doctorId,
            patientId: appointment.patientId,
            medicines,
            instructions
        });

        await prescription.save();

        appointment.prescription = prescription._id;
        await appointment.save();

        res.status(201).json({
            message: 'Prescription created successfully',
            prescription
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating prescription', error: error.message });
    }
};

const getPrescriptionByAppointment=async(req,res)=>{
    const {appointmentId}=req.params;
    try {
        const prescription=await Prescription.findOne({appointmentId});
        if(!prescription){
            return res.status(404).json({message: 'Prescription not found'});
        }
        res.status(200).json({prescription});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching prescription', error: error.message });
    }
}

module.exports = { createPrescription, getPrescriptionByAppointment };
