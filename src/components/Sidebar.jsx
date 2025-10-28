import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

const Sidebar = ({ activeTab = 'dashboard', setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', tooltip: 'Visualize métricas e gráficos de energia' },
    { id: 'consumption', icon: BarChart3, label: 'Consumo', tooltip: 'Analise o consumo detalhado dos dispositivos' },
    { id: 'control', icon: Settings, label: 'Central de Controle', tooltip: 'Controle os dispositivos em tempo real' }
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-teal-500 to-teal-600 text-white flex flex-col fixed left-0 top-0 shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-teal-400/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-lg font-bold">E</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Ecoar</h1>
            <p className="text-xs text-teal-100">Energy</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
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
            <p className="text-sm font-semibold truncate">Ecoar Energy</p>
            <p className="text-xs text-teal-100">Sistema v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
