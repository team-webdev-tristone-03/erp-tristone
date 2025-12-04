const Timetable = require('../models/Timetable');
const User = require('../models/User');

exports.createTimetable = async (req, res) => {
  try {
    // Check if timetable already exists for this class
    const existing = await Timetable.findOne({ class: req.body.class, section: req.body.section });
    if (existing) {
      return res.status(400).json({ message: 'Timetable already exists for this class' });
    }
    
    const timetable = await Timetable.create(req.body);
    const populated = await Timetable.findById(timetable._id).populate({
      path: 'schedule.Monday.teacher schedule.Tuesday.teacher schedule.Wednesday.teacher schedule.Thursday.teacher schedule.Friday.teacher',
      select: 'name subject'
    });
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('timetableUpdate', {
        type: 'create',
        data: populated
      });
    }
    
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    const { class: className, section } = req.query;
    let query = {};
    
    // If user is a student, get their class and section
    if (req.user && req.user.role === 'student') {
      query.class = req.user.class;
      query.section = req.user.section;
    } else {
      if (className) query.class = className;
      if (section) query.section = section;
    }

    const timetable = await Timetable.find(query).populate({
      path: 'schedule.Monday.teacher schedule.Tuesday.teacher schedule.Wednesday.teacher schedule.Thursday.teacher schedule.Friday.teacher',
      select: 'name subject'
    });
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStaffTimetable = async (req, res) => {
  try {
    const staffId = req.user && req.user.role === 'staff' ? req.user._id : req.params.staffId;
    const timetables = await Timetable.find().populate({
      path: 'schedule.Monday.teacher schedule.Tuesday.teacher schedule.Wednesday.teacher schedule.Thursday.teacher schedule.Friday.teacher',
      select: 'name subject'
    });
    
    const staffSchedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    };
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    timetables.forEach(timetable => {
      days.forEach(day => {
        if (timetable.schedule[day]) {
          timetable.schedule[day].forEach(period => {
            if (period.teacher && period.teacher.toString() === staffId) {
              staffSchedule[day].push({
                time: period.time,
                subject: period.subject,
                class: timetable.class,
                section: timetable.section,
                period: period.period
              });
            }
          });
        }
      });
    });
    
    // Sort by time for each day
    days.forEach(day => {
      staffSchedule[day].sort((a, b) => a.period - b.period);
    });
    
    res.json(staffSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: 'schedule.Monday.teacher schedule.Tuesday.teacher schedule.Wednesday.teacher schedule.Thursday.teacher schedule.Friday.teacher',
      select: 'name subject'
    });
    
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('timetableUpdate', {
        type: 'update',
        data: timetable
      });
    }
    
    res.json(timetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const classes = await User.distinct('class', { role: 'student' });
    res.json(classes.filter(c => c).sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStaffList = async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('name subject phone email');
    console.log('Staff list:', staff);
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    
    // Emit real-time update
    req.io.emit('timetableUpdate', {
      type: 'delete',
      data: { _id: req.params.id }
    });
    
    res.json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
