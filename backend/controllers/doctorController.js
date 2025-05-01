const Doctor = require("../models/Doctor");
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const bcrypt = require('bcryptjs');
const DoctorSchedule = require('../models/doctorSchedule');
const Appointment = require('../models/Appointments');
const mongoose = require('mongoose');
const Prescription = require('../models/Prescription');


// Doctor Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const doctor = await Doctor.findOne({ email }).select('+password');

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: doctor._id, role: 'doctor' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

        res.status(200).json({
            message: "Login successful",
            token,
            doctor
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get All Doctors
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}, 'name email');
        res.status(200).json({ doctors });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
};

// Set Doctor Weekly Availability
const setDoctorAvailability = async (req, res) => {
    const doctorId = new mongoose.Types.ObjectId(req.user._id);
    const { weeklyAvailability } = req.body;

    if (!weeklyAvailability) {
        return res.status(400).json({ message: "weeklyAvailability is required" });
    }

    try {
        let schedule = await DoctorSchedule.findOne({ doctorId });

        if (!schedule) {
            schedule = new DoctorSchedule({
                doctorId,
                weeklyAvailability
            });
        } else {
            for (const day in weeklyAvailability) {
                schedule.weeklyAvailability[day] = weeklyAvailability[day];
            }
        }

        await schedule.save();
        res.status(200).json({ message: "Availability set successfully", schedule });
    } catch (error) {
        res.status(500).json({ message: "Error setting availability", error });
    }
};

// Get Available Slots for a Doctor on a Specific Date
const getAvailableSlots = async (req, res) => {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ error: 'Date is required' });

    try {
        const schedule = await DoctorSchedule.findOne({ doctorId });
        if (!schedule) return res.status(404).json({ error: 'Doctor schedule not found' });

        const inputDate = new Date(date);
        const day = inputDate.toLocaleString('en-US', { weekday: 'long' });

        // If it's a holiday, return no slots
        if (schedule.holidays.some(d => d.toDateString() === inputDate.toDateString())) {
            return res.json([]);
        }

        let slots = schedule.weeklyAvailability[day] || [];

        // Filter out blocked slots
        const blocked = schedule.blockedSlots.filter(b =>
            new Date(b.date).toDateString() === inputDate.toDateString()
        );

        slots = slots.filter(slot => {
            for (let b of blocked) {
                if (slot.start === b.start && slot.end === b.end) return false;
            }
            return true;
        });

        // Filter out booked slots
        const bookedAppointments = await Appointment.find({
            doctorId,
            appointmentDate: inputDate
        });

        slots = slots.filter(slot => {
            for (let appt of bookedAppointments) {
                if (appt.appointmentTime === slot.start) return false;
            }
            return true;
        });

        return res.json(slots);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    login,
    getAllDoctors,
    setDoctorAvailability,
    getAvailableSlots
};
