import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import { attendanceAPI } from '../services/api';

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = () => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    attendanceAPI.getAttendance(params).then(res => setAttendance(res.data));
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
    )},
    { header: 'Subject', render: (row) => row.subject?.name || 'N/A' }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Attendance Records</h1>

          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <button
                onClick={fetchAttendance}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Filter
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <Table columns={columns} data={attendance} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;
