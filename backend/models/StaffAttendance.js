const mongoose = require('mongoose');

const staffAttendanceSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day'],
    default: 'present'
  }
}, { timestamps: true });

// Ensure one attendance record per staff per date
staffAttendanceSchema.index({ staff: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('StaffAttendance', staffAttendanceSchema);