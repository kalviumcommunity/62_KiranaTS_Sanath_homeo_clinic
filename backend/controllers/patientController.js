// const Appointment = require("../models/Appointments");
const Patient = require("../models/Patient");
const jwt=require('jsonwebtoken');
const cookie=require('cookie-parser');
const { v4: uuidv4 } = require('uuid');


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

        const family_code = uuidv4();

        const newPatient = new Patient({ name, phone, dob, gender, email, doctorId, picture,
          relationship_type: 'self', 
          family_code
         });
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
            sameSite: 'None',
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
      phone: phone,
      name: { $regex: `^${name}$`, $options: 'i' },
    });

    if (patients.length === 0) {
      return res.status(401).json({ message: 'Invalid , patients not found' });
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

    const familyMembers = await Patient.find({
      family_code: matchingPatient.family_code
    }).select('_id name phone email gender dob relationship_type picture');

    // Create token
    const token = jwt.sign(
      { id: matchingPatient._id, role: 'patient',  family_code: matchingPatient.family_code },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
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
        relationship_type: matchingPatient.relationship_type,
      },
      familyMembers,
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


const addFamilyMember = async (req, res) => {
    try {
        const { name, dob, gender, email, doctorId, phone, relationship_type, existing_patient_id } = req.body;
        const picture = req.file?.filename;

        if (!picture) {
            return res.status(400).json({ message: "Picture is required" });
        }

        // Fetch the existing patient to get their family_code
        const existingPatient = await Patient.findById(existing_patient_id);
        if (!existingPatient) {
            return res.status(404).json({ message: "Existing patient not found" });
        }

        const family_code = existingPatient.family_code;

        const newPatient = new Patient({
            name,
            dob,
            gender,
            email,
            doctorId,
            phone,
            picture,
            relationship_type: relationship_type || 'other',
            family_code
        });

        await newPatient.save();

        res.status(201).json({
            message: 'Family member added successfully',
            patient: newPatient,
            family_code
        });

    } catch (error) {
        res.status(500).json({ message: 'Error adding family member', error: error.message });
    }
};


const getFamilyMembers = async (req, res) => {
    try {
        const { existing_patient_id } = req.query;

        // Find the existing patient
        const existingPatient = await Patient.findById(existing_patient_id);
        if (!existingPatient) {
            return res.status(404).json({ message: "Existing patient not found" });
        }

        // Fetch all patients with the same family_code
        const familyMembers = await Patient.find({ family_code: existingPatient.family_code });

        res.status(200).json({
            message: "Family members fetched successfully",
            familyMembers
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching family members", error: error.message });
    }
};

// Add this to your patientController
const switchFamilyMember = async (req, res) => {
  try {
    const { patientId } = req.body;
    const currentUserId = req.user.id;

    // Verify the target patient exists and is in the same family
    const currentPatient = await Patient.findById(currentUserId);
    const targetPatient = await Patient.findById(patientId);

    if (!targetPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (targetPatient.family_code !== currentPatient.family_code) {
      return res.status(403).json({ message: 'Not authorized to switch to this patient' });
    }

    // Create new token for the switched patient
    const token = jwt.sign(
      { 
        id: targetPatient._id, 
        role: 'patient',
        family_code: targetPatient.family_code
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Switched patient successfully',
      token,
      currentPatient: {
        _id: targetPatient._id,
        name: targetPatient.name,
        phone: targetPatient.phone,
        email: targetPatient.email,
        relationship_type: targetPatient.relationship_type,
        picture: targetPatient.picture,
        family_code: targetPatient.family_code
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error switching patient', error: error.message });
  }
};

const currentPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const familyMembers = await Patient.find({ 
      family_code: patient.family_code 
    }).select('_id name phone email gender dob relationship_type picture');

    res.status(200).json({
      patient: {
        _id: patient._id,
        name: patient.name,
        phone: patient.phone,
        email: patient.email,
        relationship_type: patient.relationship_type,
        picture: patient.picture,
        family_code: patient.family_code
      },
      familyMembers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient data', error: error.message });
  }
};



module.exports={signup, login, getPatientsForDoc, addFamilyMember, getFamilyMembers, switchFamilyMember, currentPatient};