// routes/appointmentRoutes.js
const express = require('express');
const { 
    createAppointment, 
    getAllAppointments, 
    getAppointmentsByDoctor, 
    createAppointmentForPatient,
    updateAppointment,
    getAppointmentById,
    getDoctorAppointments,
    getPatientAppointments,
    cancelAppointment,
    deleteAppointment,
    markAppointmentCompleted,
    attachPrescriptionToAppointment
} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authRoles');
const router = express.Router();

// Patient books their own appointment
router.post('/', authMiddleware, authorizeRoles('patient'), createAppointment);

// Staff books appointment for patient
router.post('/book-for-patient', 
    authMiddleware, 
    authorizeRoles('doctor', 'receptionist'), 
    createAppointmentForPatient
);

// Get all appointments (staff only)
router.get('/', 
    authMiddleware, 
    authorizeRoles('doctor', 'receptionist'), 
    getAllAppointments
);

// Get doctor's appointments (for doctor's view)
router.get('/doctor-appointments', 
    authMiddleware, 
    authorizeRoles('doctor'), 
    getAppointmentsByDoctor
);

// Get doctor's schedule for specific date
router.get('/doctor-schedule', 
    authMiddleware, 
    authorizeRoles('doctor'), 
    getDoctorAppointments
);

// Get patient's own appointments
router.get('/my-appointments', 
    authMiddleware, 
    getPatientAppointments
);

// Get specific appointment
router.get('/:id', authMiddleware, getAppointmentById);

// Update appointment
router.put('/:id', 
    authMiddleware, 
    updateAppointment
);

// Cancel appointment
router.patch('/:id/cancel', authMiddleware, cancelAppointment);

// Delete appointment
router.delete('/:id', 
    authMiddleware, 
    authorizeRoles('doctor', 'receptionist'), 
    deleteAppointment
);

// Mark appointment as completed
router.patch('/:id/complete', 
  authMiddleware, 
  authorizeRoles('doctor'), 
  markAppointmentCompleted
);

// Attach prescription before completion
router.patch('/:id/prescription', 
  authMiddleware, 
  authorizeRoles('doctor'), 
  attachPrescriptionToAppointment
);

module.exports = router;