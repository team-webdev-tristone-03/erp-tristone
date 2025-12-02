const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Mark = require('../models/Mark');

exports.getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalStaff = await User.countDocuments({ role: 'staff' });
    const totalClasses = await User.distinct('class', { role: 'student' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const presentToday = await Attendance.countDocuments({ 
      date: today, 
      status: 'present' 
    });

    res.json({
      totalStudents,
      totalStaff,
      totalClasses: totalClasses.length,
      presentToday
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentStats = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    const totalAttendance = await Attendance.countDocuments({ student: studentId });
    const presentCount = await Attendance.countDocuments({ 
      student: studentId, 
      status: 'present' 
    });
    const attendancePercentage = totalAttendance > 0 
      ? ((presentCount / totalAttendance) * 100).toFixed(2) 
      : 0;

    const marks = await Mark.find({ student: studentId }).populate('subject');
    const averageMarks = marks.length > 0
      ? (marks.reduce((sum, m) => sum + (m.marks / m.totalMarks) * 100, 0) / marks.length).toFixed(2)
      : 0;

    res.json({
      attendancePercentage,
      averageMarks,
      totalSubjects: marks.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
