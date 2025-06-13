const express = require('express');
const router = express.Router();
const {signup, login, getPatientsForDoc, getFamilyByPhone} = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authRoles');
const upload = require("../middleware/upload");


router.post('/signup', upload.single("picture"), signup);
router.post('/login', login)
router.get('/my-patients',authMiddleware, authorizeRoles('doctor', 'receptionist'), getPatientsForDoc);
router.get("/family/:phone", getFamilyByPhone);

module.exports = router;
