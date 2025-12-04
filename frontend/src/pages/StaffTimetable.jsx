import { useState, useEffect, useContext } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:8000';

const StaffTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '9:00-9:45', '9:45-10:30', 'BREAK', '10:45-11:30', '11:30-12:15', 
    'LUNCH', '1:00-1:45', '1:45-2:30', 'BREAK', '2:45-3:30'
  ];

  useEffect(() => {
    fetchTimetables();
  }, []);

  // Socket.IO real-time updates
  useEffect(() => {
    if (socket) {
      socket.on('timetableUpdate', (data) => {
        console.log('Staff timetable update received:', data);
        fetchTimetables();
      });

      return () => {
        socket.off('timetableUpdate');
      };
    }
  }, [socket]);

  const fetchTimetables = async () => {
    try {
      const response = await axios.get('/api/timetable', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTimetables(response.data);
      if (response.data.length > 0 && !selectedTimetable) {
        setSelectedTimetable(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching timetables:', error);
    }
  };

  const isMyClass = (period) => {
    return period && period.teacher && period.teacher._id === user?._id;
  };

  const getStaffName = (teacherId) => {
    if (!teacherId || !teacherId._id) return 'TBA';
    return teacherId.name || 'TBA';
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Timetable</h1>
            <select
              value={selectedTimetable?._id || ''}
              onChange={(e) => {
                const timetable = timetables.find(t => t._id === e.target.value);
                setSelectedTimetable(timetable);
              }}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {timetables.map(timetable => (
                <option key={timetable._id} value={timetable._id}>
                  Class {timetable.class}{timetable.section}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {!selectedTimetable ? (
              <p className="text-gray-500 text-center py-8">Select a class to view timetable</p>
            ) : (
              <div>
                <div className="bg-blue-50 p-4 border-b">
                  <h2 className="text-xl font-bold text-blue-800">
                    Class {selectedTimetable.class}{selectedTimetable.section} - Weekly Schedule
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-3 bg-gray-100 font-semibold">Day</th>
                        {timeSlots.map((time, index) => (
                          <th key={index} className={`border p-3 text-center font-semibold ${
                            time === 'BREAK' || time === 'LUNCH' ? 'bg-yellow-100' : 'bg-gray-100'
                          }`}>
                            {time === 'BREAK' || time === 'LUNCH' ? time : `Period ${index <= 1 ? index + 1 : index <= 4 ? index : index <= 7 ? index - 1 : index - 2}`}
                            <br />
                            <span className="text-xs text-gray-500 font-normal">{time}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {days.map((day) => (
                        <tr key={day} className="hover:bg-gray-50">
                          <td className="border p-3 font-medium bg-blue-50">{day}</td>
                          {timeSlots.map((time, timeIndex) => (
                            <td key={timeIndex} className={`border p-3 text-center ${
                              time === 'BREAK' || time === 'LUNCH' ? 'bg-yellow-50' : ''
                            }`}>
                              {time === 'BREAK' || time === 'LUNCH' ? (
                                <div className="text-yellow-700 font-medium">{time}</div>
                              ) : (
                                <div>
                                  {selectedTimetable.schedule?.[day]?.[timeIndex] ? (
                                    <div className={`p-2 rounded border ${
                                      isMyClass(selectedTimetable.schedule[day][timeIndex])
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-gray-50 border-gray-200'
                                    }`}>
                                      <div className={`font-semibold ${
                                        isMyClass(selectedTimetable.schedule[day][timeIndex])
                                          ? 'text-green-800'
                                          : 'text-gray-700'
                                      }`}>
                                        {selectedTimetable.schedule[day][timeIndex].subject}
                                      </div>
                                      <div className={`text-sm ${
                                        isMyClass(selectedTimetable.schedule[day][timeIndex])
                                          ? 'text-green-600'
                                          : 'text-gray-500'
                                      }`}>
                                        {isMyClass(selectedTimetable.schedule[day][timeIndex])
                                          ? 'My Class'
                                          : getStaffName(selectedTimetable.schedule[day][timeIndex].teacher)
                                        }
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">Free</span>
                                  )}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* My Classes Summary */}
          {selectedTimetable && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">My Classes This Week</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {days.map(day => {
                  const myClasses = selectedTimetable.schedule?.[day]?.filter(period => 
                    period && !period.isBreak && isMyClass(period)
                  ) || [];
                  
                  return (
                    <div key={day} className="bg-white rounded-lg shadow-md p-4">
                      <h4 className="font-bold text-lg mb-3 text-center text-blue-600">{day}</h4>
                      <div className="space-y-2">
                        {myClasses.length > 0 ? (
                          myClasses.map((period, index) => (
                            <div key={index} className="bg-green-50 p-2 rounded text-sm border border-green-200">
                              <div className="font-medium">{period.subject}</div>
                              <div className="text-gray-600">{period.time}</div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-center py-4">No classes</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffTimetable;