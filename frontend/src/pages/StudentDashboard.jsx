import { useState, useEffect, useContext } from 'react';
import { Award, Calendar, TrendingUp } from 'lucide-react';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { dashboardAPI } from '../services/api';
import { SocketContext } from '../context/SocketContext';

const StudentDashboard = () => {
  const [stats, setStats] = useState({});
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('markUpdate', () => fetchStats());
      socket.on('attendanceUpdate', () => fetchStats());
      return () => {
        socket.off('markUpdate');
        socket.off('attendanceUpdate');
      };
    }
  }, [socket]);

  const fetchStats = () => {
    dashboardAPI.getStudentStats().then(res => setStats(res.data));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card title="Attendance" value={`${stats.attendancePercentage || 0}%`} icon={Calendar} color="blue" />
            <Card title="Average Marks" value={`${stats.averageMarks || 0}%`} icon={Award} color="green" />
            <Card title="Total Subjects" value={stats.totalSubjects || 0} icon={TrendingUp} color="purple" />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/student/marks" className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition">
                <Award className="mx-auto mb-2" size={32} />
                <p className="font-medium">My Marks</p>
              </a>
              <a href="/student/attendance" className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition">
                <Calendar className="mx-auto mb-2" size={32} />
                <p className="font-medium">Attendance</p>
              </a>
              <a href="/student/timetable" className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition">
                <Calendar className="mx-auto mb-2" size={32} />
                <p className="font-medium">Timetable</p>
              </a>
              <a href="/student/materials" className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition">
                <TrendingUp className="mx-auto mb-2" size={32} />
                <p className="font-medium">Materials</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
