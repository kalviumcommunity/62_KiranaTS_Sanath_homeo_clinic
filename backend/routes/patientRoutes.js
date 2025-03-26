const express = require('express');
const router = express.Router();
const {signup, login, getPatientsForDoc} = require('../controllers/patientController')

router.post('/signup', signup);
router.post('/login', login)
router.get('/doctor/:doctorId', getPatientsForDoc);

module.exports = router;
