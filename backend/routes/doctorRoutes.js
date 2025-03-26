const express = require('express');
const { login, getAllDoctors, setDoctorAvailability, getAvailableSlots } = require('../controllers/doctorController');
const router = express.Router();


router.post('/login', login);
router.post('/doctor/:doctorId/set-availability', setDoctorAvailability)
router.get('/', getAllDoctors);
router.get('/doctor/:doctorId/available-slots', getAvailableSlots);

module.exports = router;