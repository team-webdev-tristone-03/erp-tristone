import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ClipboardList, Award, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
  const quickActions = [
    { title: 'Mark Attendance', icon: ClipboardList, link: '/staff/attendance', color: 'bg-blue-500' },
    { title: 'Update Marks', icon: Award, link: '/staff/marks', color: 'bg-green-500' },
    { title: 'Upload Materials', icon: FileText, link: '/staff/materials', color: 'bg-purple-500' }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.link}
                className={`${action.color} text-white rounded-lg shadow-lg p-6 hover:opacity-90 transition`}
              >
                <action.icon size={48} className="mb-4" />
                <h3 className="text-xl font-bold">{action.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
