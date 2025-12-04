import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { userAPI } from '../services/api';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ class: '', section: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', class: '', section: '', rollNumber: ''
  });

  useEffect(() => {
    fetchStudents();
  }, [search, filters]);

  const fetchStudents = () => {
    const params = { role: 'student', search };
    if (filters.class) params.class = filters.class;
    if (filters.section) params.section = filters.section;
    userAPI.getUsers(params).then(res => setStudents(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await userAPI.updateUser(editingStudent._id, formData);
      } else {
        await userAPI.createUser({ ...formData, role: 'student' });
      }
      fetchStudents();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this student?')) {
      await userAPI.deleteUser(id);
      fetchStudents();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', phone: '', class: '', section: '', rollNumber: '' });
    setEditingStudent(null);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Class', accessor: 'class' },
    { header: 'Section', accessor: 'section' },
    { header: 'Roll No', accessor: 'rollNumber' }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Students Management</h1>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus size={20} /> Add Student
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="font-semibold mb-3">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
              <select
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Classes</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
              <select
                value={filters.section}
                onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
              <button
                onClick={() => fetchStudents()}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  setFilters({ class: '', section: '' });
                  setSearch('');
                }}
                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <Table
              columns={columns}
              data={students}
              actions={(student) => (
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(student)} className="text-blue-500 hover:text-blue-700">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(student._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            />
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? 'Edit Student' : 'Add Student'}>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              {!editingStudent && (
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full mb-3 px-4 py-2 border rounded-lg"
                  required
                />
              )}
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Class"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Section"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
              />
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                {editingStudent ? 'Update' : 'Create'}
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
