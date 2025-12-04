const Class = require('../models/Class');

exports.createClass = async (req, res) => {
  try {
    const classData = await Class.create(req.body);
    const populated = await classData.populate(['classTeacher', 'students']);
    res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('classTeacher', 'name email')
      .populate('students', 'name rollNumber')
      .sort('-createdAt');
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('classTeacher', 'name email')
      .populate('students', 'name rollNumber email');
    
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    res.json(classData);
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate(['classTeacher', 'students']);
    
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    res.json(classData);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete(req.params.id);
    
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: error.message });
  }
};