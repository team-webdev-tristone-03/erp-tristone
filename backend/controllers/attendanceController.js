const Attendance = require('../models/Attendance');

exports.createAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    const populated = await attendance.populate(['user', 'subject']);
    
    req.io.emit('attendanceUpdate', populated);
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { user, userType, date, startDate, endDate } = req.query;
    let query = {};
    
    if (user) query.user = user;
    if (userType) query.userType = userType;
    if (date) query.date = new Date(date);
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const attendance = await Attendance.find(query).populate(['user', 'subject']).sort('-date');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate(['user', 'subject']);
    
    req.io.emit('attendanceUpdate', attendance);
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
