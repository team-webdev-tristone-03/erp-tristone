import { useState, useEffect, useContext } from 'react';
import { Download, FileText } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

const StudentMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.class) {
      fetchMaterials();
    }
  }, [user]);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`/api/materials?class=${user.class}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMaterials(response.data || []);
    } catch (error) {
      console.error('Error:', error);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Study Materials - Class {user?.class}{user?.section}</h1>
          
          <div className="bg-white rounded-lg shadow-md">
            {materials.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No study materials available for your class</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Title</th>
                      <th className="px-4 py-3 text-left font-semibold">Description</th>
                      <th className="px-4 py-3 text-left font-semibold">Subject</th>
                      <th className="px-4 py-3 text-left font-semibold">Uploaded By</th>
                      <th className="px-4 py-3 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((material) => (
                      <tr key={material._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{material.title}</td>
                        <td className="px-4 py-3 text-gray-600">{material.description}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {material.subject?.name || 'General'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {material.uploadedBy?.name || 'Teacher'}
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={material.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700"
                          >
                            <Download size={16} />
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMaterials;