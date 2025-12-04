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

    console.log('Creating Admin...');
    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@school.com',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890'
    });

    console.log('Creating Staff...');
    // Create Staff Members
    const staffData = [
      { name: 'John Smith', email: 'staff@school.com', password: 'staff123', role: 'staff', phone: '9876543210', subject: 'Mathematics' },
      { name: 'Sarah Johnson', email: 'sarah@school.com', password: 'staff123', role: 'staff', phone: '9876543211', subject: 'English' },
      { name: 'Michael Brown', email: 'michael@school.com', password: 'staff123', role: 'staff', phone: '9876543212', subject: 'Science' },
      { name: 'Emily Davis', email: 'emily@school.com', password: 'staff123', role: 'staff', phone: '9876543213', subject: 'Social Studies' },
      { name: 'David Wilson', email: 'david@school.com', password: 'staff123', role: 'staff', phone: '9876543214', subject: 'Hindi' },
      { name: 'Lisa Anderson', email: 'lisa@school.com', password: 'staff123', role: 'staff', phone: '9876543215', subject: 'Physics' },
      { name: 'Robert Taylor', email: 'robert@school.com', password: 'staff123', role: 'staff', phone: '9876543216', subject: 'Chemistry' },
      { name: 'Jennifer Martinez', email: 'jennifer@school.com', password: 'staff123', role: 'staff', phone: '9876543217', subject: 'Biology' }
    ];
    
    const staffMembers = [];
    for (const staff of staffData) {
      const createdStaff = await User.create(staff);
      staffMembers.push(createdStaff);
    }

    console.log('Creating Students...');
    // Create Students for Classes 6-10, Sections A & B, 20 students each
    const students = [];
    const classes = ['6', '7', '8', '9', '10'];
    const sections = ['A', 'B'];
    const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Priya', 'Kavya', 'Aanya', 'Sara', 'Ira', 'Myra', 'Riya', 'Aditi'];
    const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Jain', 'Agarwal', 'Bansal', 'Mittal'];

    let rollCounter = 1;
    for (const className of classes) {
      for (const section of sections) {
        for (let i = 0; i < 20; i++) {
          const firstName = firstNames[i % firstNames.length];
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const email = i === 0 && className === '10' && section === 'A' ? 'student@school.com' : `${firstName.toLowerCase()}${rollCounter}@school.com`;
          
          students.push({
            name: `${firstName} ${lastName}`,
            email: email,
            password: 'student123',
            role: 'student',
            class: className,
            section: section,
            rollNumber: rollCounter.toString().padStart(3, '0')
          });
          rollCounter++;
        }
      }
    }

    const createdStudents = [];
    for (const student of students) {
      const createdStudent = await User.create(student);
      createdStudents.push(createdStudent);
    }

    console.log('Creating Subjects...');
    // Create Subjects for each class
    const subjects = [];
    for (const className of classes) {
      const classSubjects = [
        { name: 'Mathematics', code: `MATH${className}`, class: className, teacher: staffMembers[0]._id },
        { name: 'English', code: `ENG${className}`, class: className, teacher: staffMembers[1]._id },
        { name: 'Science', code: `SCI${className}`, class: className, teacher: staffMembers[2]._id },
        { name: 'Social Studies', code: `SS${className}`, class: className, teacher: staffMembers[3]._id },
        { name: 'Hindi', code: `HIN${className}`, class: className, teacher: staffMembers[4]._id }
      ];
      
      if (parseInt(className) >= 9) {
        classSubjects.push(
          { name: 'Physics', code: `PHY${className}`, class: className, teacher: staffMembers[5]._id },
          { name: 'Chemistry', code: `CHEM${className}`, class: className, teacher: staffMembers[6]._id },
          { name: 'Biology', code: `BIO${className}`, class: className, teacher: staffMembers[7]._id }
        );
      }
      
      subjects.push(...classSubjects);
    }

    const createdSubjects = await Subject.insertMany(subjects);

    console.log('Creating Timetables...');
    // Create Timetables for all classes and sections
    const timetables = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'];

    for (const className of classes) {
      for (const section of sections) {
        const classSubjects = createdSubjects.filter(s => s.class === className);
        
        const schedule = {};
        days.forEach(day => {
          schedule[day] = [];
          for (let i = 0; i < 6; i++) {
            const subject = classSubjects[i % classSubjects.length];
            schedule[day].push({
              period: i + 1,
              time: times[i],
              subject: subject.name,
              teacher: subject.teacher
            });
          }
        });

        timetables.push({
          class: className,
          section: section,
          schedule: schedule
        });
      }
    }

    await Timetable.insertMany(timetables);

    console.log('Creating Sample Attendance...');
    // Create sample attendance for last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0); // Set to start of day to avoid time conflicts
      
      for (const student of createdStudents.slice(0, 50)) { // Sample for first 50 students
        const classSubjects = createdSubjects.filter(s => s.class === student.class);
        for (let j = 0; j < Math.min(3, classSubjects.length); j++) { // 3 subjects per day
          const subject = classSubjects[j];
          try {
            await Attendance.create({
              student: student._id,
              subject: subject._id,
              date: new Date(date.getTime() + j * 60000), // Add minutes to avoid exact duplicates
              status: Math.random() > 0.1 ? 'present' : 'absent'
            });
          } catch (error) {
            // Skip if duplicate
            if (error.code !== 11000) {
              console.error('Attendance creation error:', error.message);
            }
          }
        }
      }
    }

    console.log('Creating Sample Marks...');
    // Create sample marks
    const marksData = [];
    for (const student of createdStudents.slice(0, 50)) { // Sample for first 50 students
      const classSubjects = createdSubjects.filter(s => s.class === student.class);
      for (const subject of classSubjects) {
        ['Unit Test 1', 'Unit Test 2', 'Midterm', 'Final'].forEach(examType => {
          const marks = Math.floor(Math.random() * 40) + 60; // 60-100
          marksData.push({
            student: student._id,
            subject: subject._id,
            examType: examType,
            marks: marks,
            totalMarks: 100,
            grade: marks >= 90 ? 'A+' : marks >= 80 ? 'A' : marks >= 70 ? 'B' : marks >= 60 ? 'C' : 'D'
          });
        });
      }
    }
    await Mark.insertMany(marksData);

    console.log('Creating Materials...');
    // Create study materials
    const materials = [];
    for (const subject of createdSubjects.slice(0, 10)) {
      materials.push({
        title: `${subject.name} - Chapter 1 Notes`,
        description: `Comprehensive notes for ${subject.name} Chapter 1`,
        fileUrl: `https://example.com/${subject.code.toLowerCase()}-ch1.pdf`,
        subject: subject._id,
        uploadedBy: subject.teacher,
        class: subject.class
      });
    }
    await Material.insertMany(materials);

    console.log('Creating Announcements...');
    // Create announcements
    await Announcement.insertMany([
      {
        title: 'Welcome to New Academic Year 2024-25',
        content: 'We wish all students and staff a successful academic year ahead!',
        targetRole: 'all',
        createdBy: admin._id
      },
      {
        title: 'Parent-Teacher Meeting',
        content: 'Parent-Teacher meeting scheduled for next Saturday from 10 AM to 4 PM.',
        targetRole: 'student',
        createdBy: admin._id
      },
      {
        title: 'Staff Meeting',
        content: 'Monthly staff meeting on Friday at 4 PM in the conference room.',
        targetRole: 'staff',
        createdBy: admin._id
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`\n📊 Data Summary:`);
    console.log(`👨‍💼 Admin: 1`);
    console.log(`👩‍🏫 Staff: ${staffMembers.length}`);
    console.log(`👨‍🎓 Students: ${createdStudents.length} (Classes 6-10, Sections A&B, 20 each)`);
    console.log(`📚 Subjects: ${createdSubjects.length}`);
    console.log(`📅 Timetables: ${timetables.length}`);
    console.log('\n🔑 Demo Credentials:');
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
