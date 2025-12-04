import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Network error handling
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      error.message = 'Network error. Please check your connection and ensure the backend server is running.';
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me')
};

export const userAPI = {
  getUsers: (params) => API.get('/users', { params }),
  getUser: (id) => API.get(`/users/${id}`),
  createUser: (data) => API.post('/users', data),
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  deleteUser: (id) => API.delete(`/users/${id}`)
};

export const classAPI = {
  getClasses: () => API.get('/classes'),
  createClass: (data) => API.post('/classes', data),
  updateClass: (id, data) => API.put(`/classes/${id}`, data),
  deleteClass: (id) => API.delete(`/classes/${id}`)
};

export const subjectAPI = {
  getSubjects: () => API.get('/subjects'),
  createSubject: (data) => API.post('/subjects', data),
  updateSubject: (id, data) => API.put(`/subjects/${id}`, data),
  deleteSubject: (id) => API.delete(`/subjects/${id}`)
};

export const attendanceAPI = {
  getAttendance: (params) => API.get('/attendance', { params }),
  createAttendance: (data) => API.post('/attendance', data),
  updateAttendance: (id, data) => API.put(`/attendance/${id}`, data),
  deleteAttendance: (id) => API.delete(`/attendance/${id}`),
  markBulkAttendance: (data) => API.post('/attendance/bulk', data)
};

export const staffAttendanceAPI = {
  getStaffAttendance: (params) => API.get('/staff-attendance', { params }),
  createStaffAttendance: (data) => API.post('/staff-attendance', data),
  updateStaffAttendance: (id, data) => API.put(`/staff-attendance/${id}`, data),
  deleteStaffAttendance: (id) => API.delete(`/staff-attendance/${id}`)
};

export const markAPI = {
  getMarks: (params) => API.get('/marks', { params }),
  createMark: (data) => API.post('/marks', data),
  updateMark: (id, data) => API.put(`/marks/${id}`, data),
  deleteMark: (id) => API.delete(`/marks/${id}`)
};

export const materialAPI = {
  getMaterials: (params) => API.get('/materials', { params }),
  createMaterial: (data) => API.post('/materials', data),
  deleteMaterial: (id) => API.delete(`/materials/${id}`),
  getNewMaterialsCount: (params) => API.get('/materials/new-count', { params })
};

export const announcementAPI = {
  getAnnouncements: (params) => API.get('/announcements', { params }),
  createAnnouncement: (data) => API.post('/announcements', data),
  deleteAnnouncement: (id) => API.delete(`/announcements/${id}`)
};

export const timetableAPI = {
  getTimetable: (params) => API.get('/timetable', { params }),
  createTimetable: (data) => API.post('/timetable', data),
  updateTimetable: (id, data) => API.put(`/timetable/${id}`, data)
};

export const dashboardAPI = {
  getAdminStats: () => API.get('/dashboard/admin'),
  getStudentStats: () => API.get('/dashboard/student')
};

export default API;