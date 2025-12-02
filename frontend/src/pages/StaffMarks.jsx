import { useState, useEffect } from 'react';
import { Plus, Edit } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { markAPI, userAPI, subjectAPI } from '../services/api';

const StaffMarks = () => {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMark, setEditingMark] = useState(null);
  const [formData, setFormData] = useState({
    student: '', subject: '', examType: '', marks: '', totalMarks: '', grade: ''
  });

  useEffect(() => {
    fetchMarks();
    userAPI.getUsers({ role: 'student' }).then(res => setStudents(res.data));
    subjectAPI.getSubjects().then(res => setSubjects(res.data));
  }, []);

  const fetchMarks = () => {
    markAPI.getMarks().then(res => setMarks(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMark) {
        await markAPI.updateMark(editingMark._id, formData);
      } else {
        await markAPI.createMark(formData);
      }
      fetchMarks();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({ student: '', subject: '', examType: '', marks: '', totalMarks: '', grade: '' });
    setEditingMark(null);
  };

  const openEditModal = (mark) => {
    setEditingMark(mark);
    setFormData({
      student: mark.student._id,
      subject: mark.subject._id,
      examType: mark.examType,
      marks: mark.marks,
      totalMarks: mark.totalMarks,
      grade: mark.grade
    });
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'Student', render: (row) => row.student?.name },
    { header: 'Subject', render: (row) => row.subject?.name },
    { header: 'Exam Type', accessor: 'examType' },
    { header: 'Marks', render: (row) => `${row.marks}/${row.totalMarks}` },
    { header: 'Grade', accessor: 'grade' }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Marks Management</h1>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus size={20} /> Add Marks
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <Table
              columns={columns}
              data={marks}
              actions={(mark) => (
                <button onClick={() => openEditModal(mark)} className="text-blue-500 hover:text-blue-700">
                  <Edit size={18} />
                </button>
              )}
            />
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMark ? 'Edit Marks' : 'Add Marks'}>
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
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <input
                type="text"
                placeholder="Exam Type (e.g., Midterm, Final)"
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Marks Obtained"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Total Marks"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Grade (e.g., A, B+)"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
              />
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                {editingMark ? 'Update' : 'Create'}
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default StaffMarks;
