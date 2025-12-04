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
    { header: 'Student', render: (row) => (
      <div>
        <div className="font-medium">{row.student?.name}</div>
        <div className="text-sm text-gray-500">
          Class {row.student?.class} - Section {row.student?.section}
          {row.student?.rollNumber && ` (Roll: ${row.student.rollNumber})`}
        </div>
      </div>
    )},
    { header: 'Subject', render: (row) => row.subject?.name },
    { header: 'Exam Type', accessor: 'examType' },
    { header: 'Marks', render: (row) => (
      <div className="text-center">
        <span className="font-semibold">{row.marks}/{row.totalMarks}</span>
        <div className="text-sm text-gray-500">{((row.marks/row.totalMarks)*100).toFixed(1)}%</div>
      </div>
    )},
    { header: 'Grade', render: (row) => (
      <span className={`px-2 py-1 rounded text-sm font-medium ${
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
            <h1 className="text-2xl font-bold">Marks Overview</h1>
            <p className="text-gray-600">View and monitor all student marks across classes and subjects</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Students</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} - Class {s.class} {s.section}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <button
                onClick={fetchMarks}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {marks.length} mark records
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
