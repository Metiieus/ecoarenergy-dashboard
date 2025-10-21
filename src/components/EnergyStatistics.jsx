import { ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { chartData } from '../data/mockData';

const EnergyStatistics = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Estatísticas de Energia</h2>
        <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
          View all details
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
      
      {/* Chart */}
      <div className="h-32 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" hide />
            <Bar dataKey="value" fill="#4FD1C5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="mb-2 text-left">
        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">PL</span>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500 uppercase mb-1">ECONOMIA</p>
          <p className="text-xl font-bold text-gray-800">{chartData[0].value}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase mb-1">METAS</p>
          <p className="text-xl font-bold text-gray-800">{chartData[1].value}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase mb-1">DESPERDÍCIO</p>
          <p className="text-xl font-bold text-gray-800">{chartData[2].value}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase mb-1">PERDAS</p>
          <p className="text-xl font-bold text-gray-800">{chartData[3].value}</p>
        </div>
      </div>
    </div>
  );
};

export default EnergyStatistics;

