import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { subjectAPI, userAPI } from '../services/api';

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', class: '', teacher: '' });

  useEffect(() => {
    fetchSubjects();
    userAPI.getUsers({ role: 'staff' }).then(res => setTeachers(res.data));
  }, []);

  const fetchSubjects = () => {
    subjectAPI.getSubjects().then(res => setSubjects(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await subjectAPI.updateSubject(editingSubject._id, formData);
      } else {
        await subjectAPI.createSubject(formData);
      }
      fetchSubjects();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this subject?')) {
      await subjectAPI.deleteSubject(id);
      fetchSubjects();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', class: '', teacher: '' });
    setEditingSubject(null);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      class: subject.class,
      teacher: subject.teacher?._id || ''
    });
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Code', accessor: 'code' },
    { header: 'Class', accessor: 'class' },
    { header: 'Teacher', render: (row) => row.teacher?.name || 'Not Assigned' }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Subjects Management</h1>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus size={20} /> Add Subject
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <Table
              columns={columns}
              data={subjects}
              actions={(subject) => (
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(subject)} className="text-blue-500 hover:text-blue-700">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(subject._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            />
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSubject ? 'Edit Subject' : 'Add Subject'}>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Subject Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Subject Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Class"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
              />
              <select
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
              >
                <option value="">Select Teacher (Optional)</option>
                {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                {editingSubject ? 'Update' : 'Create'}
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminSubjects;
