const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  class: { type: String, required: true },
  section: String,
  day: { type: String, required: true },
  periods: [{
    time: String,
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
