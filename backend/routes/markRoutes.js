const express = require('express');
const { createMark, getMarks, updateMark, deleteMark } = require('../controllers/markController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMarks)
  .post(authorize('admin', 'staff'), createMark);

router.route('/:id')
  .put(authorize('admin', 'staff'), updateMark)
  .delete(authorize('admin', 'staff'), deleteMark);

module.exports = router;
