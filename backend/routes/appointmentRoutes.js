const express = require('express');
const { createAppointment, getAllAppointments, getAppointmentsByDoctor } = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authRoles');
const router = express.Router();


router.post('/', createAppointment);
router.get('/',authMiddleware, authorizeRoles('doctor', 'receptionist'), getAllAppointments);
router.get('/my-appointments', authMiddleware, authorizeRoles('doctor', 'receptionist'), getAppointmentsByDoctor);

module.exports = router;