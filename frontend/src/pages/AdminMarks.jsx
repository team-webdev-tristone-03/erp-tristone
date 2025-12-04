import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import { markAPI, userAPI, subjectAPI } from '../services/api';

const AdminMarks = () => {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  useEffect(() => {
    fetchMarks();
    userAPI.getUsers({ role: 'student' }).then(res => setStudents(res.data));
    subjectAPI.getSubjects().then(res => setSubjects(res.data));
    markAPI.getClassesAndSections().then(res => {
      setClasses(res.data.classes);
      setSections(res.data.sections);
    });
  }, []);

  const fetchMarks = () => {
    const params = {};
    if (selectedStudent) params.student = selectedStudent;
    if (selectedSubject) params.subject = selectedSubject;
    if (selectedClass) params.class = selectedClass;
    if (selectedSection) params.section = selectedSection;
    markAPI.getMarks(params).then(res => setMarks(res.data));
  };

  const columns = [
    { header: 'Student', render: (row) => row.student?.name },
    { header: 'Class', render: (row) => row.student?.class },
    { header: 'Section', render: (row) => row.student?.section },
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">All Classes</option>
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">All Sections</option>
                  {sections.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">All Students</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
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
