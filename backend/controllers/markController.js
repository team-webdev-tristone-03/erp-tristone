const Mark = require('../models/Mark');
const User = require('../models/User');

exports.createMark = async (req, res) => {
  try {
    const mark = await Mark.create(req.body);
    const populated = await mark.populate(['student', 'subject']);
    
    req.io.emit('markUpdate', populated);
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMarks = async (req, res) => {
  try {
    const { student, subject, class: className, section } = req.query;
    let query = {};
    
    if (student) query.student = student;
    if (subject) query.subject = subject;

    const marks = await Mark.find(query).populate([
      { path: 'student', select: 'name class section' },
      { path: 'subject', select: 'name' }
    ]).sort('-createdAt');

    // Filter by class and section after population
    let filteredMarks = marks;
    if (className) {
      filteredMarks = filteredMarks.filter(mark => mark.student?.class === className);
    }
    if (section) {
      filteredMarks = filteredMarks.filter(mark => mark.student?.section === section);
    }

    res.json(filteredMarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unique classes and sections
exports.getClassesAndSections = async (req, res) => {
  try {
    const students = await require('../models/User').find({ role: 'student' }, 'class section');
    
    const classes = [...new Set(students.map(s => s.class).filter(Boolean))];
    const sections = [...new Set(students.map(s => s.section).filter(Boolean))];
    
    res.json({ classes, sections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMark = async (req, res) => {
  try {
    const mark = await Mark.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate(['student', 'subject']);
    
    req.io.emit('markUpdate', mark);
    res.json(mark);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMark = async (req, res) => {
  try {
    await Mark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mark deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
