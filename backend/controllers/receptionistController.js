const Receptionist = require('../models/Receptionist');
const jwt=require('jsonwebtoken');
const cookie=require('cookie-parser');
const bcrypt=require('bcryptjs');
const Prescription = require('../models/Prescription');


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const receptionist = await Receptionist.findOne({ email });
        if (!receptionist) {
            return res.status(404).json({ message: "Receptionist not found" });
        }

        const isMatch = await bcrypt.compare(password, receptionist.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { _id: receptionist._id, role: 'receptionist' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
          

        res.status(200).json({
            message: "Login successful",
            token,
            receptionist
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { login };
