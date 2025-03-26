const express = require('express');
const router = express.Router();
const { createPrescription, getPrescriptionByAppointment } = require('../controllers/prescriptionController');

router.post('/', createPrescription);
router.get('/:appointmentId',getPrescriptionByAppointment )

module.exports = router;
