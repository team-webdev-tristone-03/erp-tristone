const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createStaffAttendance,
  getStaffAttendance,
  updateStaffAttendance,
  deleteStaffAttendance
} = require('../controllers/staffAttendanceController');

router.post('/', protect, createStaffAttendance);
router.get('/', protect, getStaffAttendance);
router.put('/:id', protect, updateStaffAttendance);
router.delete('/:id', protect, deleteStaffAttendance);

module.exports = router;