import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, Calendar, FileText, Bell, LogOut, ClipboardList, Award } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const adminLinks = [
    { to: '/admin', icon: Home, label: 'Dashboard' },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/staff', icon: Users, label: 'Staff' },
    { to: '/admin/subjects', icon: BookOpen, label: 'Subjects' },
    { to: '/admin/attendance', icon: ClipboardList, label: 'Attendance' },
    { to: '/admin/marks', icon: Award, label: 'Marks' },
    { to: '/admin/announcements', icon: Bell, label: 'Announcements' }
  ];

  const staffLinks = [
    { to: '/staff', icon: Home, label: 'Dashboard' },
    { to: '/staff/attendance', icon: ClipboardList, label: 'Attendance' },
    { to: '/staff/marks', icon: Award, label: 'Marks' },
    { to: '/staff/materials', icon: FileText, label: 'Materials' }
  ];

  const studentLinks = [
    { to: '/student', icon: Home, label: 'Dashboard' },
    { to: '/student/marks', icon: Award, label: 'My Marks' },
    { to: '/student/attendance', icon: ClipboardList, label: 'My Attendance' },
    { to: '/student/timetable', icon: Calendar, label: 'Timetable' },
    { to: '/student/materials', icon: FileText, label: 'Materials' },
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
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center px-6 py-3 hover:bg-gray-800 transition ${
              location.pathname === to ? 'bg-gray-800 border-l-4 border-blue-500' : ''
            }`}
          >
            <Icon size={20} className="mr-3" />
            <span>{label}</span>
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
