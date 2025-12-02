const Announcement = require('../models/Announcement');

exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const { targetRole } = req.query;
    let query = {};
    
    if (targetRole) {
      query.$or = [{ targetRole }, { targetRole: 'all' }];
    }

    const announcements = await Announcement.find(query).populate('createdBy').sort('-createdAt');
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
