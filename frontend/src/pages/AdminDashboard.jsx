import { useState, useEffect } from 'react';
import { Users, BookOpen, Calendar } from 'lucide-react';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { dashboardAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    dashboardAPI.getAdminStats().then(res => setStats(res.data));
  }, []);

  const chartData = [
    { name: 'Students', value: stats.totalStudents || 0 },
    { name: 'Staff', value: stats.totalStaff || 0 },
    { name: 'Classes', value: stats.totalClasses || 0 }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <Navbar />
        <div className="p-4 lg:p-6">
          <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card title="Total Students" value={stats.totalStudents || 0} icon={Users} color="blue" />
            <Card title="Total Staff" value={stats.totalStaff || 0} icon={Users} color="green" />
            <Card title="Total Classes" value={stats.totalClasses || 0} icon={BookOpen} color="purple" />
            <Card title="Present Today" value={stats.presentToday || 0} icon={Calendar} color="orange" />
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold mb-4">Overview Statistics</h2>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={250} minWidth={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
