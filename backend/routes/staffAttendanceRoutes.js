const express = require('express');
const { createStaffAttendance, getStaffAttendance, updateStaffAttendance } = require('../controllers/staffAttendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getStaffAttendance)
  .post(authorize('admin'), createStaffAttendance);

router.route('/:id')
  .put(authorize('admin'), updateStaffAttendance);

module.exports = router;