const mongoose = require('mongoose');

const doctorScheduleSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
        unique: true
    },
    weeklyAvailability: {
        Monday: [{ start: String, end: String }],
        Tuesday: [{ start: String, end: String }],
        Wednesday: [{ start: String, end: String }],
        Thursday: [{ start: String, end: String }],
        Friday: [{ start: String, end: String }],
        Saturday: [{ start: String, end: String }]
    },
    holidays: [Date],
    blockedSlots: [
        {
            date: { type: Date, required: true },
            start: { type: String, required: true },
            end: { type: String, required: true }
        }
    ]
});

const DoctorSchedule = mongoose.model('DoctorSchedule', doctorScheduleSchema);
module.exports = DoctorSchedule;
