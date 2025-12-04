const express = require('express');
const { createTimetable, getTimetable, updateTimetable, deleteTimetable, getStaffTimetable, getClasses, getStaffList } = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTimetable)
  .post(authorize('admin'), createTimetable);

router.route('/:id')
  .put(authorize('admin'), updateTimetable)
  .delete(authorize('admin'), deleteTimetable);

router.get('/staff/:staffId', getStaffTimetable);
router.get('/staff/my-schedule', authorize('staff'), getStaffTimetable);
router.get('/classes/list', getClasses);
router.get('/staff/list', getStaffList);

module.exports = router;
