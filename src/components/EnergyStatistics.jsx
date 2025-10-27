import { ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { chartData } from '../data/mockData';

const EnergyStatistics = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Estatísticas de Energia</h2>
        <button className="text-teal-600 hover:text-teal-700 text-xs font-semibold flex items-center gap-1 transition-colors">
          Ver detalhes
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Chart */}
      <div className="h-40 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" hide />
            <Bar dataKey="value" fill="#14B8A6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-50 to-teal-50 rounded-lg p-4 border border-teal-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Economia</p>
          <p className="text-2xl font-bold text-teal-700">{chartData[0].value}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Metas</p>
          <p className="text-2xl font-bold text-blue-700">{chartData[1].value}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-50 rounded-lg p-4 border border-yellow-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Desperdício</p>
          <p className="text-2xl font-bold text-yellow-700">{chartData[2].value}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-50 rounded-lg p-4 border border-red-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Perdas</p>
          <p className="text-2xl font-bold text-red-700">{chartData[3].value}</p>
        </div>
      </div>
    </div>
  );
};

export default EnergyStatistics;
