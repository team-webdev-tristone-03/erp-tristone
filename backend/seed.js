require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Subject = require('./models/Subject');
const Attendance = require('./models/Attendance');
const Mark = require('./models/Mark');
const Material = require('./models/Material');
const Announcement = require('./models/Announcement');
const Timetable = require('./models/Timetable');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB Connected');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Subject.deleteMany({});
    await Attendance.deleteMany({});
    await Mark.deleteMany({});
    await Material.deleteMany({});
    await Announcement.deleteMany({});
    await Timetable.deleteMany({});

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@school.com',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890'
    });

    // Create Staff
    const staff = await User.create({
      name: 'John Teacher',
      email: 'staff@school.com',
      password: 'staff123',
      role: 'staff',
      phone: '9876543210'
    });

    // Create Students
    const student1 = await User.create({
      name: 'Alice Johnson',
      email: 'student@school.com',
      password: 'student123',
      role: 'student',
      class: '10',
      section: 'A',
      rollNumber: '101'
    });

    const student2 = await User.create({
      name: 'Bob Smith',
      email: 'bob@school.com',
      password: 'student123',
      role: 'student',
      class: '10',
      section: 'A',
      rollNumber: '102'
    });

    const student3 = await User.create({
      name: 'Charlie Brown',
      email: 'charlie@school.com',
      password: 'student123',
      role: 'student',
      class: '10',
      section: 'B',
      rollNumber: '103'
    });

    const students = [student1, student2, student3];

    // Create Subjects
    const subjects = await Subject.insertMany([
      { name: 'Mathematics', code: 'MATH101', class: '10', teacher: staff._id },
      { name: 'Physics', code: 'PHY101', class: '10', teacher: staff._id },
      { name: 'Chemistry', code: 'CHEM101', class: '10', teacher: staff._id },
      { name: 'English', code: 'ENG101', class: '10', teacher: staff._id }
    ]);

    // Create Attendance
    const today = new Date();
    for (const student of students) {
      await Attendance.create({
        student: student._id,
        date: today,
        status: 'present',
        subject: subjects[0]._id
      });
    }

    // Create Marks
    for (const student of students) {
      for (const subject of subjects) {
        await Mark.create({
          student: student._id,
          subject: subject._id,
          examType: 'Midterm',
          marks: Math.floor(Math.random() * 30) + 70,
          totalMarks: 100,
          grade: 'A'
        });
      }
    }

    // Create Materials
    await Material.insertMany([
      {
        title: 'Mathematics Chapter 1',
        description: 'Introduction to Algebra',
        fileUrl: 'https://example.com/math-ch1.pdf',
        subject: subjects[0]._id,
        uploadedBy: staff._id,
        class: '10'
      },
      {
        title: 'Physics Notes',
        description: 'Newton Laws of Motion',
        fileUrl: 'https://example.com/physics-notes.pdf',
        subject: subjects[1]._id,
        uploadedBy: staff._id,
        class: '10'
      }
    ]);

    // Create Announcements
    await Announcement.create({
      title: 'Welcome to New Academic Year',
      content: 'We wish all students a great academic year ahead!',
      targetRole: 'all',
      createdBy: admin._id
    });

    // Create Timetable
    await Timetable.insertMany([
      {
        class: '10',
        section: 'A',
        day: 'Monday',
        periods: [
          { time: '9:00 AM - 10:00 AM', subject: subjects[0]._id, teacher: staff._id },
          { time: '10:00 AM - 11:00 AM', subject: subjects[1]._id, teacher: staff._id },
          { time: '11:00 AM - 12:00 PM', subject: subjects[2]._id, teacher: staff._id }
        ]
      },
      {
        class: '10',
        section: 'A',
        day: 'Tuesday',
        periods: [
          { time: '9:00 AM - 10:00 AM', subject: subjects[3]._id, teacher: staff._id },
          { time: '10:00 AM - 11:00 AM', subject: subjects[0]._id, teacher: staff._id }
        ]
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Admin: admin@school.com / admin123');
    console.log('Staff: staff@school.com / staff123');
    console.log('Student: student@school.com / student123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
