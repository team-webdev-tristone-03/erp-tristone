import { useState, useEffect } from 'react';
import { Calendar, Users, Check, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { staffAttendanceAPI, userAPI } from '../services/api';

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
      const res = await staffAttendanceAPI.getStaffAttendance({ 
        date: selectedDate
      });
      
      const attendanceMap = {};
      const recordMap = {};
      res.data.forEach(record => {
        const staffId = record.staff._id || record.staff;
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
      console.log('Marking attendance for staff:', staffId, 'status:', status);
      console.log('Existing records:', attendanceRecords);
      
      if (attendanceRecords[staffId]) {
        console.log('Updating existing record:', attendanceRecords[staffId]);
        const result = await staffAttendanceAPI.updateStaffAttendance(attendanceRecords[staffId], { status });
        console.log('Update result:', result);
      } else {
        console.log('Creating new record');
        const staffMember = staff.find(s => s._id === staffId);
        const newRecord = await staffAttendanceAPI.createStaffAttendance({
          staff: staffId,
          staffName: staffMember?.name,
          staffEmail: staffMember?.email,
          staffSubject: staffMember?.subject,
          date: selectedDate,
          status: status
        });
        console.log('Create result:', newRecord);
        setAttendanceRecords(prev => ({ ...prev, [staffId]: newRecord.data._id }));
      }
      
      setAttendance(prev => ({ ...prev, [staffId]: status }));
      console.log('Attendance updated successfully');
    } catch (error) {
      alert('Error marking attendance: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="text-blue-600" />
              Staff Attendance
            </h1>
          </div>

          {/* Date Selection */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center gap-4">
              <Calendar className="text-gray-500" />
              <label className="font-medium">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Staff Attendance Grid */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                Staff Attendance for {new Date(selectedDate).toLocaleDateString()}
              </h2>
            </div>
            
            <div className="p-4">
              {staff.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No staff members found
                </div>
              ) : (
                <div className="grid gap-4">
                  {staff.map(member => (
                    <div key={member._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <p className="text-sm text-gray-500">Subject: {member.subject || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {(() => {
                          const today = new Date().toISOString().split('T')[0];
                          const isPastDate = selectedDate < today;
                          
                          if (isPastDate) {
                            return (
                              <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600">
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
                            <>
                              <button
                                onClick={() => markAttendance(member._id, 'present')}
                                disabled={loading}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
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
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                  attendance[member._id] === 'absent'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                                }`}
                              >
                                <X size={16} />
                                Absent
                              </button>
                            </>
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
      </div>
    </div>
  );
};

export default AdminStaffAttendance;