const DoctorSchedule = require('../models/doctorSchedule');
const Appointment = require('../models/Appointments');
const { isValidObjectId } = require('mongoose');



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
    const { doctorId, date } = req.params; // e.g. date = '2025-11-04'

    if (!isValidObjectId(doctorId)) return res.status(400).json({ message: 'Invalid doctorId' });
    if (!date) return res.status(400).json({ message: 'Date required (YYYY-MM-DD)' });

    // Normalize date consistently
    const isoDateStr = new Date(date).toISOString().split('T')[0];

    const schedule = await DoctorSchedule.findOne({ doctorId });
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

    const slotDuration = schedule.slotDuration || 30;

    // ✅ 1) Proper holiday check — normalized both sides to YYYY-MM-DD
    const isHoliday = (schedule.holidays || []).some(h => {
      const stored = new Date(h.date).toISOString().split('T')[0];
      return stored === isoDateStr;
    });

    if (isHoliday) {
      return res.status(200).json({ message: 'Holiday — no available slots', date: isoDateStr, slots: [] });
    }

    // 2) Determine weekday name
    const weekdayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const targetDate = new Date(date + 'T00:00:00');
    const dayName = weekdayNames[targetDate.getDay()];

    // 3) Find availability for that weekday
    const dayAvailability = (schedule.weeklyAvailability || []).find(d => d.day === dayName);
    if (!dayAvailability || !dayAvailability.timeSlots?.length) {
      return res.status(200).json({ date: isoDateStr, slots: [] });
    }

    // 4) Prepare blocked slots for that date
    const blockedForDate = (schedule.blockedSlots || []).filter(b => {
      const stored = new Date(b.date).toISOString().split('T')[0];
      return stored === isoDateStr;
    });

    // 5) Load existing appointments
    const dayStart = new Date(date + 'T00:00:00.000Z');
    const dayEnd = new Date(date + 'T23:59:59.999Z');

    const appointments = await Appointment.find({
      doctor: doctorId,
      status: { $in: ['booked', 'confirmed'] },
      start: { $gte: dayStart, $lte: dayEnd }
    }).lean();

    // Convert appointments to minute ranges
    const apptRanges = appointments.map(a => {
      const start = new Date(a.start);
      const end = new Date(a.end);
      return [start.getHours() * 60 + start.getMinutes(), end.getHours() * 60 + end.getMinutes()];
    });

    // Convert blocked slots to minute ranges
    const blockedRanges = blockedForDate.map(b => [
      timeToMinutes(b.from),
      timeToMinutes(b.to)
    ]);

    // 6) Generate slots from availability, exclude blocked + appointments
    const availableSlots = [];
    for (const ts of dayAvailability.timeSlots) {
      const rangeStart = timeToMinutes(ts.from);
      const rangeEnd = timeToMinutes(ts.to);

      for (let startMin = rangeStart; startMin + slotDuration <= rangeEnd; startMin += slotDuration) {
        const endMin = startMin + slotDuration;

        const blocked = blockedRanges.some(br => rangesOverlap(startMin, endMin, br[0], br[1]));
        const conflict = apptRanges.some(ar => rangesOverlap(startMin, endMin, ar[0], ar[1]));
        if (blocked || conflict) continue;

        const slotStart = new Date(targetDate);
        slotStart.setHours(0, 0, 0, 0);
        slotStart.setMinutes(startMin);
        const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

        availableSlots.push({
          from: minutesToTime(startMin),
          to: minutesToTime(endMin),
          isoFrom: slotStart.toISOString(),
          isoTo: slotEnd.toISOString()
        });
      }
    }

    res.status(200).json({ date: isoDateStr, slots: availableSlots });
  } catch (err) {
    console.error('Error getAvailableSlots:', err);
    res.status(500).json({ message: 'Internal Server Error' });
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