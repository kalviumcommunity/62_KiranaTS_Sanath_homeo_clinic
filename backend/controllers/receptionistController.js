const Receptionist = require('../models/Receptionist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
            { id: receptionist._id, role: "receptionist" },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

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
