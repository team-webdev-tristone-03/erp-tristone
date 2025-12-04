import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User } from 'lucide-react';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white shadow-md px-4 lg:px-6 py-4 flex justify-between items-center">
      <h2 className="text-lg lg:text-xl font-semibold text-gray-800 truncate">
        <span className="hidden sm:inline">Welcome, </span>
        <span className="sm:hidden">Hi, </span>
        {user?.name}
      </h2>
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium truncate max-w-32 lg:max-w-none">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate max-w-32 lg:max-w-none">{user?.email}</p>
        </div>
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-white lg:w-5 lg:h-5" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
