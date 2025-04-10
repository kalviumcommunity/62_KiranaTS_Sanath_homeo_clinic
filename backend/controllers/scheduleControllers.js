const DoctorSchedule = require("../models/doctorSchedule");

const updateWeeklyAvailability=async(req,res)=>{
    const doctorId=req.user.id;
    const {weeklyAvailability}=req.body;
    if(!weeklyAvailability){
        return res.status(400).json({ error: 'Weekly availability is required' });
    }
    try {
        const schedule=await DoctorSchedule.findOneAndUpdate({doctorId}, {weeklyAvailability}, {new:true, upsert: true});
        if(!schedule){
            return res.status(404).json({ error: 'Doctor schedule not found' });
        }
        res.json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

const updateHolidayOrBlockedSlots=async(req,res)=>{
    const doctorId=req.user.id;
    const {holidays, blockedSlots}=req.body;
    if (!holidays && !blockedSlots) {
        return res.status(400).json({ error: 'No updates provided' });
    }
    try {
        const updateFields = {};
        if (holidays) updateFields.holidays = holidays;
        if (blockedSlots) updateFields.blockedSlots = blockedSlots;

        const schedule = await DoctorSchedule.findOneAndUpdate(
            { doctorId },
            { $set: updateFields },
            { new: true , upsert:true}
        );

        if (!schedule) {
            return res.status(404).json({ error: 'Doctor schedule not found' });
        }

        res.json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports={updateWeeklyAvailability, updateHolidayOrBlockedSlots};