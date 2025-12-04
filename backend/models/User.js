const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'student'], required: true },
  phone: String,
  address: String,
  dateOfBirth: Date,
  joiningDate: { type: Date, default: Date.now },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  subject: String, // For staff - their teaching subject
  class: String,
  section: String,
  rollNumber: String,
  profileImage: String
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
