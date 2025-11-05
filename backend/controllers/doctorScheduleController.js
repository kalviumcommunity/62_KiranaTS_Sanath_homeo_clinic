const DoctorSchedule = require('../models/doctorSchedule');
const Appointment = require('../models/Appointments');
const { isValidObjectId } = require('mongoose');
const Doctor = require('../models/Doctor');



// Helper: parse "HH:MM" into minutes-from-midnight
const timeToMinutes = (t) => {
  const [hh, mm] = String(t).split(':').map(Number);
  return hh * 60 + (mm || 0);
};

// Helper: minutes to "HH:MM"
const minutesToTime = (m) => {
  const hh = Math.floor(m / 60).toString().padStart(2, '0');
  const mm = (m % 60).toString().padStart(2, '0');
  return `${hh}:${mm}`;
};

// Check overlap between two ranges in minutes [a1,a2) and [b1,b2)
const rangesOverlap = (a1, a2, b1, b2) => !(a2 <= b1 || b2 <= a1);

// Create or Update Doctor Schedule
const createOrUpdateSchedule = async (req, res) => {
    try {
        const { doctorId, weeklyAvailability, slotDuration } = req.body;

        let schedule = await DoctorSchedule.findOne({ doctorId });

        if (schedule) {
            // update existing schedule
            schedule.weeklyAvailability = weeklyAvailability || schedule.weeklyAvailability;
            schedule.slotDuration = slotDuration || schedule.slotDuration;
            await schedule.save();
            return res.status(200).json({ message: "Schedule updated successfully", schedule });
        } else {
            // create new schedule
            const newSchedule = new DoctorSchedule({
                doctorId,
                weeklyAvailability,
                slotDuration
            });
            await newSchedule.save();
            return res.status(201).json({ message: "Schedule created successfully", newSchedule });
        }

    } catch (error) {
        console.error("Error creating/updating schedule:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Get Doctor Schedule
const getSchedule = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const schedule = await DoctorSchedule.findOne({ doctorId });
        if (!schedule) return res.status(404).json({ message: "Schedule not found" });
        res.status(200).json(schedule);
    } catch (error) {
        console.error("Error fetching schedule:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Add Blocked Slot
const addBlockedSlot = async (req, res) => {
    try {
        const { doctorId, date, from, to, reason } = req.body;

        const schedule = await DoctorSchedule.findOne({ doctorId });
        if (!schedule) return res.status(404).json({ message: "Schedule not found" });

        schedule.blockedSlots.push({ date, from, to, reason });
        await schedule.save();
        res.status(200).json({ message: "Blocked slot added", schedule });
    } catch (error) {
        console.error("Error adding blocked slot:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Add Holiday
const addHoliday = async (req, res) => {
    try {
        const { doctorId, date, reason } = req.body;

        const schedule = await DoctorSchedule.findOne({ doctorId });
        if (!schedule) return res.status(404).json({ message: "Schedule not found" });

        schedule.holidays.push({ date, reason });
        await schedule.save();
        res.status(200).json({ message: "Holiday added successfully", schedule });
    } catch (error) {
        console.error("Error adding holiday:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete Schedule 
const deleteSchedule = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const deleted = await DoctorSchedule.findOneAndDelete({ doctorId });
        if (!deleted) return res.status(404).json({ message: "Schedule not found" });
        res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (error) {
        console.error("Error deleting schedule:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const { branch } = req.query;

    if (!isValidObjectId(doctorId))
      return res.status(400).json({ message: 'Invalid doctorId' });
    if (!date) return res.status(400).json({ message: 'Date required' });
    if (!branch)
      return res.status(400).json({ message: 'Branch is required' });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    if (!doctor.branches.includes(branch))
      return res.status(400).json({ message: `Doctor not available in ${branch}` });

    const schedule = await DoctorSchedule.findOne({ doctorId });
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

    const isoDate = new Date(date).toISOString().split('T')[0];
    const slotDuration = schedule.slotDuration || 30;

    // Check if it's a holiday
    const isHoliday = (schedule.holidays || []).some(
      h => new Date(h.date).toISOString().split('T')[0] === isoDate
    );
    if (isHoliday)
      return res.status(200).json({ message: 'Holiday — no slots', slots: [] });

    // Get the day name (e.g. Monday)
    const weekdayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const targetDate = new Date(date + 'T00:00:00');
    const dayName = weekdayNames[targetDate.getDay()];

    const dayAvailability = (schedule.weeklyAvailability || []).find(d => d.day === dayName);
    if (!dayAvailability)
      return res.status(200).json({ slots: [] });

    const branchSlots = (dayAvailability.timeSlots || []).filter(
      s => s.branch === branch
    );

    if (!branchSlots.length)
      return res.status(200).json({ message: `No slots for ${branch}`, slots: [] });

    const blockedForDate = (schedule.blockedSlots || []).filter(
      b => new Date(b.date).toISOString().split('T')[0] === isoDate
    );

    // 🟡 FIX: use correct Appointment field names (appointmentDate + appointmentTime)
    const appointments = await Appointment.find({
      doctorId,
      branch,
      appointmentDate: {
        $gte: new Date(date + 'T00:00:00Z'),
        $lte: new Date(date + 'T23:59:59Z')
      },
      status: { $in: ['Pending', 'Confirmed'] }
    });

    const bookedTimes = appointments.map(a => a.appointmentTime);

    // Generate slots
    const slots = [];
    for (const ts of branchSlots) {
      const startMin = timeToMinutes(ts.from);
      const endMin = timeToMinutes(ts.to);

      for (let s = startMin; s + slotDuration <= endMin; s += slotDuration) {
        const e = s + slotDuration;
        const from = minutesToTime(s);
        const to = minutesToTime(e);

        // Check booked or blocked
        const isBooked = bookedTimes.includes(from);
        const isBlocked = blockedForDate.some(r =>
          rangesOverlap(s, e, timeToMinutes(r.from), timeToMinutes(r.to))
        );

        slots.push({
          from,
          to,
          booked: isBooked || isBlocked
        });
      }
    }

    return res.status(200).json({ date: isoDate, branch, slots });
  } catch (err) {
    console.error('Error in getAvailableSlots:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};




// Delete blocked slot by its _id
const deleteBlockedSlot = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const schedule = await DoctorSchedule.findOneAndUpdate(
      { 'blockedSlots._id': id },
      { $pull: { blockedSlots: { _id: id } } },
      { new: true }
    );
    if (!schedule) return res.status(404).json({ message: 'Blocked slot not found' });

    res.status(200).json({ message: 'Blocked slot removed', schedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete holiday by _id
const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const schedule = await DoctorSchedule.findOneAndUpdate(
      { 'holidays._id': id },
      { $pull: { holidays: { _id: id } } },
      { new: true }
    );
    if (!schedule) return res.status(404).json({ message: 'Holiday not found' });

    res.status(200).json({ message: 'Holiday removed', schedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = { createOrUpdateSchedule, getSchedule, addBlockedSlot, addHoliday, deleteSchedule, getAvailableSlots, deleteBlockedSlot, deleteHoliday };