const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const { v4: uuidv4 } = require("uuid"); // ✅ Added for family_code

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Check authentication
router.get('/check', authMiddleware, (req, res) => {
  res.status(200).json({
    isAuthenticated: true,
    role: req.user.role,
  });
});

// Google signup/login
// Google signup/login
router.post('/google', async (req, res) => {
  const { token: googleToken, dob, phone, gender, doctorId, name, email } = req.body;

  try {
    const ticket = await client.verifyIdToken({ 
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, picture: googlePicture } = payload;
    const userEmail = email || payload.email;
    const userName = name || payload.name;

    // Check if patient already exists with this Google ID
    let patient = await Patient.findOne({ googleId });

    if (patient) {
      // Ensure family_code exists
      if (!patient.family_code) {
        patient.family_code = uuidv4();
        await patient.save();
      }

      const token = jwt.sign(
        { id: patient._id, role: "patient" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Fetch all family members using same family_code
      const familyMembers = await Patient.find({
        family_code: patient.family_code
      }).select('_id name phone email gender dob relationship_type picture');

      return res.status(200).json({ 
        success: true,
        token, 
        patient,
        familyMembers, // ✅ include family list
        message: "Google login successful" 
      });
    }

    // Check if manual account exists with same email
    const existingManualPatient = await Patient.findOne({ 
      email: userEmail,
      googleId: { $exists: false }
    });

    if (existingManualPatient) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered manually. Please login with phone and DOB first, then link your Google account.",
      });
    }

    // NEW GOOGLE SIGNUP - validate all required fields
    if (!dob || !phone || !gender || !doctorId || !userName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for Google signup",
        requiredFields: ['name', 'phone', 'dob', 'gender', 'doctorId']
      });
    }

    // Check if a patient already exists with same name, phone, DOB
    const existingPatient = await Patient.findOne({
      phone,
      dob,
      name: { $regex: `^${userName}$`, $options: 'i' }
    });

    if (existingPatient) {
      return res.status(400).json({ 
        success: false,
        message: "Patient already exists with same name, phone, and DOB." 
      });
    }

    // Generate a family_code for the new patient
    const family_code = uuidv4();

    const newPatient = new Patient({
      name: userName,
      phone,
      dob,
      gender,
      email: userEmail,
      doctorId,
      picture: googlePicture,
      googleId,
      family_code,  // assign family code here
    });

    await newPatient.save();

    const token = jwt.sign(
      { id: newPatient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Fetch all family members (for a new signup, this will just be one)
    const familyMembers = await Patient.find({
      family_code: newPatient.family_code
    }).select('_id name phone email gender dob relationship_type picture');

    res.status(201).json({ 
      success: true,
      token, 
      patient: newPatient,
      familyMembers, // Include family list
      message: "Google signup successful" 
    });

  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ 
      success: false,
      message: "Invalid Google token" 
    });
  }
});


// Link Google to existing account
router.post('/link-google', authMiddleware, async (req, res) => {
  const { token: googleToken } = req.body;
  const patientId = req.user.id;

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({ 
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, picture: googlePicture } = payload;

    // Check if Google account is already linked to another patient
    const existingGooglePatient = await Patient.findOne({ 
      googleId: googleId 
    });
    
    if (existingGooglePatient && existingGooglePatient._id.toString() !== patientId) {
      return res.status(400).json({
        success: false,
        message: "This Google account is already linked to another patient account."
      });
    }

    // Get current patient data
    const currentPatient = await Patient.findById(patientId);

    // Ensure family_code exists
    const family_code = currentPatient.family_code || uuidv4();

    // Update the patient with Google ID and family_code if missing
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { 
        googleId: googleId,
        family_code, // assign if missing
        ...(googlePicture && !currentPatient.picture && { picture: googlePicture })
      },
      { new: true }
    );

    // Generate new token
    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Update cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Fetch all family members using same family_code
    const familyMembers = await Patient.find({
      family_code: patient.family_code
    }).select('_id name phone email gender dob relationship_type picture');

    res.status(200).json({
      success: true,
      message: "Google account linked successfully!",
      patient,
      token,
      familyMembers 
    });

  } catch (error) {
    console.error("Google linking error:", error);
    res.status(401).json({ 
      success: false,
      message: "Invalid Google token" 
    });
  }
});


module.exports = router;
