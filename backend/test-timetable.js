require('dotenv').config();
const mongoose = require('mongoose');
const Timetable = require('./models/Timetable');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const testTimetableOperations = async () => {
  await connectDB();

  try {
    // Test 1: Find existing timetables
    console.log('\n=== Testing Timetable Operations ===');
    const existingTimetables = await Timetable.find().populate('schedule.Monday.teacher schedule.Tuesday.teacher schedule.Wednesday.teacher schedule.Thursday.teacher schedule.Friday.teacher');
    console.log(`Found ${existingTimetables.length} existing timetables`);

    // Test 2: Find staff members
    const staff = await User.find({ role: 'staff' }).select('name subject');
    console.log(`Found ${staff.length} staff members:`, staff.map(s => s.name));

    // Test 3: Create a sample timetable if none exists
    if (existingTimetables.length === 0) {
      console.log('\nCreating sample timetable...');
      
      const sampleTimetable = {
        class: '10',
        section: 'A',
        schedule: {
          Monday: [
            { period: 1, time: '9:00-9:45', subject: 'Mathematics', teacher: staff[0]?._id },
            { period: 2, time: '9:45-10:30', subject: 'Physics', teacher: staff[1]?._id },
            { period: 3, time: '10:45-11:30', subject: 'Chemistry', teacher: staff[0]?._id },
            { period: 4, time: '11:30-12:15', subject: 'English', teacher: staff[1]?._id }
          ],
          Tuesday: [
            { period: 1, time: '9:00-9:45', subject: 'Biology', teacher: staff[0]?._id },
            { period: 2, time: '9:45-10:30', subject: 'Mathematics', teacher: staff[1]?._id }
          ],
          Wednesday: [],
          Thursday: [],
          Friday: []
        }
      };

      const newTimetable = await Timetable.create(sampleTimetable);
      console.log('Sample timetable created:', newTimetable._id);
    }

    // Test 4: Update an existing timetable
    const timetableToUpdate = await Timetable.findOne();
    if (timetableToUpdate) {
      console.log('\nUpdating timetable...');
      
      // Add a new period to Wednesday
      timetableToUpdate.schedule.Wednesday.push({
        period: 1,
        time: '9:00-9:45',
        subject: 'Computer Science',
        teacher: staff[0]?._id
      });

      await timetableToUpdate.save();
      console.log('Timetable updated successfully');

      // Verify the update
      const updatedTimetable = await Timetable.findById(timetableToUpdate._id).populate('schedule.Wednesday.teacher');
      console.log('Wednesday schedule:', updatedTimetable.schedule.Wednesday);
    }

    console.log('\n✅ All timetable operations completed successfully!');
    console.log('\nNow you can:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Start the frontend server');
    console.log('3. Login as admin and try updating timetables');
    console.log('4. Check if changes reflect immediately in student/staff views');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

testTimetableOperations();