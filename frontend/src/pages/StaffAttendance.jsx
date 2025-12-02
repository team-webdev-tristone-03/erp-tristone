import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { attendanceAPI, userAPI } from '../services/api';

const StaffAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ student: '', date: '', status: 'present' });

  useEffect(() => {
    fetchAttendance();
    userAPI.getUsers({ role: 'student' }).then(res => setStudents(res.data));
  }, []);

  const fetchAttendance = () => {
    attendanceAPI.getAttendance().then(res => setAttendance(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await attendanceAPI.createAttendance(formData);
      fetchAttendance();
      setIsModalOpen(false);
      setFormData({ student: '', date: '', status: 'present' });
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const columns = [
    { header: 'Student', render: (row) => row.student?.name },
    { header: 'Date', render: (row) => new Date(row.date).toLocaleDateString() },
    { header: 'Status', render: (row) => (
      <span className={`px-3 py-1 rounded-full text-sm ${
        row.status === 'present' ? 'bg-green-100 text-green-800' :
        row.status === 'absent' ? 'bg-red-100 text-red-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {row.status}
      </span>
    )}
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Attendance Management</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus size={20} /> Mark Attendance
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <Table columns={columns} data={attendance} />
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mark Attendance">
            <form onSubmit={handleSubmit}>
              <select
                value={formData.student}
                onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Student</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                Submit
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;
