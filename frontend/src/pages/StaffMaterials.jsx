import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { materialAPI, subjectAPI } from '../services/api';

const StaffMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', fileUrl: '', subject: '', class: '' });

  useEffect(() => {
    fetchMaterials();
    subjectAPI.getSubjects().then(res => setSubjects(res.data));
  }, []);

  const fetchMaterials = () => {
    materialAPI.getMaterials().then(res => setMaterials(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await materialAPI.createMaterial(formData);
      fetchMaterials();
      setIsModalOpen(false);
      setFormData({ title: '', description: '', fileUrl: '', subject: '', class: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this material?')) {
      await materialAPI.deleteMaterial(id);
      fetchMaterials();
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Subject', render: (row) => row.subject?.name || 'N/A' },
    { header: 'Class', accessor: 'class' },
    { header: 'File URL', render: (row) => (
      <a href={row.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
        View
      </a>
    )}
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Study Materials</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus size={20} /> Upload Material
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <Table
              columns={columns}
              data={materials}
              actions={(material) => (
                <button onClick={() => handleDelete(material._id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              )}
            />
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Material">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                rows="3"
              />
              <input
                type="text"
                placeholder="File URL (e.g., Google Drive link)"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
              >
                <option value="">Select Subject (Optional)</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <input
                type="text"
                placeholder="Class"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
              />
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                Upload
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default StaffMaterials;
