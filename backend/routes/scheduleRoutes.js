const express=require('express');
const router=express.Router();
const { updateWeeklyAvailability, updateHolidayOrBlockedSlots } = require('../controllers/scheduleControllers.js');


router.put('/availability/:doctorId', updateWeeklyAvailability);
router.put('/schedule-adjustments/:doctorId', updateHolidayOrBlockedSlots);


module.exports=router;