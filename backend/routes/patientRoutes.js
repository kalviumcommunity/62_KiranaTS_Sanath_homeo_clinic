const express = require('express');
const router = express.Router();
const {signup, login, getPatientsForDoc} = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authRoles');

router.post('/signup', signup);
router.post('/login', login)
router.get('/my-patients',authMiddleware, authorizeRoles('doctor', 'receptionist'), getPatientsForDoc);

module.exports = router;
