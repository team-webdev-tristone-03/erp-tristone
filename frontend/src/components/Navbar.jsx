import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User } from 'lucide-react';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Welcome, {user?.name}</h2>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
