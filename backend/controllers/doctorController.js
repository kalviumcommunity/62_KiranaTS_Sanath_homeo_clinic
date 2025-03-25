const Doctor = require("../models/Doctor");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//login
const login=async(req,res)=>{
    try {
            const { email, password } = req.body;
    
            const doctor = await Doctor.findOne({ email });
            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }
    
            const isMatch = await bcrypt.compare(password, doctor.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }
    
            const token = jwt.sign(
                { id: doctor._id, role: "doctor" },
                process.env.JWT_SECRET,
                { expiresIn: '14d' }
            );
    
            res.status(200).json({
                message: "Login successful",
                token,
                doctor
            });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

module.exports={login};