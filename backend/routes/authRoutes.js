const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ Route to check authentication status
router.get('/check', authMiddleware, (req, res) => {
  res.status(200).json({
    isAuthenticated: true,
    role: req.user.role,
  });
});

// ✅ Route for Google login/signup
router.post('/google', async (req, res) => {
  // ❗ Renamed `token` → `googleToken` to avoid name conflict later
  const { token: googleToken, dob, phone, gender, doctorId, name, email } = req.body;

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({ 
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, picture: googlePicture } = payload;

    // Use provided email or fallback to Google payload
    const userEmail = email || payload.email;
    const userName = name || payload.name;

    // Check if patient already exists with this Google ID
    let patient = await Patient.findOne({ googleId });

    if (patient) {
      // ✅ Existing Google user - login
      const token = jwt.sign(
        { id: patient._id, role: "patient" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({ 
        token, 
        patient,
        message: "Google login successful" 
      });
    }

    // Check if email already exists with manual registration (non-Google)
    const existingManualPatient = await Patient.findOne({ 
      email: userEmail,
      googleId: { $exists: false }
    });

    if (existingManualPatient) {
      return res.status(400).json({
        message: "This email is already registered manually. Please use phone and DOB to login.",
      });
    }

    // NEW GOOGLE SIGNUP - validate all required fields
    if (!dob || !phone || !gender || !doctorId || !userName) {
      return res.status(400).json({
        message: "All fields are required for Google signup: name, phone, DOB, gender, and doctorId",
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
        message: "Patient already exists with same name, phone, and DOB." 
      });
    }

    // ✅ Create new patient with Google signup
    const newPatient = new Patient({
      name: userName,
      phone,
      dob,
      gender,
      email: userEmail,
      doctorId,
      picture: googlePicture, // Google profile picture
      googleId
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

    res.status(201).json({ 
      token, 
      patient: newPatient,
      message: "Google signup successful" 
    });

  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

module.exports = router;
