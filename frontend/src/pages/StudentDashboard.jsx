import { useState, useEffect, useContext } from 'react';
import { Award, Calendar, TrendingUp, User } from 'lucide-react';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { dashboardAPI } from '../services/api';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';

const StudentDashboard = () => {
  const [stats, setStats] = useState({});
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('markUpdate', () => fetchStats());
      socket.on('attendanceUpdate', () => fetchStats());
      socket.on('studentUpdate', (data) => {
        if (data.studentId === user?.id) {
          // Refresh user data when admin updates this student's profile
          window.location.reload();
        }
      });
      return () => {
        socket.off('markUpdate');
        socket.off('attendanceUpdate');
        socket.off('studentUpdate');
      };
    }
  }, [socket, user]);

  const fetchStats = () => {
    dashboardAPI.getStudentStats().then(res => setStats(res.data));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <Navbar />
        <div className="p-4 lg:p-6">
          <div className="mb-4 lg:mb-6">
            <h1 className="text-xl lg:text-2xl font-bold">Welcome, {user?.name}!</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm lg:text-base text-gray-600">
              <span className="truncate">Class: {user?.class}</span>
              <span className="truncate">Roll: {user?.rollNumber}</span>
              <span className="truncate">{user?.email}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card title="Attendance" value={`${stats.attendancePercentage || 0}%`} icon={Calendar} color="blue" />
            <Card title="Average Marks" value={`${stats.averageMarks || 0}%`} icon={Award} color="green" />
            <Card title="Total Subjects" value={stats.totalSubjects || 0} icon={TrendingUp} color="purple" />
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <a href="/student/marks" className="p-3 lg:p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition">
                <Award className="mx-auto mb-2" size={24} />
                <p className="font-medium text-sm lg:text-base">My Marks</p>
              </a>
              <a href="/student/attendance" className="p-3 lg:p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition">
                <Calendar className="mx-auto mb-2" size={24} />
                <p className="font-medium text-sm lg:text-base">Attendance</p>
              </a>
              <a href="/student/timetable" className="p-3 lg:p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition">
                <Calendar className="mx-auto mb-2" size={24} />
                <p className="font-medium text-sm lg:text-base">Timetable</p>
              </a>
              <a href="/student/materials" className="p-3 lg:p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition">
                <TrendingUp className="mx-auto mb-2" size={24} />
                <p className="font-medium text-sm lg:text-base">Materials</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
