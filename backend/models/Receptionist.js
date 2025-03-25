const mongoose = require('mongoose');

const receptionistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
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
    role: {
        type: String,
        default: 'receptionist',
        enum: ['receptionist'],
    }
});

const Receptionist = mongoose.model('Receptionist', receptionistSchema);
module.exports = Receptionist;
