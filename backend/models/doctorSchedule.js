const mongoose=require('mongoose')
const doctorScheduleSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
        unique: true
    },
    weeklyAvailability: {
        Monday: [
            {
                branch: { type: String, required: true },
                start: { type: String, required: true },
                end: { type: String, required: true }
            }
        ],
        Tuesday: [
            {
                branch: { type: String, required: true },
                start: { type: String, required: true },
                end: { type: String, required: true }
            }
        ],
        Wednesday: [
            {
                branch: { type: String, required: true },
                start: { type: String, required: true },
                end: { type: String, required: true }
            }
        ],
        Thursday: [
            {
                branch: { type: String, required: true },
                start: { type: String, required: true },
                end: { type: String, required: true }
            }
        ],
        Friday: [
            {
                branch: { type: String, required: true },
                start: { type: String, required: true },
                end: { type: String, required: true }
            }
        ],
        Saturday: [
            {
                branch: { type: String, required: true },
                start: { type: String, required: true },
                end: { type: String, required: true }
            }
        ]
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
