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
    { header: 'Subject', render: (row) => (
      <span className="font-medium">{row.subject?.name}</span>
    )},
    { header: 'Exam Type', render: (row) => (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
        {row.examType}
      </span>
    )},
    { header: 'Marks', render: (row) => (
      <div className="text-center">
        <span className="font-semibold text-lg">{row.marks}/{row.totalMarks}</span>
      </div>
    )},
    { header: 'Percentage', render: (row) => {
      const percentage = ((row.marks / row.totalMarks) * 100).toFixed(1);
      return (
        <div className="text-center">
          <span className={`font-semibold ${
            percentage >= 90 ? 'text-green-600' :
            percentage >= 75 ? 'text-blue-600' :
            percentage >= 60 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {percentage}%
          </span>
        </div>
      );
    }},
    { header: 'Grade', render: (row) => (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        row.grade === 'A' ? 'bg-green-100 text-green-800' :
        row.grade === 'B' ? 'bg-blue-100 text-blue-800' :
        row.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {row.grade || 'N/A'}
      </span>
    )}
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">My Marks</h1>
            <p className="text-gray-600">View your academic performance across all subjects</p>
          </div>
          
          {marks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-500">Total Exams</h3>
                <p className="text-2xl font-bold text-blue-600">{marks.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
                <p className="text-2xl font-bold text-green-600">
                  {(marks.reduce((acc, mark) => acc + (mark.marks / mark.totalMarks * 100), 0) / marks.length).toFixed(1)}%
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-500">Highest Score</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.max(...marks.map(mark => (mark.marks / mark.totalMarks * 100))).toFixed(1)}%
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-500">Subjects</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {new Set(marks.map(mark => mark.subject?._id)).size}
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md">
            {marks.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No marks available</h3>
                <p className="text-gray-500">Your marks will appear here once your teachers add them.</p>
              </div>
            ) : (
              <Table columns={columns} data={marks} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMarks;
