import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { announcementAPI } from '../services/api';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', targetRole: 'all' });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    announcementAPI.getAnnouncements().then(res => setAnnouncements(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await announcementAPI.createAnnouncement(formData);
      fetchAnnouncements();
      setIsModalOpen(false);
      setFormData({ title: '', content: '', targetRole: 'all' });
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      await announcementAPI.deleteAnnouncement(id);
      fetchAnnouncements();
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Announcements</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus size={20} /> Create Announcement
            </button>
          </div>

          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <div key={announcement._id} className="bg-white rounded-lg shadow-md p-6 relative">
                <button
                  onClick={() => handleDelete(announcement._id)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">{announcement.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    announcement.targetRole === 'all' ? 'bg-blue-100 text-blue-800' :
                    announcement.targetRole === 'student' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {announcement.targetRole}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{announcement.content}</p>
                <p className="text-sm text-gray-500">
                  Posted on {new Date(announcement.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Announcement">
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
                placeholder="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                rows="4"
                required
              />
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
              >
                <option value="all">All Users</option>
                <option value="student">Students Only</option>
                <option value="staff">Staff Only</option>
              </select>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                Create
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
