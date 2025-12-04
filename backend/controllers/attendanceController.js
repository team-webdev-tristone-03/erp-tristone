const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.getAttendance = async (req, res) => {
  try {
    const { student, date, class: className, section, startDate, endDate } = req.query;
    let query = {};

    if (student) query.student = student;
    if (date) {
      const targetDate = new Date(date);
      query.date = {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999))
      };
    }
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Filter by class and section if provided
    if (className || section) {
      const studentQuery = {};
      if (className) studentQuery.class = className;
      if (section) studentQuery.section = section;
      
      const students = await User.find({ role: 'student', ...studentQuery });
      const studentIds = students.map(s => s._id);
      query.student = { $in: studentIds };
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name email class section rollNumber')
      .populate('subject', 'name code')
      .sort({ date: -1, 'student.name': 1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const { student, date, status, subject, remarks } = req.body;

    // Check if attendance already exists for this student and date
    const existingAttendance = await Attendance.findOne({
      student,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
      }
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      if (remarks) existingAttendance.remarks = remarks;
      await existingAttendance.save();
      
      const updatedAttendance = await Attendance.findById(existingAttendance._id)
        .populate('student', 'name email class section rollNumber')
        .populate('subject', 'name code');
      
      return res.json(updatedAttendance);
    }

    // Create new attendance record
    const attendance = await Attendance.create({
      student,
      date,
      status,
      subject,
      remarks,
      markedBy: req.user.id
    });

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('student', 'name email class section rollNumber')
      .populate('subject', 'name code');

    // Emit real-time update
    if (req.io) {
      req.io.emit('attendanceUpdate', populatedAttendance);
    }

    res.status(201).json(populatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.markBulkAttendance = async (req, res) => {
  try {
    const attendanceData = req.body;
    const results = [];

    for (const record of attendanceData) {
      const { student, date, status, subject, remarks } = record;

      // Check if attendance already exists
      const existingAttendance = await Attendance.findOne({
        student,
        date: {
          $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
        }
      });

      if (existingAttendance) {
        existingAttendance.status = status;
        if (remarks) existingAttendance.remarks = remarks;
        await existingAttendance.save();
        results.push(existingAttendance);
      } else {
        const attendance = await Attendance.create({
          student,
          date,
          status,
          subject,
          remarks,
          markedBy: req.user.id
        });
        results.push(attendance);
      }
    }

    // Emit real-time update
    if (req.io) {
      req.io.emit('bulkAttendanceUpdate', results);
    }

    res.status(201).json({ message: 'Bulk attendance marked successfully', count: results.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('student', 'name email class section rollNumber')
     .populate('subject', 'name code');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Emit real-time update
    if (req.io) {
      req.io.emit('attendanceUpdate', attendance);
    }

    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};