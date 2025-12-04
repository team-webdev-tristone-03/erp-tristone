import { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, Edit } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const StaffTimetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [allStaff, setAllStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchStaffList();
    if (user?.id) {
      fetchStaffTimetable(user.id);
      setSelectedStaff(user.id);
    }
  }, [user]);

  const fetchStaffList = async () => {
    try {
      const response = await axios.get('/api/timetable/staff/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAllStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff list:', error);
    }
  };

  const fetchStaffTimetable = async (staffId) => {
    try {
      const response = await axios.get(`/api/timetable/staff/${staffId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTimetable(response.data);
    } catch (error) {
      console.error('Error fetching staff timetable:', error);
    }
  };

  const handleStaffChange = (staffId) => {
    setSelectedStaff(staffId);
    fetchStaffTimetable(staffId);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '9:00-9:45', '9:45-10:30', '10:45-11:30', '11:30-12:15',
    '1:00-1:45', '1:45-2:30', '2:30-3:15', '3:15-4:00'
  ];

  const selectedStaffName = allStaff.find(s => s._id === selectedStaff)?.name || user?.name;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Staff Timetable</h1>
            <select
              value={selectedStaff}
              onChange={(e) => handleStaffChange(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Staff Member</option>
              {allStaff.map(staff => (
                <option key={staff._id} value={staff._id}>{staff.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {!timetable ? (
              <p className="text-gray-500 text-center py-8">Select a staff member to view timetable</p>
            ) : (
              <div>
                <div className="bg-blue-50 p-4 border-b">
                  <h2 className="text-xl font-bold text-blue-800">
                    {selectedStaffName}'s Schedule
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Period</th>
                        {days.map(day => (
                          <th key={day} className="px-4 py-3 text-center font-semibold">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((time, periodIndex) => (
                        <tr key={periodIndex} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock size={16} />
                              <div>
                                <div>Period {periodIndex + 1}</div>
                                <div className="text-xs text-gray-500">{time}</div>
                              </div>
                            </div>
                          </td>
                          {days.map(day => {
                            const daySchedule = timetable[day] || [];
                            const period = daySchedule.find(p => p.period === periodIndex + 1);
                            return (
                              <td key={day} className="px-4 py-3 text-center">
                                {period ? (
                                  <div className="bg-green-50 p-2 rounded border border-green-200">
                                    <div className="font-semibold text-green-800">{period.subject}</div>
                                    <div className="text-sm text-green-600">Class {period.class}</div>
                                    <div className="text-xs text-gray-500">{period.time}</div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">Free</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {timetable && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
              {days.map(day => (
                <div key={day} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-lg mb-3 text-center text-blue-600">{day}</h3>
                  <div className="space-y-2">
                    {(timetable[day] || []).map((period, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                        <div className="font-medium">P{period.period}: {period.subject}</div>
                        <div className="text-gray-600">Class {period.class}</div>
                      </div>
                    ))}
                    {(!timetable[day] || timetable[day].length === 0) && (
                      <p className="text-gray-400 text-center py-4">No classes</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffTimetable;