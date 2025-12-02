import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { userAPI } from '../services/api';

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = () => {
    userAPI.getUsers({ role: 'staff' }).then(res => setStaff(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await userAPI.updateUser(editingStaff._id, formData);
      } else {
        await userAPI.createUser({ ...formData, role: 'staff' });
      }
      fetchStaff();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this staff member?')) {
      await userAPI.deleteUser(id);
      fetchStaff();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', phone: '' });
    setEditingStaff(null);
  };

  const openEditModal = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData(staffMember);
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus size={20} /> Add Staff
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <Table
              columns={columns}
              data={staff}
              actions={(staffMember) => (
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(staffMember)} className="text-blue-500 hover:text-blue-700">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(staffMember._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            />
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStaff ? 'Edit Staff' : 'Add Staff'}>
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
              {!editingStaff && (
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
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                {editingStaff ? 'Update' : 'Create'}
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminStaff;
