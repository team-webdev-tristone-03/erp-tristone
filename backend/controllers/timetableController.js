const Timetable = require('../models/Timetable');

exports.createTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.create(req.body);
    res.status(201).json(timetable);
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

    const timetable = await Timetable.find(query).populate('periods.subject periods.teacher');
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(timetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
