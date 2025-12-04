import { useState, useEffect, useContext } from 'react';
import { Plus, Edit, Save, X, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:8000';

const StaffAttendance = () => {
  const socket = useContext(SocketContext);
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    class: '',
    section: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [formData, setFormData] = useState({
    student: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present'
  });

  const sections = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    fetchClasses();
    fetchAttendance();
  }, []);

  useEffect(() => {
    if (filters.class) {
      fetchStudents();
    }
  }, [filters.class, filters.section]);

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  // Socket.IO real-time updates
  useEffect(() => {
    if (socket) {
      socket.on('attendanceUpdate', (data) => {
        console.log('Attendance update received:', data);
        fetchAttendance();
      });

      return () => {
        socket.off('attendanceUpdate');
      };
    }
  }, [socket]);

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

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams();
      params.append('role', 'student');
      if (filters.class) params.append('class', filters.class);
      if (filters.section) params.append('section', filters.section);

      const response = await axios.get(`/api/users?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.class) params.append('class', filters.class);
      if (filters.section) params.append('section', filters.section);
      if (filters.date) params.append('date', filters.date);

      const response = await axios.get(`/api/attendance?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/attendance', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAttendance();
      setIsModalOpen(false);
      setFormData({
        student: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present'
      });
      alert('Attendance marked successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const updateAttendance = async (id, status) => {
    try {
      await axios.put(`/api/attendance/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAttendance();
      setEditingId(null);
      alert('Attendance updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
  };

  const markAllPresent = async () => {
    if (!filters.class || !filters.date) {
      alert('Please select class and date first');
      return;
    }

    try {
      const promises = students.map(student =>
        axios.post('/api/attendance', {
          student: student._id,
          date: filters.date,
          status: 'present'
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      );
      
      await Promise.all(promises);
      fetchAttendance();
      alert('All students marked present!');
    } catch (error) {
      alert('Some attendance records may have failed to create');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Attendance Management</h1>
            <div className="flex gap-2">
              <button
                onClick={markAllPresent}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                disabled={!filters.class}
              >
                Mark All Present
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
              >
                <Plus size={20} /> Mark Attendance
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={20} />
              <h3 className="font-semibold">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
              <select
                value={filters.section}
                onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Sections</option>
                {sections.map(section => (
                  <option key={section} value={section}>Section {section}</option>
                ))}
              </select>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
              <button
                onClick={() => setFilters({ class: '', section: '', date: new Date().toISOString().split('T')[0] })}
                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Student</th>
                    <th className="px-4 py-3 text-left font-semibold">Class</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    attendance.map((record) => (
                      <tr key={record._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{record.student?.name}</td>
                        <td className="px-4 py-3">
                          Class {record.student?.class}{record.student?.section}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === record._id ? (
                            <select
                              defaultValue={record.status}
                              className="px-2 py-1 border rounded"
                              onBlur={(e) => updateAttendance(record._id, e.target.value)}
                            >
                              <option value="present">Present</option>
                              <option value="absent">Absent</option>
                              <option value="late">Late</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              record.status === 'present' ? 'bg-green-100 text-green-800' :
                              record.status === 'absent' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {record.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === record._id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingId(record._id)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Attendance Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mark Attendance">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Class</label>
                <select
                  value={formData.class || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, class: e.target.value });
                    // Fetch students for selected class
                    if (e.target.value) {
                      setFilters({ ...filters, class: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Student</label>
                <select
                  value={formData.student}
                  onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name} - Class {student.class}{student.section}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Mark Attendance
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;