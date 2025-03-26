const express = require('express');
const { createAppointment, getAllAppointments, getAppointmentsByDoctor } = require('../controllers/appointmentController');
const router = express.Router();


router.post('/', createAppointment);
router.get('/', getAllAppointments);
router.get('/:doctorId', getAppointmentsByDoctor);

module.exports = router;