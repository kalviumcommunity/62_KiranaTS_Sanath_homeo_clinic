const express = require('express');
const { createAppointment } = require('../controllers/appointmentController');
const router = express.Router();


router.post('/login', createAppointment);

module.exports = router;