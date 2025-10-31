import { deviceRankings } from '../data/mockData';
import { ChevronRight, TrendingUp, Zap } from 'lucide-react';

const AllDevices = ({ onSelectDevice }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Todos os Dispositivos</h2>
        <p className="text-gray-600">Clique em um dispositivo para visualizar seus dados em detalhes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deviceRankings.map((device) => (
          <div
            key={device.id}
            onClick={() => onSelectDevice(device.id)}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{device.icon}</div>
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-teal-600" />
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 text-lg mb-4">{device.name}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Consumo</span>
                </div>
                <p className="font-semibold text-gray-900">{device.consumption.toLocaleString()} kWh</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Eficiência</span>
                </div>
                <p className="font-semibold text-gray-900">{device.efficiency}%</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Score: </span>
                <p className="text-lg font-bold text-teal-600">{device.score}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllDevices;
