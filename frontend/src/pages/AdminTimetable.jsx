import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from 'axios';

const AdminTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [formData, setFormData] = useState({
    class: '',
    section: 'A',
    schedule: {}
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['9:00-9:45', '9:45-10:30', 'BREAK', '10:45-11:30', '11:30-12:15', 'LUNCH', '1:00-1:45', '1:45-2:30', 'BREAK', '2:45-3:30'];
  const classes = ['6', '7', '8', '9', '10'];
  const sections = ['A', 'B'];
  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Hindi', 'Physics', 'Chemistry', 'Biology'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [timetableRes, staffRes] = await Promise.all([
        axios.get('http://localhost:8000/api/timetable', { headers }),
        axios.get('http://localhost:8000/api/timetable/staff/list', { headers })
      ]);
      
      setTimetables(timetableRes.data || []);
      setStaff(staffRes.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const initializeSchedule = () => {
    const schedule = {};
    days.forEach(day => {
      schedule[day] = timeSlots.map((time, index) => ({
        period: index + 1,
        time: time,
        subject: time === 'BREAK' || time === 'LUNCH' ? time : '',
        teacher: ''
      }));
    });
    return schedule;
  };

  const handleCreateNew = () => {
    setEditingTimetable(null);
    setFormData({
      class: '',
      section: 'A',
      schedule: initializeSchedule()
    });
    setShowForm(true);
  };

  const handleEdit = (timetable) => {
    setEditingTimetable(timetable);
    setFormData({
      class: timetable.class,
      section: timetable.section,
      schedule: timetable.schedule || initializeSchedule()
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.class) {
        alert('Please select a class');
        return;
      }

      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingTimetable) {
        await axios.put(`http://localhost:8000/api/timetable/${editingTimetable._id}`, formData, { headers });
        alert('Timetable updated successfully!');
      } else {
        await axios.post('http://localhost:8000/api/timetable', formData, { headers });
        alert('Timetable created successfully!');
      }
      
      setShowForm(false);
      fetchData();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to save'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this timetable?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/timetable/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Timetable deleted successfully!');
        fetchData();
      } catch (error) {
        alert('Error deleting timetable');
      }
    }
  };

  const updatePeriod = (day, periodIndex, field, value) => {
    const newSchedule = { ...formData.schedule };
    if (newSchedule[day] && newSchedule[day][periodIndex]) {
      newSchedule[day][periodIndex][field] = value;
      setFormData({ ...formData, schedule: newSchedule });
    }
  };

  const quickCreate = (className, section) => {
    setEditingTimetable(null);
    setFormData({
      class: className,
      section: section,
      schedule: initializeSchedule()
    });
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{editingTimetable ? 'Edit' : 'Create'} Timetable</h1>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Back
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4 grid grid-cols-2 gap-4">
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({...formData, section: e.target.value})}
                  className="px-3 py-2 border rounded-lg"
                >
                  {sections.map(section => (
                    <option key={section} value={section}>Section {section}</option>
                  ))}
                </select>
              </div>

              <div className="overflow-auto mb-4">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-gray-100">Day</th>
                      {timeSlots.map((time, index) => (
                        <th key={index} className={`border p-2 text-center ${
                          time === 'BREAK' || time === 'LUNCH' ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                          {time}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day) => (
                      <tr key={day}>
                        <td className="border p-2 font-medium bg-blue-50">{day}</td>
                        {timeSlots.map((time, timeIndex) => (
                          <td key={timeIndex} className={`border p-1 ${
                            time === 'BREAK' || time === 'LUNCH' ? 'bg-yellow-50' : ''
                          }`}>
                            {time === 'BREAK' || time === 'LUNCH' ? (
                              <div className="text-center text-yellow-700 font-medium">{time}</div>
                            ) : (
                              <div className="space-y-1">
                                <select
                                  value={formData.schedule?.[day]?.[timeIndex]?.subject || ''}
                                  onChange={(e) => updatePeriod(day, timeIndex, 'subject', e.target.value)}
                                  className="w-full px-1 py-1 border rounded text-xs"
                                >
                                  <option value="">Subject</option>
                                  {subjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                  ))}
                                </select>
                                <select
                                  value={formData.schedule?.[day]?.[timeIndex]?.teacher || ''}
                                  onChange={(e) => updatePeriod(day, timeIndex, 'teacher', e.target.value)}
                                  className="w-full px-1 py-1 border rounded text-xs"
                                >
                                  <option value="">Teacher</option>
                                  {staff.map(teacher => (
                                    <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                {editingTimetable ? 'Update' : 'Create'} Timetable
              </button>
            </div>
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
            <h1 className="text-2xl font-bold">Timetable Management</h1>
            <button
              onClick={handleCreateNew}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus size={20} /> Add Timetable
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Existing Timetables</h2>
            {timetables.length === 0 ? (
              <p className="text-gray-500">No timetables found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timetables.map((timetable) => (
                  <div key={timetable._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">Class {timetable.class}{timetable.section}</h3>
                        <p className="text-gray-600">Section {timetable.section}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(timetable)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(timetable._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Quick Create</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {classes.map((className) => 
                sections.map((section) => {
                  const exists = timetables.find(t => t.class === className && t.section === section);
                  return (
                    <button
                      key={`${className}-${section}`}
                      onClick={() => quickCreate(className, section)}
                      disabled={exists}
                      className={`p-3 rounded-lg ${
                        exists 
                          ? 'bg-gray-200 text-gray-500' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      Class {className}{section}
                      {exists && <div className="text-xs">Exists</div>}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTimetable;