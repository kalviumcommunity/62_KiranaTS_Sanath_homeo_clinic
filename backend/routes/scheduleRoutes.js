const express=require('express');
const router=express.Router();
const { updateWeeklyAvailability, updateHolidayOrBlockedSlots } = require('../controllers/scheduleControllers.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const authorizeRoles = require('../middleware/authRoles.js');


router.put('/availability/:doctorId',authMiddleware, authorizeRoles('doctor', 'receptionist'), updateWeeklyAvailability);
router.put('/schedule-adjustments/:doctorId',authMiddleware, authorizeRoles('doctor', 'receptionist'), updateHolidayOrBlockedSlots);


module.exports=router;