const express = require('express');
const router = express.Router();
const { createPrescription, getPrescriptionByAppointment } = require('../controllers/prescriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authRoles');

router.post('/',authMiddleware, authorizeRoles('doctor'), createPrescription);
router.get('/:appointmentId',getPrescriptionByAppointment )

module.exports = router;
