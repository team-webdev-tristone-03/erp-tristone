const express = require('express');
const { createAnnouncement, getAnnouncements, deleteAnnouncement } = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAnnouncements)
  .post(authorize('admin', 'staff'), createAnnouncement);

router.route('/:id')
  .delete(authorize('admin'), deleteAnnouncement);

module.exports = router;
