import { Bell, Search } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Bem-vindo de volta, <span className="text-teal-600 font-semibold">Andres 👋</span></p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Icon */}
          <button className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notification Bell */}
          <button className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">Andres Pinto</p>
              <p className="text-xs text-gray-500">Admin Store</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">AP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
