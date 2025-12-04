import { useState, useEffect, useContext } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:8000';

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState(null);
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '9:00-9:45', '9:45-10:30', 'BREAK', '10:45-11:30', '11:30-12:15', 
    'LUNCH', '1:00-1:45', '1:45-2:30', 'BREAK', '2:45-3:30'
  ];

  useEffect(() => {
    if (user?.class) {
      fetchTimetable();
    }
  }, [user]);

  // Socket.IO real-time updates
  useEffect(() => {
    if (socket && user?.class) {
      socket.on('timetableUpdate', (data) => {
        console.log('Student timetable update received:', data);
        // Check if the update is for this student's class
        if (data.data.class === user.class && data.data.section === user.section) {
          fetchTimetable(); // Refresh the timetable
        }
      });

      return () => {
        socket.off('timetableUpdate');
      };
    }
  }, [socket, user?.class, user?.section]);

  const fetchTimetable = async () => {
    try {
      const response = await axios.get(`/api/timetable?class=${user.class}&section=${user.section}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.data && response.data.length > 0) {
        setTimetable(response.data[0]); // Get the first timetable for the class
      } else {
        setTimetable(null);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setTimetable(null);
    }
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
          <h1 className="text-2xl font-bold mb-6">My Timetable - Class {user?.class}{user?.section}</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {!timetable ? (
              <p className="text-gray-500 text-center py-8">No timetable available for your class</p>
            ) : (
              <div>
                <div className="bg-blue-50 p-4 border-b">
                  <h2 className="text-xl font-bold text-blue-800">
                    Weekly Schedule - Class {timetable.class}{timetable.section}
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
                                  {timetable.schedule?.[day]?.[timeIndex] && timetable.schedule[day][timeIndex].subject ? (
                                    <div className="bg-blue-50 p-2 rounded border border-blue-200">
                                      <div className="font-semibold text-blue-800">
                                        {timetable.schedule[day][timeIndex].subject}
                                      </div>
                                      <div className="text-sm text-blue-600">
                                        {getStaffName(timetable.schedule[day][timeIndex].teacher)}
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

          {/* Daily Schedule Summary */}
          {timetable && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">Daily Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {days.map(day => {
                  const dayClasses = timetable.schedule?.[day]?.filter(period => 
                    period && period.subject && period.subject !== 'BREAK' && period.subject !== 'LUNCH'
                  ) || [];
                  
                  return (
                    <div key={day} className="bg-white rounded-lg shadow-md p-4">
                      <h4 className="font-bold text-lg mb-3 text-center text-blue-600">{day}</h4>
                      <div className="space-y-2">
                        {dayClasses.length > 0 ? (
                          dayClasses.map((period, index) => (
                            <div key={index} className="bg-blue-50 p-2 rounded text-sm border border-blue-200">
                              <div className="font-medium">{period.subject}</div>
                              <div className="text-gray-600">{getStaffName(period.teacher)}</div>
                              <div className="text-xs text-gray-500">{period.time}</div>
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

export default StudentTimetable;