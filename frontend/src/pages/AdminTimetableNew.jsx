import { useState, useEffect, useContext } from 'react';
import { Plus, Clock, Users, Edit, Trash2, Save, Eye } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:8000';

const AdminTimetableNew = () => {
  const socket = useContext(SocketContext);
  const [timetables, setTimetables] = useState([]);
  const [classes, setClasses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [viewingTimetable, setViewingTimetable] = useState(null);
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

  const sections = ['A', 'B', 'C', 'D'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    fetchTimetables();
    fetchClasses();
    fetchStaff();
    fetchSubjects();
  }, []);

  // Socket.IO real-time updates
  useEffect(() => {
    if (socket) {
      socket.on('timetableUpdate', (data) => {
        console.log('Timetable update received:', data);
        if (data.type === 'create' || data.type === 'update') {
          fetchTimetables();
        } else if (data.type === 'delete') {
          setTimetables(prev => prev.filter(t => t._id !== data.data._id));
        }
      });

      return () => {
        socket.off('timetableUpdate');
      };
    }
  }, [socket]);

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

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/api/subjects', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const initializeSchedule = (className, section) => {
    const schedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    };

    days.forEach(day => {
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
      section: section,
      schedule
    });
  };

  const handleCreateNew = () => {
    setSelectedClass('');
    setSelectedSection('A');
    setEditingTimetable(null);
    initializeSchedule('', 'A');
    setIsModalOpen(true);
  };

  const handleClassSectionSelect = (className, section) => {
    setSelectedClass(className);
    setSelectedSection(section);
    initializeSchedule(className, section);
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
      if (!newTimetable.class) {
        alert('Please select a class');
        return;
      }

      if (editingTimetable) {
        await axios.put(`/api/timetable/${editingTimetable._id}`, newTimetable, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('Timetable updated successfully!');
      } else {
        await axios.post('/api/timetable', newTimetable, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('Timetable created successfully!');
      }
      setIsModalOpen(false);
      setEditingTimetable(null);
    } catch (error) {
      console.error('Save timetable error:', error);
      alert(error.response?.data?.message || 'Error saving timetable');
    }
  };

  const editTimetable = (timetable) => {
    setEditingTimetable(timetable);
    setNewTimetable(timetable);
    setSelectedClass(timetable.class);
    setSelectedSection(timetable.section);
    setIsModalOpen(true);
  };

  const viewTimetable = (timetable) => {
    setViewingTimetable(timetable);
    setIsViewModalOpen(true);
  };

  const deleteTimetable = async (timetableId) => {
    if (window.confirm('Are you sure you want to delete this timetable?')) {
      try {
        await axios.delete(`/api/timetable/${timetableId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('Timetable deleted successfully!');
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting timetable');
      }
    }
  };

  const getStaffName = (teacherId) => {
    const teacher = staff.find(s => s._id === teacherId);
    return teacher ? teacher.name : 'TBA';
  };

  const getSubjectsByClass = (className) => {
    return subjects.filter(s => s.class === className);
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
              onClick={handleCreateNew}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus size={20} /> Create Timetable
            </button>
          </div>

          {/* Existing Timetables */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {timetables.map((timetable) => (
              <div key={timetable._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Clock className="text-blue-500" size={24} />
                    <div>
                      <h3 className="font-bold text-lg">Class {timetable.class}{timetable.section}</h3>
                      <p className="text-gray-600">Section {timetable.section}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewTimetable(timetable)}
                      className="text-green-500 hover:text-green-700 p-1"
                      title="View Timetable"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => editTimetable(timetable)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Edit Timetable"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteTimetable(timetable._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete Timetable"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Total periods: {Object.values(timetable.schedule).flat().length}</p>
                  <p>Created: {new Date(timetable.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Create for Available Classes */}
          {classes.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Quick Create for Classes</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {classes.map((className) => 
                  sections.map((section) => {
                    const exists = timetables.find(t => t.class === className && t.section === section);
                    return (
                      <button
                        key={`${className}-${section}`}
                        onClick={() => {
                          handleClassSectionSelect(className, section);
                          setIsModalOpen(true);
                        }}
                        disabled={exists}
                        className={`p-3 rounded-lg transition ${
                          exists 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        <Users size={20} className="mx-auto mb-1" />
                        <div className="text-sm font-medium">Class {className}{section}</div>
                        {exists && <div className="text-xs">Exists</div>}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Create/Edit Modal */}
          <Modal 
            isOpen={isModalOpen} 
            onClose={() => {
              setIsModalOpen(false);
              setEditingTimetable(null);
            }} 
            title={`${editingTimetable ? 'Edit' : 'Create'} Timetable`}
          >
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Class</label>
                <select
                  value={newTimetable.class}
                  onChange={(e) => {
                    const className = e.target.value;
                    setNewTimetable(prev => ({ ...prev, class: className }));
                    setSelectedClass(className);
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={editingTimetable}
                >
                  <option value="">Select Class</option>
                  {classes.map(className => (
                    <option key={className} value={className}>Class {className}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Section</label>
                <select
                  value={newTimetable.section}
                  onChange={(e) => {
                    const section = e.target.value;
                    setNewTimetable(prev => ({ ...prev, section }));
                    setSelectedSection(section);
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={editingTimetable}
                >
                  {sections.map(section => (
                    <option key={section} value={section}>Section {section}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Staff Information Table */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-3">Available Staff Members:</h4>
              <div className="max-h-40 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-white sticky top-0">
                    <tr>
                      <th className="px-2 py-1 text-left border">Name</th>
                      <th className="px-2 py-1 text-left border">Subject</th>
                      <th className="px-2 py-1 text-left border">Email</th>
                      <th className="px-2 py-1 text-left border">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map(teacher => (
                      <tr key={teacher._id} className="hover:bg-blue-50">
                        <td className="px-2 py-1 border font-medium">{teacher.name}</td>
                        <td className="px-2 py-1 border text-blue-600">{teacher.subject}</td>
                        <td className="px-2 py-1 border text-gray-600">{teacher.email}</td>
                        <td className="px-2 py-1 border text-gray-600">{teacher.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {days.map((day) => (
                <div key={day} className="mb-6">
                  <h3 className="font-bold text-lg mb-3 text-blue-600">{day}</h3>
                  <div className="space-y-2">
                    {newTimetable.schedule[day].map((period, index) => (
                      <div key={index} className="grid grid-cols-5 gap-2 items-center text-sm">
                        <span className="font-medium">P{period.period}</span>
                        <span className="text-gray-600">{period.time}</span>
                        <select
                          value={period.subject}
                          onChange={(e) => updatePeriod(day, index, 'subject', e.target.value)}
                          className="px-2 py-1 border rounded"
                        >
                          <option value="">Select Subject</option>
                          {getSubjectsByClass(newTimetable.class).map(subject => (
                            <option key={subject._id} value={subject.name}>{subject.name}</option>
                          ))}
                        </select>
                        <select
                          value={period.teacher}
                          onChange={(e) => updatePeriod(day, index, 'teacher', e.target.value)}
                          className="px-2 py-1 border rounded text-xs"
                        >
                          <option value="">Select Teacher</option>
                          {staff.map(teacher => (
                            <option key={teacher._id} value={teacher._id}>
                              {teacher.name} - {teacher.subject}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => updatePeriod(day, index, 'subject', '')}
                          className="text-red-500 hover:text-red-700 text-xs"
                          title="Clear"
                        >
                          Clear
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={saveTimetable}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-4 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {editingTimetable ? 'Update' : 'Create'} Timetable
              </button>
            </div>
          </Modal>

          {/* View Modal */}
          <Modal 
            isOpen={isViewModalOpen} 
            onClose={() => setIsViewModalOpen(false)} 
            title={`Timetable - Class ${viewingTimetable?.class}${viewingTimetable?.section}`}
          >
            {viewingTimetable && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left">Period</th>
                      {days.map(day => (
                        <th key={day} className="px-2 py-2 text-center">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((time, periodIndex) => (
                      <tr key={periodIndex} className="border-b">
                        <td className="px-2 py-2 font-medium">
                          <div>P{periodIndex + 1}</div>
                          <div className="text-xs text-gray-500">{time}</div>
                        </td>
                        {days.map(day => {
                          const period = viewingTimetable.schedule[day][periodIndex];
                          return (
                            <td key={day} className="px-2 py-2 text-center">
                              {period?.subject ? (
                                <div className="bg-blue-50 p-1 rounded text-xs">
                                  <div className="font-medium">{period.subject}</div>
                                  <div className="text-gray-600">{getStaffName(period.teacher)}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminTimetableNew;