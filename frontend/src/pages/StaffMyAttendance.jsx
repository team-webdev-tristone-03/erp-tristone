import { useState, useEffect } from 'react';
import { Calendar, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

const StaffMyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get('/api/staff-attendance', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAttendance(response.data || []);
    } catch (error) {
      console.error('Error:', error);
      setAttendance([]);
    }
  };

  const getAttendanceStats = () => {
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const halfDay = attendance.filter(a => a.status === 'half-day').length;
    const total = attendance.length;
    
    return { present, absent, late, halfDay, total };
  };

  const stats = getAttendanceStats();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Attendance</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              <div className="text-sm text-gray-600">Present</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              <div className="text-sm text-gray-600">Absent</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
              <div className="text-sm text-gray-600">Late</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.halfDay}</div>
              <div className="text-sm text-gray-600">Half Day</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Days</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={20} />
              <h3 className="font-semibold">Filters</h3>
            </div>
            <div className="flex gap-4">
              <select
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
                className="px-3 py-2 border rounded-lg"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
                className="px-3 py-2 border rounded-lg"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <option key={year} value={year}>{year}</option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Attendance Records */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar size={20} />
                Attendance Records
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Day</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    attendance.map((record) => (
                      <tr key={record._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                            record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffMyAttendance;