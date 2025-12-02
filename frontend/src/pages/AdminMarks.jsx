import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import { markAPI, userAPI, subjectAPI } from '../services/api';

const AdminMarks = () => {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    fetchMarks();
    userAPI.getUsers({ role: 'student' }).then(res => setStudents(res.data));
    subjectAPI.getSubjects().then(res => setSubjects(res.data));
  }, []);

  const fetchMarks = () => {
    const params = {};
    if (selectedStudent) params.student = selectedStudent;
    if (selectedSubject) params.subject = selectedSubject;
    markAPI.getMarks(params).then(res => setMarks(res.data));
  };

  const columns = [
    { header: 'Student', render: (row) => row.student?.name },
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
          <h1 className="text-2xl font-bold mb-6">Marks Overview</h1>

          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Filter by Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">All Students</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Filter by Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <button
                onClick={fetchMarks}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Filter
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <Table columns={columns} data={marks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMarks;
