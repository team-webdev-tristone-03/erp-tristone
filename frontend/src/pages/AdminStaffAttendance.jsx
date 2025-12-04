import { useState, useEffect } from 'react';
import { Calendar, Users, Check, X } from 'lucide-react';
import Layout from '../components/Layout';
import { attendanceAPI, userAPI } from '../services/api';

const AdminStaffAttendance = () => {
  const [staff, setStaff] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
    fetchAttendance();
  }, [selectedDate]);

  const fetchStaff = async () => {
    try {
      const res = await userAPI.getUsers({ role: 'staff' });
      setStaff(res.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await attendanceAPI.getAttendance({ 
        date: selectedDate,
        role: 'staff'
      });
      
      const attendanceMap = {};
      const recordMap = {};
      res.data.forEach(record => {
        const staffId = record.student._id || record.student;
        attendanceMap[staffId] = record.status;
        recordMap[staffId] = record._id;
      });
      setAttendance(attendanceMap);
      setAttendanceRecords(recordMap);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const markAttendance = async (staffId, status) => {
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate < today) {
      alert('Cannot edit attendance for previous days');
      return;
    }
    
    setLoading(true);
    try {
      if (attendanceRecords[staffId]) {
        await attendanceAPI.updateAttendance(attendanceRecords[staffId], { status });
      } else {
        const newRecord = await attendanceAPI.createAttendance({
          student: staffId,
          date: selectedDate,
          status: status
        });
        setAttendanceRecords(prev => ({ ...prev, [staffId]: newRecord.data._id }));
      }
      
      setAttendance(prev => ({ ...prev, [staffId]: status }));
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Error marking attendance: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
              <Users className="text-blue-600" />
              Staff Attendance Management
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">Mark and manage staff attendance for the selected date</p>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Calendar className="text-gray-500" />
              <label className="font-medium text-sm lg:text-base">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 lg:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
              />
            </div>
            <div className="text-sm text-gray-600">
              Total Staff: <span className="font-semibold">{staff.length}</span>
            </div>
          </div>
        </div>

        {/* Staff Attendance Grid */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                Staff Attendance for {new Date(selectedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Present: {Object.values(attendance).filter(status => status === 'present').length}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Absent: {Object.values(attendance).filter(status => status === 'absent').length}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            {staff.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No staff members found
              </div>
            ) : (
              <div className="grid gap-4">
                {staff.map(member => (
                  <div key={member._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <p className="text-sm text-gray-500">Phone: {member.phone || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {(() => {
                        const today = new Date().toISOString().split('T')[0];
                        const isPastDate = selectedDate < today;
                        
                        if (isPastDate) {
                          return (
                            <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 w-full sm:w-auto text-center">
                              {attendance[member._id] ? (
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                  attendance[member._id] === 'present' ? 'bg-green-100 text-green-800' :
                                  attendance[member._id] === 'absent' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {attendance[member._id].charAt(0).toUpperCase() + attendance[member._id].slice(1)}
                                </span>
                              ) : (
                                <span className="text-gray-500">Not Marked</span>
                              )}
                            </div>
                          );
                        }
                        
                        return (
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => markAttendance(member._id, 'present')}
                              disabled={loading}
                              className={`flex-1 sm:flex-none px-3 lg:px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm lg:text-base ${
                                attendance[member._id] === 'present'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                              }`}
                            >
                              <Check size={16} />
                              Present
                            </button>
                            <button
                              onClick={() => markAttendance(member._id, 'absent')}
                              disabled={loading}
                              className={`flex-1 sm:flex-none px-3 lg:px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm lg:text-base ${
                                attendance[member._id] === 'absent'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                              }`}
                            >
                              <X size={16} />
                              Absent
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminStaffAttendance;