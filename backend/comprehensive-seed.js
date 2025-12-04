require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Subject = require('./models/Subject');
const Timetable = require('./models/Timetable');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Subjects data
const subjects = [
  { name: 'Tamil', code: 'TAM' },
  { name: 'English', code: 'ENG' },
  { name: 'Mathematics', code: 'MAT' },
  { name: 'Science', code: 'SCI' },
  { name: 'Social Science', code: 'SOC' },
  { name: 'Physical Education', code: 'PE' },
  { name: 'Computer Science', code: 'CS' },
  { name: 'Hindi', code: 'HIN' },
  { name: 'Art', code: 'ART' },
  { name: 'Music', code: 'MUS' }
];

// Staff data with proper subjects
const staffData = [
  // Tamil Teachers
  { name: 'Priya Devi', email: 'priya.tamil@school.com', subject: 'Tamil' },
  { name: 'Karthik Raja', email: 'karthik.tamil@school.com', subject: 'Tamil' },
  
  // English Teachers
  { name: 'Sarah Johnson', email: 'sarah.english@school.com', subject: 'English' },
  { name: 'Michael Brown', email: 'michael.english@school.com', subject: 'English' },
  
  // Mathematics Teachers
  { name: 'Rajesh Kumar', email: 'rajesh.maths@school.com', subject: 'Mathematics' },
  { name: 'Anitha Sharma', email: 'anitha.maths@school.com', subject: 'Mathematics' },
  { name: 'Suresh Babu', email: 'suresh.maths@school.com', subject: 'Mathematics' },
  
  // Science Teachers
  { name: 'Dr. Lakshmi', email: 'lakshmi.science@school.com', subject: 'Science' },
  { name: 'Venkat Reddy', email: 'venkat.science@school.com', subject: 'Science' },
  { name: 'Meera Nair', email: 'meera.science@school.com', subject: 'Science' },
  
  // Social Science Teachers
  { name: 'Ramesh Gupta', email: 'ramesh.social@school.com', subject: 'Social Science' },
  { name: 'Kavitha Menon', email: 'kavitha.social@school.com', subject: 'Social Science' },
  
  // Physical Education Teachers
  { name: 'Coach Ravi', email: 'ravi.pe@school.com', subject: 'Physical Education' },
  { name: 'Sita Devi', email: 'sita.pe@school.com', subject: 'Physical Education' },
  
  // Computer Science Teachers
  { name: 'Arun Tech', email: 'arun.cs@school.com', subject: 'Computer Science' },
  { name: 'Deepa IT', email: 'deepa.cs@school.com', subject: 'Computer Science' },
  
  // Hindi Teachers
  { name: 'Mohan Lal', email: 'mohan.hindi@school.com', subject: 'Hindi' },
  { name: 'Sunita Rani', email: 'sunita.hindi@school.com', subject: 'Hindi' },
  
  // Art & Music Teachers
  { name: 'Artist Geetha', email: 'geetha.art@school.com', subject: 'Art' },
  { name: 'Musician Raman', email: 'raman.music@school.com', subject: 'Music' }
];

// Student names for generating data
const studentNames = [
  'Aarav Kumar', 'Vivaan Sharma', 'Aditya Patel', 'Vihaan Singh', 'Arjun Reddy',
  'Sai Krishna', 'Reyansh Gupta', 'Ayaan Khan', 'Krishna Murthy', 'Ishaan Nair',
  'Shaurya Rao', 'Atharv Joshi', 'Kabir Das', 'Aadhya Devi', 'Ananya Iyer',
  'Diya Menon', 'Saanvi Pillai', 'Aarohi Bhat', 'Pari Agarwal', 'Kavya Shetty',
  'Myra Kulkarni', 'Aanya Desai', 'Pihu Trivedi', 'Riya Pandey', 'Navya Chandra',
  'Kiara Malhotra', 'Ira Kapoor', 'Anvi Saxena', 'Tara Bhatt', 'Zara Ahmed',
  'Arya Verma', 'Sia Jain', 'Mira Ghosh', 'Niya Roy', 'Anya Banerjee',
  'Rhea Chatterjee', 'Zoya Sinha', 'Alisha Mishra', 'Tanvi Tiwari', 'Shanaya Dubey',
  'Advika Yadav', 'Avni Thakur', 'Ishika Chouhan', 'Khushi Rajput', 'Manvi Solanki',
  'Naina Rathore', 'Prisha Chauhan', 'Samaira Parmar', 'Vanya Prajapati', 'Yashvi Modi'
];

