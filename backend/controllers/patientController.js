// const Appointment = require("../models/Appointments");
const Patient = require("../models/Patient");
const jwt=require('jsonwebtoken');
const cookie=require('cookie-parser');
const bcrypt=require('bcryptjs');

//register

const signup=async(req,res)=>{
    try {
        const {name, phone, dob, gender, email, doctorId}=req.body;
        const existing=await Patient.findOne({phone, dob});
        if (existing) {
            return res.status(400).json({ message: "Patient already exists." });
        }
        const newPatient=new Patient({name, phone, dob, gender, email, doctorId})
        await newPatient.save();
        res.status(201).json({ message: "Patient registered successfully", patient: newPatient });
    } catch (error) {
        res.status(500).json({ message: "Error signing up patient", error });
    }
}

const login=async(req,res)=>{
    try {
        const {phone, dob}=req.body;
        if(!phone || !dob){
            return res.status(400).json({ message: 'Phone and Date of Birth are required' });
        }
        const patient=await Patient.findOne({phone, dob});
        if (!patient || patient.dob.toISOString().split('T')[0] !== dob) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token=jwt.sign({id: patient._id, role:"patient"}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: 'Login successful', token, patient });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({error});
    }
}
const getPatientsForDoc=async(req,res)=>{
    const doctorId = req.user.id;
    const patients = await Patient.find({ doctorId });
    try {
        res.status(200).json({patients});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error });
    }
}

module.exports={signup, login, getPatientsForDoc};