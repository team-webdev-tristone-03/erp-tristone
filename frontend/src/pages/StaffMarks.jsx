import { useState, useEffect } from 'react';
import { Plus, Edit, Users } from 'lucide-react';
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
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [formData, setFormData] = useState({
    student: '', subject: '', examType: '', marks: '', totalMarks: '', grade: ''
  });

  useEffect(() => {
    fetchMarks();
    userAPI.getUsers({ role: 'student' }).then(res => setStudents(res.data));
    subjectAPI.getSubjects().then(res => setSubjects(res.data));
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      const filtered = students.filter(student => 
        student.class === selectedClass && student.section === selectedSection
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [selectedClass, selectedSection, students]);

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
    setSelectedClass('');
    setSelectedSection('');
    setFilteredStudents([]);
  };

  const getUniqueClasses = () => {
    return [...new Set(students.map(s => s.class).filter(Boolean))].sort();
  };

  const getUniqueSections = () => {
    return [...new Set(students.map(s => s.section).filter(Boolean))].sort();
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
    { header: 'Student', render: (row) => (
      <div>
        <div className="font-medium">{row.student?.name}</div>
        <div className="text-sm text-gray-500">Class {row.student?.class} - {row.student?.section}</div>
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <Navbar />
        <div className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-6 gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold">Marks Management</h1>
              <p className="text-sm lg:text-base text-gray-600">Add and manage student marks by class and section</p>
            </div>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 w-full sm:w-auto"
            >
              <Plus size={20} /> Add Marks
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table
              columns={columns}
              data={marks}
              actions={(mark) => (
                <button 
                  onClick={() => openEditModal(mark)} 
                  className="text-blue-500 hover:text-blue-700 p-1 rounded"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
              )}
            />
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMark ? 'Edit Marks' : 'Add Marks'}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingMark && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Class *</label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Class</option>
                        {getUniqueClasses().map(cls => (
                          <option key={cls} value={cls}>Class {cls}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Section *</label>
                      <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!selectedClass}
                      >
                        <option value="">Select Section</option>
                        {getUniqueSections().map(section => (
                          <option key={section} value={section}>Section {section}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {filteredStudents.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Users size={16} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Students in Class {selectedClass} - Section {selectedSection} ({filteredStudents.length})
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {filteredStudents.map(student => (
                          <div key={student._id} className="text-sm text-gray-600 bg-white p-2 rounded border">
                            {student.name} (Roll: {student.rollNumber})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Student *</label>
                <select
                  value={formData.student}
                  onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!editingMark && filteredStudents.length === 0}
                >
                  <option value="">Select Student</option>
                  {(editingMark ? students : filteredStudents).map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} {s.rollNumber && `(Roll: ${s.rollNumber})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Exam Type *</label>
                <input
                  type="text"
                  placeholder="e.g., Midterm, Final, Quiz"
                  value={formData.examType}
                  onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Marks Obtained *</label>
                  <input
                    type="number"
                    placeholder="85"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Marks *</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Grade</label>
                <input
                  type="text"
                  placeholder="A, B+, C, etc."
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                disabled={!editingMark && (!selectedClass || !selectedSection || filteredStudents.length === 0)}
              >
                {editingMark ? 'Update Marks' : 'Add Marks'}
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default StaffMarks;
