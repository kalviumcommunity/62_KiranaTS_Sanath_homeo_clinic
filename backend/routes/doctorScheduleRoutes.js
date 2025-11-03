const express = require('express');
const router = express.Router();
const {createOrUpdateSchedule, getSchedule, addBlockedSlot, addHoliday, deleteSchedule, getAvailableSlots, deleteBlockedSlot, deleteHoliday} = require('../controllers/doctorScheduleController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authRoles');

// Create or Update Doctor Schedule
router.post('/', authMiddleware, authorizeRoles('doctor', 'receptionist'), createOrUpdateSchedule);

// Get Doctor Schedule by doctorId
router.get('/:doctorId', authMiddleware, authorizeRoles('doctor', 'receptionist'), getSchedule);

// Add Blocked Slot
router.post('/blocked', authMiddleware, authorizeRoles('doctor', 'receptionist'), addBlockedSlot);

// Add Holiday
router.post('/holiday', authMiddleware, authorizeRoles('doctor', 'receptionist'), addHoliday);

// Delete Schedule
router.delete('/:doctorId', authMiddleware, authorizeRoles('doctor', 'receptionist'), deleteSchedule);

router.get('/available/:doctorId/:date', authMiddleware, (req, res, next) => {
      next();
}, getAvailableSlots);

router.delete('/blocked/:id', authMiddleware, authorizeRoles('doctor','receptionist'), deleteBlockedSlot);

router.delete('/holiday/:id', authMiddleware, authorizeRoles('doctor','receptionist'), deleteHoliday);

module.exports = router;