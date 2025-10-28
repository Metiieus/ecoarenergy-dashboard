import { deviceRankings } from '../data/mockData';
import { ChevronRight } from 'lucide-react';

const DeviceList = ({ onSelectDevice }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Dispositivos Principais</h2>
        <p className="text-sm text-gray-600 mt-1">Top dispositivos por consumo e eficiência</p>
      </div>
      
      <div className="space-y-3">
        {deviceRankings.map((device) => (
          <div
            key={device.id}
            onClick={() => onSelectDevice(device.id)}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="text-2xl">{device.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{device.name}</p>
                <p className="text-xs text-gray-600">Consumo: {device.consumption.toLocaleString()} kWh</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-gray-900">{device.score}</p>
                <p className="text-xs text-gray-600">Score</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                <ChevronRight className="w-5 h-5 text-teal-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceList;
