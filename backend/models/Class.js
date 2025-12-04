const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  className: { 
    type: String, 
    required: [true, 'Class name is required'],
    trim: true
  },
  classCode: { 
    type: String, 
    required: [true, 'Class code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  section: { 
    type: String, 
    required: [true, 'Section is required'],
    enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    trim: true,
    uppercase: true
  },
  classTeacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total students count
classSchema.virtual('totalStudents').get(function() {
  return this.students ? this.students.length : 0;
});

// Index for better performance
classSchema.index({ classCode: 1 });
classSchema.index({ className: 1, section: 1 });

module.exports = mongoose.model('Class', classSchema);