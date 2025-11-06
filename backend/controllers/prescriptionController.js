const Appointment = require('../models/Appointments');
const Doctor = require('../models/Doctor');
const Prescription = require('../models/Prescription');
const mongoose = require('mongoose');

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

const getPrescriptionById = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    
    
    if (!mongoose.Types.ObjectId.isValid(prescriptionId)) {
      return res.status(400).json({ message: 'Invalid prescription ID' });
    }

    const prescription = await Prescription.findById(prescriptionId)
      .populate('doctorId', 'name specialization')
      .populate('patientId', 'name phone');


    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json({
      message: 'Prescription fetched successfully',
      prescription
    });
  } catch (error) {
    console.error('Error fetching prescription by ID:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = { createPrescription, getPrescriptionByAppointment, getPrescriptionById };
