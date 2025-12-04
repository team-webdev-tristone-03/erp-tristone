const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  schedule: {
    Monday: [{
      period: Number,
      time: String,
      subject: String,
      teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      isBreak: { type: Boolean, default: false }
    }],
    Tuesday: [{
      period: Number,
      time: String,
      subject: String,
      teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      isBreak: { type: Boolean, default: false }
    }],
    Wednesday: [{
      period: Number,
      time: String,
      subject: String,
      teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      isBreak: { type: Boolean, default: false }
    }],
    Thursday: [{
      period: Number,
      time: String,
      subject: String,
      teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      isBreak: { type: Boolean, default: false }
    }],
    Friday: [{
      period: Number,
      time: String,
      subject: String,
      teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      isBreak: { type: Boolean, default: false }
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
