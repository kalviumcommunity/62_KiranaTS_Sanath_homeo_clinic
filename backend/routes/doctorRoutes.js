const express = require('express');
const { login, getAllDoctors, setDoctorAvailability, getAvailableSlots } = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authRoles');
const router = express.Router();


router.post('/login', login);
router.post('/availability',authMiddleware, authorizeRoles('doctor', 'receptionist'), setDoctorAvailability)
router.get('/', getAllDoctors);
router.get('/doctor/:doctorId/available-slots', getAvailableSlots);

module.exports = router;