// Time slots for timetable
const timeSlots = [
  '9:00-9:45', '9:45-10:30', '10:45-11:30', '11:30-12:15',
  '1:00-1:45', '1:45-2:30', '2:30-3:15', '3:15-4:00'
];

const generateStudents = () => {
  const students = [];
  const classes = ['6', '7', '8', '9', '10'];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  
  classes.forEach(className => {
    sections.forEach(section => {
      for (let i = 0; i < 20; i++) {
        const name = studentNames[Math.floor(Math.random() * studentNames.length)];
        const rollNo = String(i + 1).padStart(2, '0');
        students.push({
          name: `${name} ${rollNo}`,
          email: `student.${className}${section.toLowerCase()}${rollNo}@school.com`,
          password: 'student123',
          role: 'student',
          class: className,
          section: section,
          rollNumber: rollNo,
          dateOfBirth: new Date(2008 + parseInt(className) - 6, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          address: `${Math.floor(Math.random() * 999) + 1}, Sample Street, Chennai`,
          phone: `98765${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`
        });
      }
    });
  });
  
  return students;
};

const generateTimetable = (className, section, staffList) => {
  const schedule = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: []
  };

  const subjectRotation = {
    '6': ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science', 'Physical Education', 'Art', 'Music'],
    '7': ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science', 'Physical Education', 'Computer Science', 'Hindi'],
    '8': ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science', 'Physical Education', 'Computer Science', 'Hindi'],
    '9': ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science', 'Physical Education', 'Computer Science', 'Hindi'],
    '10': ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science', 'Physical Education', 'Computer Science', 'Hindi']
  };

  const classSubjects = subjectRotation[className];
  
  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
    timeSlots.forEach((time, index) => {
      const subject = classSubjects[index % classSubjects.length];
      const teacher = staffList.find(staff => staff.subject === subject);
      
      schedule[day].push({
        period: index + 1,
        time,
        subject,
        teacher: teacher ? teacher._id : null
      });
    });
  });

  return {
    class: className,
    section,
    schedule
  };
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Subject.deleteMany({});
    await Timetable.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'School Administrator',
      email: 'admin@school.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Create subjects
    console.log('Creating subjects...');
    const subjectDocs = await Subject.insertMany(subjects);

    // Create staff
    console.log('Creating staff members...');
    const staffUsers = [];
    for (const staff of staffData) {
      const hashedStaffPassword = await bcrypt.hash('staff123', 10);
      staffUsers.push({
        ...staff,
        password: hashedStaffPassword,
        role: 'staff',
        phone: `98765${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
        address: `${Math.floor(Math.random() * 999) + 1}, Staff Colony, Chennai`
      });
    }
    const createdStaff = await User.insertMany(staffUsers);

    // Create students
    console.log('Creating students...');
    const students = generateStudents();
    const studentUsers = [];
    for (const student of students) {
      const hashedStudentPassword = await bcrypt.hash('student123', 10);
      studentUsers.push({
        ...student,
        password: hashedStudentPassword
      });
    }
    const createdStudents = await User.insertMany(studentUsers);

    // Create timetables
    console.log('Creating timetables...');
    const classes = ['6', '7', '8', '9', '10'];
    const sections = ['A', 'B', 'C', 'D', 'E'];
    const timetables = [];

    classes.forEach(className => {
      sections.forEach(section => {
        const timetable = generateTimetable(className, section, createdStaff);
        timetables.push(timetable);
      });
    });

    await Timetable.insertMany(timetables);

    console.log('\n=== DATABASE SEEDED SUCCESSFULLY ===');
    console.log('\nLogin Credentials:');
    console.log('\nADMIN:');
    console.log('Email: admin@school.com');
    console.log('Password: admin123');
    
    console.log('\nSTAFF (Sample):');
    console.log('Email: priya.tamil@school.com');
    console.log('Email: sarah.english@school.com');
    console.log('Email: rajesh.maths@school.com');
    console.log('Password: staff123 (for all staff)');
    
    console.log('\nSTUDENTS (Sample):');
    console.log('Email: student.6a01@school.com');
    console.log('Email: student.7b05@school.com');
    console.log('Email: student.10e15@school.com');
    console.log('Password: student123 (for all students)');
    
    console.log('\nData Summary:');
    console.log(`- Admin: 1`);
    console.log(`- Staff: ${createdStaff.length}`);
    console.log(`- Students: ${createdStudents.length}`);
    console.log(`- Subjects: ${subjectDocs.length}`);
    console.log(`- Timetables: ${timetables.length}`);
    console.log(`- Classes: 6-10 with sections A-E`);

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();