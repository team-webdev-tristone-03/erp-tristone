require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const fixPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Fix admin password
    const adminHash = await bcrypt.hash('admin123', 10);
    await User.updateOne({ email: 'admin@school.com' }, { password: adminHash });
    console.log('✅ Admin password fixed');

    // Fix staff passwords
    const staffHash = await bcrypt.hash('staff123', 10);
    await User.updateMany({ role: 'staff' }, { password: staffHash });
    console.log('✅ Staff passwords fixed');

    // Fix student passwords
    const studentHash = await bcrypt.hash('student123', 10);
    await User.updateMany({ role: 'student' }, { password: studentHash });
    console.log('✅ Student passwords fixed');

    console.log('\n🔑 WORKING CREDENTIALS:');
    console.log('Admin: admin@school.com / admin123');
    console.log('Staff: staff@school.com / staff123');
    console.log('Student: student@school.com / student123');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixPasswords();