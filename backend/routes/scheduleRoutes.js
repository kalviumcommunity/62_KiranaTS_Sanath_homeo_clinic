const express=require('express');
const router=express.Router();
const { updateWeeklyAvailability, updateHolidayOrBlockedSlots } = require('../controllers/scheduleControllers.js');


router.put('/weekly/:doctorId', updateWeeklyAvailability);
router.put('/modify/:doctorId', updateHolidayOrBlockedSlots);