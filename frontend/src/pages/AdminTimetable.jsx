import { useState, useEffect } from 'react';
import { Plus, Clock, Users } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import axios from 'axios';

const AdminTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [classes, setClasses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [newTimetable, setNewTimetable] = useState({
    class: '',
    section: 'A',
    schedule: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    }
  });

  const timeSlots = [
    '9:00-9:45', '9:45-10:30', '10:45-11:30', '11:30-12:15',
    '1:00-1:45', '1:45-2:30', '2:30-3:15', '3:15-4:00'
  ];

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History', 'Geography', 'Computer Science', 'Physical Education'];

  useEffect(() => {
    fetchTimetables();
    fetchClasses();
    fetchStaff();
  }, []);

  const fetchTimetables = async () => {
    try {
      const response = await axios.get('/api/timetable', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTimetables(response.data);
    } catch (error) {
      console.error('Error fetching timetables:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/timetable/classes/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get('/api/timetable/staff/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const initializeSchedule = (className) => {
    const schedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    };

    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
      timeSlots.forEach((time, index) => {
        schedule[day].push({
          period: index + 1,
          time,
          subject: '',
          teacher: ''
        });
      });
    });

    setNewTimetable({
      class: className,
      section: 'A',
      schedule
    });
  };

  const handleClassSelect = (className) => {
    setSelectedClass(className);
    initializeSchedule(className);
    setIsModalOpen(true);
  };

  const updatePeriod = (day, periodIndex, field, value) => {
    setNewTimetable(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: prev.schedule[day].map((period, index) =>
          index === periodIndex ? { ...period, [field]: value } : period
        )
      }
    }));
  };

  const saveTimetable = async () => {
    try {
      await axios.post('/api/timetable', newTimetable, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTimetables();
      setIsModalOpen(false);
      alert('Timetable created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating timetable');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Timetable Management</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus size={20} /> Add Timetable
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timetables.map((timetable) => (
              <div key={timetable._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="text-blue-500" size={24} />
                  <div>
                    <h3 className="font-bold text-lg">Class {timetable.class}</h3>
                    <p className="text-gray-600">Section {timetable.section}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Monday: {timetable.schedule.Monday.length} periods</p>
                  <p>Total periods: {Object.values(timetable.schedule).flat().length}</p>
                </div>
              </div>
            ))}
          </div>

          {classes.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Available Classes</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {classes.map((className) => (
                  <button
                    key={className}
                    onClick={() => handleClassSelect(className)}
                    className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition"
                  >
                    <Users size={24} className="mx-auto mb-2" />
                    Class {className}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Create Timetable - Class ${selectedClass}`}>
            <div className="max-h-96 overflow-y-auto">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <div key={day} className="mb-6">
                  <h3 className="font-bold text-lg mb-3 text-blue-600">{day}</h3>
                  <div className="space-y-2">
                    {newTimetable.schedule[day].map((period, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 items-center">
                        <span className="text-sm font-medium">P{period.period}</span>
                        <span className="text-sm text-gray-600">{period.time}</span>
                        <select
                          value={period.subject}
                          onChange={(e) => updatePeriod(day, index, 'subject', e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="">Select Subject</option>
                          {subjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))}
                        </select>
                        <select
                          value={period.teacher}
                          onChange={(e) => updatePeriod(day, index, 'teacher', e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="">Select Teacher</option>
                          {staff.map(teacher => (
                            <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={saveTimetable}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-4"
              >
                Save Timetable
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminTimetable;