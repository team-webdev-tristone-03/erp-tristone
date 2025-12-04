import { useState, useEffect, useContext } from 'react';
import { Award, TrendingUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

const StudentMarks = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (user?._id) {
      fetchMarks();
    }
  }, [user]);

  useEffect(() => {
    if (socket && user?._id) {
      socket.on('markUpdate', (updatedMark) => {
        if (updatedMark.student === user._id) {
          fetchMarks();
        }
      });
      return () => socket.off('markUpdate');
    }
  }, [socket, user]);

  const fetchMarks = async () => {
    try {
      const response = await axios.get(`/api/marks?student=${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMarks(response.data || []);
    } catch (error) {
      console.error('Error:', error);
      setMarks([]);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800';
      case 'A': return 'bg-green-100 text-green-700';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateStats = () => {
    if (marks.length === 0) return { average: 0, highest: 0, lowest: 0 };
    
    const percentages = marks.map(mark => (mark.marks / mark.totalMarks) * 100);
    const average = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);
    
    return { average: average.toFixed(2), highest: highest.toFixed(2), lowest: lowest.toFixed(2) };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-6">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">My Marks - Class {user?.class}{user?.section}</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-blue-500" size={24} />
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.average}%</div>
                  <div className="text-sm text-gray-600">Average</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <Award className="text-green-500" size={24} />
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.highest}%</div>
                  <div className="text-sm text-gray-600">Highest</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <Award className="text-red-500" size={24} />
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.lowest}%</div>
                  <div className="text-sm text-gray-600">Lowest</div>
                </div>
              </div>
            </div>
          </div>

          {/* Marks Table */}
          <div className="bg-white rounded-lg shadow-md">
            {marks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Award size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No marks available yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Subject</th>
                      <th className="px-4 py-3 text-left font-semibold">Exam Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Marks</th>
                      <th className="px-4 py-3 text-left font-semibold">Percentage</th>
                      <th className="px-4 py-3 text-left font-semibold">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((mark) => (
                      <tr key={mark._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{mark.subject?.name || 'Subject'}</td>
                        <td className="px-4 py-3">{mark.examType}</td>
                        <td className="px-4 py-3">
                          <span className="font-semibold">{mark.marks}</span>
                          <span className="text-gray-500">/{mark.totalMarks}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${(mark.marks / mark.totalMarks) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {((mark.marks / mark.totalMarks) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(mark.grade)}`}>
                            {mark.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMarks;