import { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { timetableAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    timetableAPI.getTimetable({ class: user.class, section: user.section })
      .then(res => setTimetable(res.data));
  }, [user]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">My Timetable</h1>
          <div className="grid gap-4">
            {timetable.map((day, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">{day.day}</h3>
                <div className="grid gap-3">
                  {day.periods?.map((period, pIdx) => (
                    <div key={pIdx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-medium">{period.time}</span>
                      <span>{period.subject?.name || 'N/A'}</span>
                      <span className="text-gray-600">{period.teacher?.name || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTimetable;
