const express = require('express');
const { createAttendance, getAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAttendance)
  .post(authorize('admin', 'staff'), createAttendance);

router.route('/:id')
  .put(authorize('admin', 'staff'), updateAttendance)
  .delete(authorize('admin', 'staff'), deleteAttendance);

module.exports = router;
