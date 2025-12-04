const StaffAttendance = require('../models/StaffAttendance');

exports.createStaffAttendance = async (req, res) => {
  try {
    const { staff, date, status } = req.body;
    
    // Check if attendance already exists for this staff on this date
    const existingAttendance = await StaffAttendance.findOne({ staff, date });
    if (existingAttendance) {
      // Update existing record
      existingAttendance.status = status;
      await existingAttendance.save();
      const populated = await StaffAttendance.findById(existingAttendance._id).populate('staff', 'name subject');
      return res.json(populated);
    }

    const attendance = await StaffAttendance.create({ staff, date, status });
    const populated = await StaffAttendance.findById(attendance._id).populate('staff', 'name subject');
    
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getStaffAttendance = async (req, res) => {
  try {
    const { date, staff } = req.query;
    let query = {};
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    
    if (staff) query.staff = staff;
    
    // If user is staff, only show their own attendance
    if (req.user && req.user.role === 'staff') {
      query.staff = req.user._id;
    }

    const attendance = await StaffAttendance.find(query)
      .populate('staff', 'name subject')
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStaffAttendance = async (req, res) => {
  try {
    const { status } = req.body;
    const attendance = await StaffAttendance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('staff', 'name subject');
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};