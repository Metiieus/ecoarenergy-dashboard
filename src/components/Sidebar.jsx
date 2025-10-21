import { LayoutDashboard, Cpu, BarChart3, Calendar, DollarSign, ArrowLeftRight, FileText } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Cpu, label: 'Dispositivos', active: false },
    { icon: BarChart3, label: 'Estatísticas', active: false },
    { icon: Calendar, label: 'Calendário', active: false },
    { icon: DollarSign, label: 'Finanças', active: false },
    { icon: ArrowLeftRight, label: 'Transferências', active: false },
    { icon: FileText, label: 'Relatórios', active: false }
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-teal-500 to-teal-600 text-white flex flex-col fixed left-0 top-0 shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-teal-400/30">
        <h1 className="text-2xl font-bold tracking-tight">EcoarPro</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              item.active
                ? 'bg-white/20 shadow-lg backdrop-blur-sm'
                : 'hover:bg-white/10'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-teal-400/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm font-bold">EA</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">EcoarEnergy</p>
            <p className="text-xs text-teal-100">Sistema v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

