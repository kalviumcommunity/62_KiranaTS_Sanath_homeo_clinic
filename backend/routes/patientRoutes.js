const express = require('express');
const router = express.Router();
const {signup, login, getPatientsForDoc, addFamilyMember, getFamilyMembers, switchFamilyMember, currentPatient, searchPatients, getAppointmentsByPatient} = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authRoles');
const upload = require("../middleware/upload");


router.post('/signup', upload.single("picture"), signup);
router.post('/login', login)
router.get('/my-patients',authMiddleware, authorizeRoles('doctor', 'receptionist'), getPatientsForDoc);
router.post('/add-family-member', authMiddleware, upload.single("picture"), addFamilyMember);
router.get('/family-members', authMiddleware, getFamilyMembers);
router.post('/switch-patient', authMiddleware, switchFamilyMember);
router.get('/current', authMiddleware, currentPatient);
router.get("/search", authMiddleware, authorizeRoles("doctor", "receptionist"), searchPatients);
router.get('/patient-appointments', 
  authMiddleware, 
  authorizeRoles('patient'), 
  getAppointmentsByPatient
);

module.exports = router;
