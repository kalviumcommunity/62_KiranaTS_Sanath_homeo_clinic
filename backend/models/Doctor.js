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
    branches: {
    type: [String],
    enum: ["Horamavu", "Hennur", "Kammanahalli"],
    default: [],
  },
  googleTokens: { type: Object, default: null }
});

const Doctor = mongoose.model('Doctor', doctorSchema, 'Doctors');
module.exports = Doctor;
