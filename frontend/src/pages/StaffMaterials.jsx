import { useState, useEffect, useContext } from 'react';
import { Plus, Trash2, Upload, AlertCircle, Search, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { materialAPI, subjectAPI, classAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const StaffMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClassName, setSelectedClassName] = useState('');
  const [availableSections, setAvailableSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterType, setFilterType] = useState('');
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    fileUrl: '', 
    subject: '', 
    class: '', 
    section: '' 
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [materialsRes, subjectsRes, classesRes] = await Promise.all([
        materialAPI.getMaterials(),
        subjectAPI.getSubjects(),
        classAPI.getClasses()
      ]);
      setMaterials(materialsRes.data);
      setSubjects(subjectsRes.data);
      setClasses(classesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelection = (className) => {
    setSelectedClassName(className);
    setFormData(prev => ({ ...prev, class: className, section: '' }));
    
    const classesForName = classes.filter(cls => cls.className === className);
    const sections = classesForName.map(cls => cls.section).filter(Boolean);
    const uniqueSections = [...new Set(sections)].sort();
    setAvailableSections(uniqueSections);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', fileUrl: '', subject: '', class: '', section: '' });
    setSelectedClassName('');
    setAvailableSections([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Determine file type from URL
      const url = formData.fileUrl.toLowerCase();
      let fileType = 'Link';
      if (url.includes('.pdf')) fileType = 'PDF';
      else if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.gif')) fileType = 'Image';
      else if (url.includes('.mp4') || url.includes('.avi') || url.includes('.mov')) fileType = 'Video';
      else if (url.includes('.doc') || url.includes('.docx')) fileType = 'Document';
      
      const materialData = {
        ...formData,
        fileType,
        uploadedBy: user._id
      };
      
      const response = await materialAPI.createMaterial(materialData);
      setMaterials(prev => [response.data, ...prev]);
      setIsModalOpen(false);
      resetForm();
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload material');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this material?')) {
      try {
        await materialAPI.deleteMaterial(id);
        setMaterials(prev => prev.filter(m => m._id !== id));
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete material');
      }
    }
  };

  // Filter materials based on search and filters
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (material.description && material.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClass = !filterClass || material.class === filterClass;
    const matchesSection = !filterSection || material.section === filterSection;
    const matchesType = !filterType || material.fileType === filterType;
    
    return matchesSearch && matchesClass && matchesSection && matchesType;
  });

  const columns = [
    { 
      header: 'Material', 
      render: (row) => (
        <div>
          <div className="font-semibold">{row.title}</div>
          <div className="text-sm text-gray-500">{row.description || 'No description'}</div>
        </div>
      )
    },
    { 
      header: 'Class & Section', 
      render: (row) => (
        <div className="text-center">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            Class {row.class}
          </span>
          <br />
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mt-1 inline-block">
            {row.section}
          </span>
        </div>
      )
    },
    { 
      header: 'Subject', 
      render: (row) => (
        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
          {row.subject?.name || 'General'}
        </span>
      )
    },
    { 
      header: 'Type', 
      render: (row) => (
        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
          {row.fileType || 'Link'}
        </span>
      )
    },
    { 
      header: 'Date', 
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    { 
      header: 'File', 
      render: (row) => (
        <a href={row.fileUrl} target="_blank" rel="noopener noreferrer" 
           className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1 w-fit">
          <Upload size={14} /> Open
        </a>
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <Navbar />
        <div className="p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-6 gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Study Materials</h1>
            <p className="text-sm lg:text-base text-gray-600">Upload and manage teaching materials for your classes</p>
          </div>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 w-full sm:w-auto"
          >
            <Plus size={20} /> Upload Material
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              {[...new Set(classes.map(cls => cls.className).filter(Boolean))].sort().map(className => (
                <option key={className} value={className}>Class {className}</option>
              ))}
            </select>
            
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sections</option>
              <option value="All Sections">All Sections</option>
              {['A', 'B', 'C', 'D', 'E', 'F'].map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="PDF">PDF</option>
              <option value="Image">Image</option>
              <option value="Video">Video</option>
              <option value="Document">Document</option>
              <option value="Link">Link</option>
            </select>
            
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">{filteredMaterials.length} materials</span>
            </div>
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

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table
            columns={columns}
            data={filteredMaterials}
            actions={(material) => (
              <button 
                onClick={() => handleDelete(material._id)} 
                className="text-red-500 hover:text-red-700 p-1 rounded"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            )}
          />
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Study Material">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Material Title *</label>
              <input
                type="text"
                placeholder="Enter material title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                placeholder="Brief description of the material"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">File / Link *</label>
              <input
                type="url"
                placeholder="https://drive.google.com/file/... or any file URL"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 mt-1">Supports: PDF, Images, Videos, Documents, Links</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Class *</label>
                <select
                  value={selectedClassName}
                  onChange={(e) => handleClassSelection(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitting}
                >
                  <option value="">Select Class</option>
                  {[...new Set(classes.map(cls => cls.className).filter(Boolean))].sort().map(className => (
                    <option key={className} value={className}>Class {className}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section *</label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitting || !selectedClassName}
                >
                  <option value="">Select Section</option>
                  <option value="All Sections">All Sections</option>
                  {availableSections.map(section => (
                    <option key={section} value={section}>Section {section}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={submitting}
              >
                <option value="">Select Subject (Optional)</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Material
                </>
              )}
            </button>
          </form>
        </Modal>
        </div>
      </div>
    </div>
  );
};

export default StaffMaterials;
