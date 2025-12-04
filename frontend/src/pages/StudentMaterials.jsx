import { useState, useEffect, useContext } from 'react';
import { Download, FileText, Calendar, User, AlertCircle, ExternalLink } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import { materialAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const StudentMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchMaterials();
  }, [user]);

  useEffect(() => {
    // Mark materials as viewed when component mounts
    if (user?.class && user?.section) {
      markMaterialsAsViewed();
    }
  }, [user]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await materialAPI.getMaterials({ 
        class: user.class, 
        section: user.section 
      });
      setMaterials(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const markMaterialsAsViewed = async () => {
    try {
      await materialAPI.markMaterialAsViewed({
        studentClass: user.class,
        studentSection: user.section
      });
    } catch (err) {
      console.error('Failed to mark materials as viewed:', err);
    }
  };

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'PDF': return '📄';
      case 'Image': return '🖼️';
      case 'Video': return '🎥';
      case 'Document': return '📝';
      default: return '🔗';
    }
  };

  const columns = [
    { 
      header: 'Material', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getFileTypeIcon(row.fileType)}</div>
          <div>
            <div className="font-semibold">{row.title}</div>
            <div className="text-sm text-gray-500">{row.description || 'No description'}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {row.fileType || 'Link'}
              </span>
              {row.section === 'All Sections' && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  All Sections
                </span>
              )}
            </div>
          </div>
        </div>
      )
    },
    { 
      header: 'Subject', 
      render: (row) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {row.subject?.name || 'General'}
        </span>
      )
    },
    { 
      header: 'Uploaded By', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <span>{row.uploadedBy?.name || 'Staff'}</span>
        </div>
      )
    },
    { 
      header: 'Date', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span>{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      )
    },
    { 
      header: 'Access', 
      render: (row) => (
        <div className="flex gap-2">
          <a 
            href={row.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1 text-sm"
          >
            <ExternalLink size={14} /> Open
          </a>
          <a 
            href={row.fileUrl} 
            download
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-1 text-sm"
          >
            <Download size={14} /> Download
          </a>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Study Materials</h1>
            <p className="text-gray-600">Class {user.class} - Section {user.section}</p>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-blue-800 font-medium">{materials.length} Materials Available</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={20} />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {materials.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Materials Available</h3>
            <p className="text-gray-500">Your teachers haven't uploaded any study materials yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            <Table columns={columns} data={materials} />
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default StudentMaterials;