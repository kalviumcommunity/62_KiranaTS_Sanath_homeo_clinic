// const Appointment = require("../models/Appointments");
const Patient = require("../models/Patient");
const jwt=require('jsonwebtoken');
const cookie=require('cookie-parser');
const bcrypt=require('bcryptjs');
const Prescription = require('../models/Prescription');


//register

const signup = async (req, res) => {
    try {
        const { name, phone, dob, gender, email, doctorId } = req.body;
        const picture = req.file?.filename;
        
        if (!picture) {
            return res.status(400).json({ message: "Picture is required" });
        }

        const existing = await Patient.findOne({
          phone,
          dob,
          name: { $regex: `^${name}$`, $options: 'i' } // case-insensitive match
        });

        if (existing) {
          return res.status(400).json({ message: "Patient already exists with same name, phone and DOB." });
        }


        const newPatient = new Patient({ name, phone, dob, gender, email, doctorId, picture });
        await newPatient.save();

        // Generate token for new patient
        const token = jwt.sign(
            { id: newPatient._id, role: "patient" },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ 
            message: "Patient registered successfully", 
            token,
            patient: newPatient 
        });
    } catch (error) {
        res.status(500).json({ message: "Error signing up patient", error });
    }
};

const login = async (req, res) => {
  try {
    const { name, phone, dob } = req.body;

    if (!phone || !dob) {
      return res.status(400).json({ message: 'Phone and Date of Birth are required' });
    }

    // Find all patients with the same phone number
    const patients = await Patient.find({
      phone,
      name: { $regex: `^${name}$`, $options: 'i' },
    });

    if (patients.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const inputDOB = new Date(dob);

    // Match by exact date (ignoring time)
    const matchingPatient = patients.find(p => {
      const dbDOB = new Date(p.dob);
      return (
        dbDOB.getFullYear() === inputDOB.getFullYear() &&
        dbDOB.getMonth() === inputDOB.getMonth() &&
        dbDOB.getDate() === inputDOB.getDate()
      );
    });

    if (!matchingPatient) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: matchingPatient._id, role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      patient: {
        _id: matchingPatient._id,
        name: matchingPatient.name,
        phone: matchingPatient.phone,
        email: matchingPatient.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getPatientsForDoc=async(req,res)=>{
    const doctorId = req.user.id;
    const patients = await Patient.find({ doctorId });
    try {
        res.status(200).json({patients});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error });
    }
}


const getFamilyByPhone = async (req, res) => {
  const { phone } = req.params;

  try {
    const familyMembers = await Patient.find({ phone });
    res.status(200).json({ familyMembers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching family", error });
  }
};


module.exports={signup, login, getPatientsForDoc, getFamilyByPhone};