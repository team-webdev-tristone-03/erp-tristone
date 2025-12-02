const Mark = require('../models/Mark');

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
    const { student, subject } = req.query;
    let query = {};
    
    if (student) query.student = student;
    if (subject) query.subject = subject;

    const marks = await Mark.find(query).populate(['student', 'subject']).sort('-createdAt');
    res.json(marks);
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
