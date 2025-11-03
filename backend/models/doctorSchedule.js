const mongoose = require('mongoose');

const doctorScheduleSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },

  // Weekly default availability
  weeklyAvailability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
      },
      timeSlots: [
        {
          from: { type: String, required: true },
          to: { type: String, required: true },

          // 🟢 Added: which branch the slot belongs to
          branch: { type: String, required: true }
        }
      ]
    }
  ],

  // Specific blocked slots (temporary exceptions)
  blockedSlots: [
    {
      date: { type: Date, required: true },
      from: { type: String, required: true },
      to: { type: String, required: true },
      reason: { type: String }
    }
  ],

  // Full-day holidays or leaves
  holidays: [
    {
      date: { type: Date, required: true },
      reason: { type: String }
    }
  ],

  // Slot duration (for generating bookable slots)
  slotDuration: {
    type: Number,
    default: 30 // mins
  }

}, { timestamps: true });

const DoctorSchedule = mongoose.model('DoctorSchedule', doctorScheduleSchema);
module.exports = DoctorSchedule;
