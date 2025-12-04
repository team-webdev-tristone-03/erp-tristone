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
    const populated = await Timetable.findById(timetable._id).populate('schedule.Monday.teacher schedule.Tuesday.teacher schedule.Wednesday.teacher schedule.Thursday.teacher schedule.Friday.teacher');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    const { class: className, section } = req.query;
    let query = {};
    
    if (className) query.class = className;
    if (section) query.section = section;

    const timetable = await Timetable.find(query).populate('schedule.Monday.teacher schedule.Tuesday.teacher schedule.Wednesday.teacher schedule.Thursday.teacher schedule.Friday.teacher');
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStaffTimetable = async (req, res) => {
  try {
    const staffId = req.params.staffId;
    const timetables = await Timetable.find().populate('schedule.Monday.teacher schedule.Tuesday.teacher schedule.Wednesday.teacher schedule.Thursday.teacher schedule.Friday.teacher');
    
    const staffSchedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    };
    
    timetables.forEach(timetable => {
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
        timetable.schedule[day].forEach(period => {
          if (period.teacher && period.teacher._id.toString() === staffId) {
            staffSchedule[day].push({
              period: period.period,
              time: period.time,
              subject: period.subject,
              class: timetable.class,
              section: timetable.section
            });
          }
        });
      });
    });
    
    res.json(staffSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('schedule.Monday.teacher schedule.Tuesday.teacher schedule.Wednesday.teacher schedule.Thursday.teacher schedule.Friday.teacher');
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
    const staff = await User.find({ role: 'staff' }).select('name subject');
    console.log('Staff list:', staff);
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
