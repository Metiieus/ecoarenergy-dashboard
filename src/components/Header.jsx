import { Bell, Search } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Welcome back, <span className="text-teal-600 font-semibold">Andres 👋</span></p>
          <h1 className="text-3xl font-bold text-gray-800 mt-1">Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search Icon */}
          <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Notification Bell */}
          <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center gap-3 ml-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AP</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">Andres Pinto</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

