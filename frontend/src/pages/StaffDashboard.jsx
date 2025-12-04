import { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ClipboardList, Award, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const StaffDashboard = () => {
  const { user } = useContext(AuthContext);
  
  const quickActions = [
    { title: 'Mark Attendance', icon: ClipboardList, link: '/staff/attendance', color: 'bg-blue-500' },
    { title: 'Update Marks', icon: Award, link: '/staff/marks', color: 'bg-green-500' },
    { title: 'Upload Materials', icon: FileText, link: '/staff/materials', color: 'bg-purple-500' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <Navbar />
        <div className="p-4 lg:p-6">
          <div className="mb-4 lg:mb-6">
            <h1 className="text-xl lg:text-2xl font-bold">Welcome, {user?.name}!</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm lg:text-base text-gray-600">
              <span className="truncate">ID: {user?.employeeId}</span>
              <span className="truncate">Dept: {user?.department}</span>
              <span className="truncate">{user?.email}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.link}
                className={`${action.color} text-white rounded-lg shadow-lg p-4 lg:p-6 hover:opacity-90 transition-all duration-200 flex flex-col items-center text-center`}
              >
                <action.icon size={32} className="mb-3 lg:mb-4 lg:w-12 lg:h-12" />
                <h3 className="text-lg lg:text-xl font-bold">{action.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
