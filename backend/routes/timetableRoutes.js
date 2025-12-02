const express = require('express');
const { createTimetable, getTimetable, updateTimetable } = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTimetable)
  .post(authorize('admin'), createTimetable);

router.route('/:id')
  .put(authorize('admin'), updateTimetable);

module.exports = router;
