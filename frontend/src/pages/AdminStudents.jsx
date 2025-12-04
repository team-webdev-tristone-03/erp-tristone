import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { userAPI, classAPI } from '../services/api';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedClassName, setSelectedClassName] = useState('');
  const [availableSections, setAvailableSections] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', class: '', section: '', rollNumber: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [search]);

  const fetchClasses = async () => {
    try {
      const res = await classAPI.getClasses();
      // Store raw class data for section filtering
      setClasses(res.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = () => {
    userAPI.getUsers({ role: 'student', search }).then(res => setStudents(res.data));
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
    setSelectedClassName('');
    setAvailableSections([]);
    setEditingStudent(null);
  };

  const handleClassNameSelection = (className) => {
    setSelectedClassName(className);
    setFormData(prev => ({ ...prev, class: className, section: '' }));
    
    // Get available sections for this class from individual class records
    const classesForName = classes.filter(cls => cls.className === className);
    const sections = classesForName.map(cls => cls.section).filter(Boolean);
    const uniqueSections = [...new Set(sections)].sort();
    setAvailableSections(uniqueSections);
    
    console.log('Selected class:', className);
    console.log('Available classes:', classesForName);
    console.log('Available sections:', uniqueSections);
  };

  const handleSectionSelection = (section) => {
    setFormData(prev => ({ ...prev, section }));
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData(student);
    
    // Set class name and available sections
    if (student.class) {
      setSelectedClassName(student.class);
      const classesForName = classes.filter(cls => cls.className === student.class);
      const sections = classesForName.map(cls => cls.section).filter(Boolean);
      const uniqueSections = [...new Set(sections)].sort();
      setAvailableSections(uniqueSections);
    }
    
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

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Class *</label>
                  <select
                    value={selectedClassName}
                    onChange={(e) => handleClassNameSelection(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Class</option>
                    {[...new Set(classes.map(cls => cls.className).filter(Boolean))].sort().map(className => (
                      <option key={className} value={className}>
                        Class {className}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Section *</label>
                  <select
                    value={formData.section}
                    onChange={(e) => handleSectionSelection(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                    disabled={!selectedClassName}
                  >
                    <option value="">Select Section</option>
                    {availableSections.map(section => (
                      <option key={section} value={section}>
                        Section {section}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
