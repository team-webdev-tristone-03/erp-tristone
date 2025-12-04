import { useState, useEffect, useContext } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.class) {
      fetchTimetable();
    }
  }, [user]);

  const fetchTimetable = async () => {
    // Temporary hardcoded timetable structure for demo
    const defaultTimetable = {
      class: user.class,
      section: 'A',
      schedule: {
        Monday: [
          { period: 1, time: '9:00-9:45', subject: 'Tamil', teacher: { name: 'Rajesh Sharma' } },
          { period: 2, time: '9:45-10:30', subject: 'English', teacher: { name: 'Amit Singh' } },
          { period: 3, time: '10:45-11:30', subject: 'Math', teacher: { name: 'Vikram Kumar' } },
          { period: 4, time: '11:30-12:15', subject: 'Science', teacher: { name: 'Suresh Reddy' } },
          { period: 5, time: '1:00-1:45', subject: 'Social', teacher: { name: 'Ravi Iyer' } },
          { period: 6, time: '1:45-2:30', subject: 'Tamil', teacher: { name: 'Rajesh Sharma' } },
          { period: 7, time: '2:30-3:15', subject: 'English', teacher: { name: 'Amit Singh' } },
          { period: 8, time: '3:15-4:00', subject: 'Math', teacher: { name: 'Vikram Kumar' } }
        ],
        Tuesday: [
          { period: 1, time: '9:00-9:45', subject: 'Tamil', teacher: { name: 'Rajesh Sharma' } },
          { period: 2, time: '9:45-10:30', subject: 'English', teacher: { name: 'Amit Singh' } },
          { period: 3, time: '10:45-11:30', subject: 'Math', teacher: { name: 'Vikram Kumar' } },
          { period: 4, time: '11:30-12:15', subject: 'Science', teacher: { name: 'Suresh Reddy' } },
          { period: 5, time: '1:00-1:45', subject: 'Social', teacher: { name: 'Ravi Iyer' } },
          { period: 6, time: '1:45-2:30', subject: 'Tamil', teacher: { name: 'Rajesh Sharma' } },
          { period: 7, time: '2:30-3:15', subject: 'English', teacher: { name: 'Amit Singh' } },
          { period: 8, time: '3:15-4:00', subject: 'Math', teacher: { name: 'Vikram Kumar' } }
        ],
        Wednesday: [
          { period: 1, time: '9:00-9:45', subject: 'Tamil', teacher: { name: 'Rajesh Sharma' } },
          { period: 2, time: '9:45-10:30', subject: 'English', teacher: { name: 'Amit Singh' } },
          { period: 3, time: '10:45-11:30', subject: 'Math', teacher: { name: 'Vikram Kumar' } },
          { period: 4, time: '11:30-12:15', subject: 'Science', teacher: { name: 'Suresh Reddy' } },
          { period: 5, time: '1:00-1:45', subject: 'Social', teacher: { name: 'Ravi Iyer' } },
          { period: 6, time: '1:45-2:30', subject: 'Tamil', teacher: { name: 'Rajesh Sharma' } },
          { period: 7, time: '2:30-3:15', subject: 'English', teacher: { name: 'Amit Singh' } },
          { period: 8, time: '3:15-4:00', subject: 'Math', teacher: { name: 'Vikram Kumar' } }
        ],
        Thursday: [
          { period: 1, time: '9:00-9:45', subject: 'Tamil', teacher: { name: 'Rajesh Sharma' } },
          { period: 2, time: '9:45-10:30', subject: 'English', teacher: { name: 'Amit Singh' } },
          { period: 3, time: '10:45-11:30', subject: 'Math', teacher: { name: 'Vikram Kumar' } },
          { period: 4, time: '11:30-12:15', subject: 'Science', teacher: { name: 'Suresh Reddy' } },
          { period: 5, time: '1:00-1:45', subject: 'Social', teacher: { name: 'Ravi Iyer' } },
          { period: 6, time: '1:45-2:30', subject: 'Tamil', teacher: { name: 'Rajesh Sharma' } },
          { period: 7, time: '2:30-3:15', subject: 'English', teacher: { name: 'Amit Singh' } },
          { period: 8, time: '3:15-4:00', subject: 'Math', teacher: { name: 'Vikram Kumar' } }
        ],
        Friday: [
          { period: 1, time: '9:00-9:45', subject: 'Tamil', teacher: { name: 'Rajesh Sharma' } },
          { period: 2, time: '9:45-10:30', subject: 'English', teacher: { name: 'Amit Singh' } },
          { period: 3, time: '10:45-11:30', subject: 'Math', teacher: { name: 'Vikram Kumar' } },
          { period: 4, time: '11:30-12:15', subject: 'Science', teacher: { name: 'Suresh Reddy' } },
          { period: 5, time: '1:00-1:45', subject: 'Social', teacher: { name: 'Ravi Iyer' } },
          { period: 6, time: '1:45-2:30', subject: 'Tamil', teacher: { name: 'Rajesh Sharma' } },
          { period: 7, time: '2:30-3:15', subject: 'English', teacher: { name: 'Amit Singh' } },
          { period: 8, time: '3:15-4:00', subject: 'Math', teacher: { name: 'Vikram Kumar' } }
        ]
      }
    };
    setTimetable(defaultTimetable);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">My Timetable - Class {user?.class}</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {!timetable ? (
              <p className="text-gray-500 text-center py-8">No timetable available for your class</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Time</th>
                      {days.map(day => (
                        <th key={day} className="px-4 py-3 text-center font-semibold">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map(periodIndex => (
                      <tr key={periodIndex} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            Period {periodIndex + 1}
                          </div>
                        </td>
                        {days.map(day => {
                          const period = timetable.schedule[day][periodIndex];
                          return (
                            <td key={day} className="px-4 py-3 text-center">
                              {period ? (
                                <div className="bg-blue-50 p-2 rounded">
                                  <div className="font-semibold text-blue-800">{period.subject}</div>
                                  <div className="text-sm text-blue-600">{period.teacher?.name}</div>
                                  <div className="text-xs text-gray-500">{period.time}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          );
                        })}
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

export default StudentTimetable;