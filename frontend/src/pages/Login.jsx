import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login({ email, password, role });
      navigate(`/${user.role}`);
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure backend is running on http://localhost:5000');
      } else {
        setError(err.response?.data?.message || 'Login failed. Check your credentials.');
      }
    }
  };

  const fillDemoCredentials = (demoRole) => {
    const credentials = {
      admin: { email: 'admin@school.com', password: 'admin123' },
      staff: { email: 'staff@school.com', password: 'staff123' },
      student: { email: 'student@school.com', password: 'student123' }
    };
    setRole(demoRole);
    setEmail(credentials[demoRole].email);
    setPassword(credentials[demoRole].password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">School ERP System</h1>
        <p className="text-center text-gray-600 mb-6">Login to your account</p>

        <div className="flex gap-2 mb-6">
          {['admin', 'staff', 'student'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                role === r ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition"
          >
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="font-semibold mb-3 text-sm">Use Demo Credentials:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="flex-1 py-2 px-3 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('staff')}
              className="flex-1 py-2 px-3 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('student')}
              className="flex-1 py-2 px-3 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
            >
              Student
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <p className="font-semibold text-yellow-800 mb-2">⚠️ Getting "Cannot connect" error?</p>
          <p className="text-yellow-700">You need to start the backend server first!</p>
          <p className="text-yellow-700 mt-2">Open terminal and run:</p>
          <code className="block bg-yellow-100 p-2 mt-1 rounded text-yellow-900">cd backend && npm run dev</code>
          <p className="text-yellow-700 mt-2 text-xs">See HOW_TO_FIX.md for detailed instructions</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
