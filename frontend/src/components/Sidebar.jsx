import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, Calendar, FileText, Bell, LogOut, ClipboardList, Award } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { materialAPI } from '../services/api';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [newMaterialsCount, setNewMaterialsCount] = useState(0);

  const adminLinks = [
    { to: '/admin', icon: Home, label: 'Dashboard' },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/staff', icon: Users, label: 'Staff' },
    { to: '/admin/subjects', icon: BookOpen, label: 'Subjects' },
    { to: '/admin/attendance', icon: ClipboardList, label: 'Student Attendance' },
    { to: '/admin/staff-attendance', icon: ClipboardList, label: 'Staff Attendance' },
    { to: '/admin/classes', icon: Users, label: 'Classes' },
    { to: '/admin/attendance', icon: ClipboardList, label: 'Attendance' },
    { to: '/admin/marks', icon: Award, label: 'Marks' },
    { to: '/admin/timetable-module', icon: Calendar, label: 'Timetable Module' },
    { to: '/admin/announcements', icon: Bell, label: 'Announcements' }
  ];

  const staffLinks = [
    { to: '/staff', icon: Home, label: 'Dashboard' },
    { to: '/staff/attendance', icon: ClipboardList, label: 'Student Attendance' },
    { to: '/staff/marks', icon: Award, label: 'Marks' },
    { to: '/staff/materials', icon: FileText, label: 'Materials' },
    { to: '/staff/announcements', icon: Bell, label: 'Announcements' },
    { to: '/staff/timetable', icon: Calendar, label: 'My Timetable' }
  ];

  // Fetch new materials count for students
  useEffect(() => {
    if (user?.role === 'student' && user?.class && user?.section) {
      fetchNewMaterialsCount();
      
      // Check every 30 seconds for new materials
      const interval = setInterval(fetchNewMaterialsCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNewMaterialsCount = async () => {
    try {
      const response = await materialAPI.getNewMaterialsCount({
        class: user.class,
        section: user.section
      });
      setNewMaterialsCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch new materials count:', error);
    }
  };

  const studentLinks = [
    { to: '/student', icon: Home, label: 'Dashboard' },
    { to: '/student/marks', icon: Award, label: 'My Marks' },
    { to: '/student/attendance', icon: ClipboardList, label: 'My Attendance' },
    { to: '/student/timetable', icon: Calendar, label: 'Timetable' },
    { to: '/student/materials', icon: FileText, label: 'Materials', hasNotification: newMaterialsCount > 0 },
    { to: '/student/announcements', icon: Bell, label: 'Announcements' }
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'staff' ? staffLinks : studentLinks;

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold">School ERP</h1>
        <p className="text-sm text-gray-400 mt-1">{user?.role?.toUpperCase()}</p>
      </div>
      
      <nav className="mt-6">
        {links.map(({ to, icon: Icon, label, hasNotification }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center px-6 py-3 hover:bg-gray-800 transition relative ${
              location.pathname === to ? 'bg-gray-800 border-l-4 border-blue-500' : ''
            }`}
            onClick={() => {
              // Clear notification when materials page is visited
              if (to === '/student/materials' && hasNotification) {
                setNewMaterialsCount(0);
              }
            }}
          >
            <Icon size={20} className="mr-3" />
            <span>{label}</span>
            {hasNotification && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </Link>
        ))}
        
        <button
          onClick={logout}
          className="flex items-center px-6 py-3 hover:bg-gray-800 transition w-full text-left mt-4"
        >
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
