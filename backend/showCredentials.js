require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const showCredentials = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    console.log('🔑 WORKING LOGIN CREDENTIALS:\n');

    // Admin
    const admin = await User.findOne({ role: 'admin' });
    console.log('👨‍💼 ADMIN:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: admin123\n`);

    // Staff
    const staff = await User.find({ role: 'staff' }).limit(5);
    console.log('👩‍🏫 STAFF MEMBERS:');
    staff.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name}`);
      console.log(`   Email: ${s.email}`);
      console.log(`   Password: staff123`);
      console.log(`   Subject: ${s.subject}\n`);
    });

    // Students
    const students = await User.find({ role: 'student' }).limit(10);
    console.log('👨‍🎓 STUDENT ACCOUNTS:');
    students.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name}`);
      console.log(`   Email: ${s.email}`);
      console.log(`   Password: student123`);
      console.log(`   Class: ${s.class}, Section: ${s.section}\n`);
    });

    console.log('📝 NOTE: All passwords are "staff123" for staff and "student123" for students');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

showCredentials();