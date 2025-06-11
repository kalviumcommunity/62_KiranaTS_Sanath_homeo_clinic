const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    availability: [
        {
            branch: {
                type: String,
                required: true
            },
            days: {
                type: [String],
                required: true
            },
            timeSlots: [
                {
                    from: String,
                    to: String
                }
            ]
        }
    ]
});

const Doctor = mongoose.model('Doctor', doctorSchema, 'Doctors');
module.exports = Doctor;
