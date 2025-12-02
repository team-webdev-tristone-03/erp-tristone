import { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import { markAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';

const StudentMarks = () => {
  const [marks, setMarks] = useState([]);
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchMarks();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('markUpdate', (updatedMark) => {
        if (updatedMark.student._id === user.id) {
          fetchMarks();
        }
      });
      return () => socket.off('markUpdate');
    }
  }, [socket, user]);

  const fetchMarks = () => {
    markAPI.getMarks({ student: user.id }).then(res => setMarks(res.data));
  };

  const columns = [
    { header: 'Subject', render: (row) => row.subject?.name },
    { header: 'Exam Type', accessor: 'examType' },
    { header: 'Marks', render: (row) => `${row.marks}/${row.totalMarks}` },
    { header: 'Percentage', render: (row) => `${((row.marks / row.totalMarks) * 100).toFixed(2)}%` },
    { header: 'Grade', accessor: 'grade' }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">My Marks</h1>
          <div className="bg-white rounded-lg shadow-md">
            <Table columns={columns} data={marks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMarks;
