const Appointment = require("../models/Appointments");
const Patient = require("../models/Patient");

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
        if (!patient) {
            return res.status(404).json({ message: 'Invalid login credentials' });
        }
        res.status(200).json({ message: 'Login successful', patient });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
const getPatientsForDoc=async(req,res)=>{
    const {doctorId}=req.params;
    try {
        const patients=await Patient.find({doctorId});
        res.status(200).json({patients});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error });
    }
}

module.exports={signup, login, getPatientsForDoc};