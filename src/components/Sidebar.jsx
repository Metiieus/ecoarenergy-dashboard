import { LayoutDashboard, BarChart3, FileText } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: BarChart3, label: 'Consumo', active: false },
    { icon: FileText, label: 'Relatórios', active: false }
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-teal-500 to-teal-600 text-white flex flex-col fixed left-0 top-0 shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-teal-400/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-lg font-bold">E</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">EcoarPro</h1>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              item.active
                ? 'bg-white/25 shadow-lg backdrop-blur-sm'
                : 'text-teal-100 hover:bg-white/15'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-teal-400/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/25 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold">EA</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">EcoarEnergy</p>
            <p className="text-xs text-teal-100">v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
