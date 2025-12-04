import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, Calendar, FileText, Bell, LogOut, ClipboardList, Award, Menu, X } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { materialAPI } from '../services/api';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [newMaterialsCount, setNewMaterialsCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const adminLinks = [
    { to: '/admin', icon: Home, label: 'Dashboard' },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/staff', icon: Users, label: 'Staff' },
    { to: '/admin/subjects', icon: BookOpen, label: 'Subjects' },
    { to: '/admin/classes', icon: Users, label: 'Classes' },
    { to: '/admin/attendance', icon: ClipboardList, label: 'Student Attendance' },
    { to: '/admin/staff-attendance', icon: ClipboardList, label: 'Staff Attendance' },
    { to: '/admin/marks', icon: Award, label: 'Marks' },
    { to: '/admin/timetable-module', icon: Calendar, label: 'Timetable Module' },
    { to: '/admin/announcements', icon: Bell, label: 'Announcements' }
  ];

  const staffLinks = [
    { to: '/staff', icon: Home, label: 'Dashboard' },
    { to: '/staff/attendance', icon: ClipboardList, label: 'Attendance' },
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen bg-blue-500 text-white overflow-y-auto z-40 transition-all duration-300 ease-in-out
        lg:w-64 lg:translate-x-0
        md:w-64 md:translate-x-0
        w-64 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:block
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold">School ERP</h1>
              <p className="text-sm text-blue-100 mt-1 font-medium">{user?.role?.toUpperCase()}</p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <nav className="mt-6 pb-6">
          {links.map(({ to, icon: Icon, label, hasNotification }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center px-6 py-3 hover:bg-blue-600 hover:bg-opacity-80 transition-all duration-200 relative group ${
                location.pathname === to ? 'bg-blue-600 bg-opacity-90 border-l-4 border-white shadow-lg' : ''
              }`}
              onClick={() => {
                // Clear notification when materials page is visited
                if (to === '/student/materials' && hasNotification) {
                  setNewMaterialsCount(0);
                }
                // Close mobile menu on link click
                setIsMobileMenuOpen(false);
              }}
            >
              <Icon size={20} className="mr-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
              <span className="group-hover:translate-x-1 transition-transform duration-200 truncate">{label}</span>
              {hasNotification && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </Link>
          ))}
          
          <button
            onClick={() => {
              logout();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center px-6 py-3 hover:bg-blue-600 hover:bg-opacity-80 transition-all duration-200 w-full text-left mt-4 group"
          >
            <LogOut size={20} className="mr-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
            <span className="group-hover:translate-x-1 transition-transform duration-200">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
