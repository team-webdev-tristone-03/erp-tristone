import { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import { attendanceAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('attendanceUpdate', (updatedAttendance) => {
        if (updatedAttendance.student._id === user.id) {
          fetchAttendance();
        }
      });
      return () => socket.off('attendanceUpdate');
    }
  }, [socket, user]);

  const fetchAttendance = () => {
    attendanceAPI.getAttendance({ student: user.id }).then(res => setAttendance(res.data));
  };

  const columns = [
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
    { header: 'Remarks', accessor: 'remarks' }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">My Attendance</h1>
          <div className="bg-white rounded-lg shadow-md">
            <Table columns={columns} data={attendance} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
