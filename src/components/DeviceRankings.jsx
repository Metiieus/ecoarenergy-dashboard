import { ExternalLink } from 'lucide-react';
import { deviceRankings } from '../data/mockData';

const DeviceRankings = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Ranking de Dispositivos</h2>
        <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
          View all
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">#</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">DISPOSITIVO</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase pb-3 px-2">MP</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase pb-3 px-2">W</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase pb-3 px-2">D</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase pb-3 px-2">L</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase pb-3 px-2">G</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase pb-3 pl-2">PTS</th>
            </tr>
          </thead>
          <tbody>
            {deviceRankings.map((device, index) => (
              <tr 
                key={device.id} 
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index === 0 ? 'bg-teal-50/50' : ''
                }`}
              >
                <td className="py-4 pr-4">
                  <span className="text-sm font-medium text-gray-700">{device.position}</span>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-lg">
                      {device.icon}
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">{device.name}</span>
                  </div>
                </td>
                <td className="text-center py-4 px-2">
                  <span className="text-sm text-gray-700">{Math.round(device.avgPower / 1000)}</span>
                </td>
                <td className="text-center py-4 px-2">
                  <span className="text-sm text-gray-700">{Math.round(device.consumption / 10000)}</span>
                </td>
                <td className="text-center py-4 px-2">
                  <span className="text-sm text-gray-700">{Math.round(device.efficiency / 10)}</span>
                </td>
                <td className="text-center py-4 px-2">
                  <span className="text-sm text-gray-700">{Math.round(device.savings)}</span>
                </td>
                <td className="text-center py-4 px-2">
                  <span className="text-sm text-gray-700">{Math.round(device.activeTime * 0.4)}</span>
                </td>
                <td className="text-center py-4 pl-2">
                  <span className="text-sm font-bold text-gray-800">{device.score}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceRankings;

