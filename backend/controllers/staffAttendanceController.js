const StaffAttendance = require('../models/StaffAttendance');

exports.createStaffAttendance = async (req, res) => {
  try {
    // If user details not provided, fetch from User collection
    if (!req.body.staffName && req.body.staff) {
      const User = require('../models/User');
      const user = await User.findById(req.body.staff);
      if (user) {
        req.body.staffName = user.name;
        req.body.staffEmail = user.email;
        req.body.staffSubject = user.subject;
      }
    }
    
    const attendance = await StaffAttendance.create(req.body);
    const populated = await attendance.populate('staff');
    
    req.io.emit('staffAttendanceUpdate', populated);
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getStaffAttendance = async (req, res) => {
  try {
    const { staff, date, startDate, endDate } = req.query;
    let query = {};
    
    if (staff) query.staff = staff;
    if (date) {
      const queryDate = new Date(date);
      const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    if (startDate && endDate && !date) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const attendance = await StaffAttendance.find(query).populate('staff').sort('-date');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStaffAttendance = async (req, res) => {
  try {
    // If user details not provided, fetch from User collection
    if (!req.body.staffName && req.body.staff) {
      const User = require('../models/User');
      const user = await User.findById(req.body.staff);
      if (user) {
        req.body.staffName = user.name;
        req.body.staffEmail = user.email;
        req.body.staffSubject = user.subject;
      }
    }
    
    const attendance = await StaffAttendance.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('staff');
    
    req.io.emit('staffAttendanceUpdate', attendance);
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteStaffAttendance = async (req, res) => {
  try {
    await StaffAttendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff attendance deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};