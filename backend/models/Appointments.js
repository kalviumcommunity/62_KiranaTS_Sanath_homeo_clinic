const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    branch: {
        type: String,
        enum: ['Horamavu', 'Hennur', 'Kammanahalli'],
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    reason: {
        type: String
    },
    confirmedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Receptionist',
        default: null
    },
    prescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription',
    },
    cancelledBy: {
    type: String,
    enum: ['Doctor', 'Patient', null],
    default: null
    },
    cancelReason: {
        type: String,
        default: null
    }
}, { timestamps: true });


appointmentSchema.index(
  { 
    doctorId: 1, 
    appointmentDate: 1, 
    appointmentTime: 1 
  }, 
  { 
    unique: true,
    partialFilterExpression: {
      status: { $in: ['Pending', 'Confirmed'] }
    }
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
