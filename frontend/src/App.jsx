import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminStaff from './pages/AdminStaff';
import AdminSubjects from './pages/AdminSubjects';
import AdminStudentAttendance from './pages/AdminStudentAttendance';
import AdminStaffAttendance from './pages/AdminStaffAttendance';
import AdminClasses from './pages/AdminClasses';
import AdminAttendance from './pages/AdminAttendance';
import AdminMarks from './pages/AdminMarks';
import AdminAnnouncements from './pages/AdminAnnouncements';
import StaffDashboard from './pages/StaffDashboard';
import StaffMarks from './pages/StaffMarks';
import StaffStudentAttendance from './pages/StaffStudentAttendance';
import StaffMaterials from './pages/StaffMaterials';
import StaffAnnouncements from './pages/StaffAnnouncements';
import StudentDashboard from './pages/StudentDashboard';
import StudentMarks from './pages/StudentMarks';
import StudentAttendance from './pages/StudentAttendance';
import StudentMaterials from './pages/StudentMaterials';
import StudentTimetable from './pages/StudentTimetable';
import StudentAnnouncements from './pages/StudentAnnouncements';
import AdminTimetable from './pages/AdminTimetable';
import AdminStudentTimetable from './pages/AdminStudentTimetable';
import AdminStaffTimetable from './pages/AdminStaffTimetable';
import StaffTimetable from './pages/StaffTimetable';
import TimetableModule from './pages/TimetableModule';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={`/${user.role}`} />;
  
  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <Login />} />
        
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><AdminStudents /></ProtectedRoute>} />
        <Route path="/admin/staff" element={<ProtectedRoute allowedRoles={['admin']}><AdminStaff /></ProtectedRoute>} />
        <Route path="/admin/subjects" element={<ProtectedRoute allowedRoles={['admin']}><AdminSubjects /></ProtectedRoute>} />
        <Route path="/admin/attendance" element={<ProtectedRoute allowedRoles={['admin']}><AdminStudentAttendance /></ProtectedRoute>} />
        <Route path="/admin/staff-attendance" element={<ProtectedRoute allowedRoles={['admin']}><AdminStaffAttendance /></ProtectedRoute>} />
        <Route path="/admin/classes" element={<ProtectedRoute allowedRoles={['admin']}><AdminClasses /></ProtectedRoute>} />
        <Route path="/admin/attendance" element={<ProtectedRoute allowedRoles={['admin']}><AdminAttendance /></ProtectedRoute>} />
        <Route path="/admin/marks" element={<ProtectedRoute allowedRoles={['admin']}><AdminMarks /></ProtectedRoute>} />
        <Route path="/admin/announcements" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnnouncements /></ProtectedRoute>} />
        <Route path="/admin/student-timetable" element={<ProtectedRoute allowedRoles={['admin']}><AdminStudentTimetable /></ProtectedRoute>} />
        <Route path="/admin/staff-timetable" element={<ProtectedRoute allowedRoles={['admin']}><AdminStaffTimetable /></ProtectedRoute>} />
        <Route path="/admin/timetable-module" element={<ProtectedRoute allowedRoles={['admin']}><TimetableModule /></ProtectedRoute>} />
        
        <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
        <Route path="/staff/marks" element={<ProtectedRoute allowedRoles={['staff']}><StaffMarks /></ProtectedRoute>} />
        <Route path="/staff/attendance" element={<ProtectedRoute allowedRoles={['staff']}><StaffStudentAttendance /></ProtectedRoute>} />
        <Route path="/staff/materials" element={<ProtectedRoute allowedRoles={['staff']}><StaffMaterials /></ProtectedRoute>} />
        <Route path="/staff/announcements" element={<ProtectedRoute allowedRoles={['staff']}><StaffAnnouncements /></ProtectedRoute>} />
        <Route path="/staff/timetable" element={<ProtectedRoute allowedRoles={['staff']}><StaffTimetable /></ProtectedRoute>} />
        
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/marks" element={<ProtectedRoute allowedRoles={['student']}><StudentMarks /></ProtectedRoute>} />
        <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={['student']}><StudentAttendance /></ProtectedRoute>} />
        <Route path="/student/materials" element={<ProtectedRoute allowedRoles={['student']}><StudentMaterials /></ProtectedRoute>} />
        <Route path="/student/timetable" element={<ProtectedRoute allowedRoles={['student']}><StudentTimetable /></ProtectedRoute>} />
        <Route path="/student/announcements" element={<ProtectedRoute allowedRoles={['student']}><StudentAnnouncements /></ProtectedRoute>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
