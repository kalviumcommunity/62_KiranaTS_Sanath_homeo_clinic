const express = require('express');
const router = express.Router();
const { createPrescription, getPrescriptionByAppointment, getPrescriptionById } = require('../controllers/prescriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authRoles');

router.post('/',authMiddleware, authorizeRoles('doctor'), createPrescription);
router.get('/:appointmentId',getPrescriptionByAppointment )
router.get('/id/:prescriptionId', getPrescriptionById);

module.exports = router;
