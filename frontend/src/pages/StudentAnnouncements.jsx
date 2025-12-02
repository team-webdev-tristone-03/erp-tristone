import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { announcementAPI } from '../services/api';

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    announcementAPI.getAnnouncements({ targetRole: 'student' })
      .then(res => setAnnouncements(res.data));
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Announcements</h1>
          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <div key={announcement._id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
                <p className="text-gray-700 mb-3">{announcement.content}</p>
                <p className="text-sm text-gray-500">
                  Posted on {new Date(announcement.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnnouncements;
