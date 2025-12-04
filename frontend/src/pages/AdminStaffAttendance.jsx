import { useState, useEffect } from 'react';
import { Plus, Edit, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

const AdminStaffAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0]
  });
  const [formData, setFormData] = useState({
    staff: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present'
  });

  useEffect(() => {
    fetchStaff();
    fetchAttendance();
  }, [filters]);

  const fetchStaff = async () => {
    try {
      const response = await axios.get('/api/users?role=staff', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStaff(response.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.date) params.append('date', filters.date);
      
      const response = await axios.get(`/api/staff-attendance?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAttendance(response.data || []);
    } catch (error) {
      console.error('Error:', error);
      setAttendance([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/staff-attendance', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAttendance();
      setIsModalOpen(false);
      setFormData({
        staff: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present'
      });
      alert('Staff attendance marked successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const updateAttendance = async (id, status) => {
    try {
      await axios.put(`/api/staff-attendance/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAttendance();
      setEditingId(null);
      alert('Attendance updated successfully!');
    } catch (error) {
      alert('Update failed');
    }
  };

  const markAllPresent = async () => {
    try {
      let successCount = 0;
      for (const staffMember of staff) {
        try {
          await axios.post('/api/staff-attendance', {
            staff: staffMember._id,
            date: filters.date,
            status: 'present'
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          successCount++;
        } catch (error) {
          // Skip if already exists, continue with others
          if (error.response?.status !== 400) {
            console.error('Error marking attendance for', staffMember.name);
          } else {
            successCount++; // Count as success if record already exists
          }
        }
      }
      
      fetchAttendance();
      alert(`${successCount} staff members marked present!`);
    } catch (error) {
      alert('Error marking attendance');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Staff Attendance Management</h1>
            <div className="flex gap-2">
              <button
                onClick={markAllPresent}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
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
            <div className="flex gap-4">
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
              <button
                onClick={() => setFilters({ date: new Date().toISOString().split('T')[0] })}
                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Today
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Staff Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Subject</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No attendance records found for selected date
                    </td>
                  </tr>
                ) : (
                  attendance.map((record) => (
                    <tr key={record._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{record.staff?.name}</td>
                      <td className="px-4 py-3">{record.staff?.subject}</td>
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
                            <option value="half-day">Half Day</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                            record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {record.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setEditingId(editingId === record._id ? null : record._id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Add Attendance Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mark Staff Attendance">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Staff Member</label>
                <select
                  value={formData.staff}
                  onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Staff</option>
                  {staff.map(staffMember => (
                    <option key={staffMember._id} value={staffMember._id}>
                      {staffMember.name} - {staffMember.subject}
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
                  <option value="half-day">Half Day</option>
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

export default AdminStaffAttendance;