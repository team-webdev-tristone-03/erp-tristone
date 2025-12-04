import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Users, Search, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { userAPI, classAPI } from '../services/api';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClassStudents, setSelectedClassStudents] = useState([]);
  const [viewingClass, setViewingClass] = useState(null);
  
  // Filters
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  
  const [formData, setFormData] = useState({ 
    className: '', 
    classCode: '', 
    sections: [], 
    classTeacher: ''
  });

  useEffect(() => {
    fetchClasses();
    fetchStudents();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await classAPI.getClasses();
      setClasses(res.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await userAPI.getUsers({ role: 'student' });
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await userAPI.getUsers({ role: 'staff' });
      setTeachers(res.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const getStudentCount = (className, section) => {
    return students.filter(student => 
      student.class === className && student.section === section
    ).length;
  };

  const viewClassStudents = (classItem) => {
    const classStudents = students.filter(student => 
      student.class === classItem.className && student.section === classItem.section
    );
    setSelectedClassStudents(classStudents);
    setViewingClass(classItem);
    setIsStudentModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.sections.length === 0) {
      alert('Please select at least one section');
      return;
    }
    
    try {
      if (editingClass) {
        const updateData = {
          className: formData.className,
          classCode: `${formData.classCode}${formData.sections[0]}`,
          section: formData.sections[0],
          classTeacher: formData.classTeacher
        };
        await classAPI.updateClass(editingClass._id, updateData);
      } else {
        const classPromises = formData.sections.map(section => {
          const classData = {
            className: formData.className,
            classCode: `${formData.classCode}${section}`,
            section: section,
            classTeacher: formData.classTeacher
          };
          return classAPI.createClass(classData);
        });
        
        await Promise.all(classPromises);
      }
      
      await fetchClasses();
      setIsModalOpen(false);
      resetForm();
      
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (classItem) => {
    if (window.confirm(`Delete class ${classItem.className}-${classItem.section}?`)) {
      try {
        await classAPI.deleteClass(classItem._id);
        fetchClasses();
      } catch (error) {
        alert('Error deleting class: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ className: '', classCode: '', sections: [], classTeacher: '' });
    setEditingClass(null);
  };

  const openEditModal = (classItem) => {
    setEditingClass(classItem);
    const baseClassCode = classItem.classCode.replace(/[A-H]$/, '');
    setFormData({
      className: classItem.className,
      classCode: baseClassCode,
      sections: [classItem.section],
      classTeacher: classItem.classTeacher?._id || ''
    });
    setIsModalOpen(true);
  };

  const handleSectionSelection = (section) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.includes(section)
        ? prev.sections.filter(s => s !== section)
        : [...prev.sections, section]
    }));
  };

  // Filter classes based on filters
  const filteredClasses = classes.filter(cls => {
    const matchesClass = !classFilter || cls.className === classFilter;
    const matchesSection = !sectionFilter || cls.section === sectionFilter;
    const matchesSearch = !searchFilter || 
      cls.className.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cls.classCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cls.classTeacher?.name.toLowerCase().includes(searchFilter.toLowerCase());
    
    return matchesClass && matchesSection && matchesSearch;
  });

  const columns = [
    { header: 'Class Name', accessor: 'className' },
    { header: 'Section', accessor: 'section' },
    { header: 'Class Code', accessor: 'classCode' },
    { header: 'Class Teacher', render: (row) => row.classTeacher?.name || 'Not Assigned' },
    { 
      header: 'Total Students', 
      render: (row) => {
        const count = getStudentCount(row.className, row.section);
        return (
          <button 
            onClick={() => viewClassStudents(row)}
            className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 flex items-center gap-1"
          >
            <Users size={14} />
            {count}
          </button>
        );
      }
    }
  ];

  const studentColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Roll No', accessor: 'rollNumber' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Admission Date', render: (row) => new Date(row.createdAt).toLocaleDateString() }
  ];

  // Get unique class names and sections for filters
  const uniqueClassNames = [...new Set(classes.map(cls => cls.className))].sort();
  const uniqueSections = [...new Set(classes.map(cls => cls.section))].sort();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <Navbar />
        <div className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-6 gap-4">
            <h1 className="text-xl lg:text-2xl font-bold">Class Management</h1>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 w-full sm:w-auto"
            >
              <Plus size={20} /> Add Class
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Class</label>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">All Classes</option>
                  {uniqueClassNames.map(className => (
                    <option key={className} value={className}>Class {className}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Section</label>
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">All Sections</option>
                  {uniqueSections.map(section => (
                    <option key={section} value={section}>Section {section}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by class, code, or teacher..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table
              columns={columns}
              data={filteredClasses}
              actions={(classItem) => (
                <div className="flex gap-1 lg:gap-2">
                  <button onClick={() => openEditModal(classItem)} className="text-blue-500 hover:text-blue-700 p-1 rounded">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(classItem)} className="text-red-500 hover:text-red-700 p-1 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </div>

          {/* Add/Edit Class Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClass ? 'Edit Class' : 'Add Class'}>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Class Name (e.g., 10, 11, 12)"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Class Code (e.g., CLS10, CLS11)"
                value={formData.classCode}
                onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Select Sections *</label>
                <div className="grid grid-cols-4 gap-2 p-3 border rounded-lg">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(section => (
                    <label key={section} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.sections.includes(section)}
                        onChange={() => handleSectionSelection(section)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{section}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Selected: {formData.sections.join(', ') || 'None'}</p>
              </div>
              <select
                value={formData.classTeacher}
                onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Class Teacher *</option>
                {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>

              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                {editingClass ? 'Update' : 'Create'}
              </button>
            </form>
          </Modal>

          {/* Student List Modal */}
          <Modal 
            isOpen={isStudentModalOpen} 
            onClose={() => setIsStudentModalOpen(false)} 
            title={`Students in Class ${viewingClass?.className} - Section ${viewingClass?.section}`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Total Students: {selectedClassStudents.length}
                </h3>
                <div className="text-sm text-gray-500">
                  Class Teacher: {viewingClass?.classTeacher?.name || 'Not Assigned'}
                </div>
              </div>
              
              {selectedClassStudents.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No students assigned to this class yet.</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <Table
                    columns={studentColumns}
                    data={selectedClassStudents}
                  />
                </div>
              )}
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminClasses;