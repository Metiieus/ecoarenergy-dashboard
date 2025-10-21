import { Calendar, ExternalLink } from 'lucide-react';
import { nextMonitoring } from '../data/mockData';

const NextMonitoring = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Próximo Monitoramento</h2>
        <button className="text-teal-600 hover:text-teal-700 text-xs font-semibold flex items-center gap-1 transition-colors">
          Ver calendário
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Calendar className="w-4 h-4 text-teal-600" />
        <span className="font-medium">{nextMonitoring.date}</span>
      </div>

      <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
            {nextMonitoring.deviceIcon}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Dispositivo</p>
            <p className="font-bold text-gray-900 text-base">{nextMonitoring.device}</p>
          </div>
        </div>

        <div className="mx-4">
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center border border-pink-200">
            <span className="text-xs font-bold text-pink-600">VS</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end">
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Comparação</p>
            <p className="font-bold text-gray-900 text-base">{nextMonitoring.vs}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
            {nextMonitoring.vsIcon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextMonitoring;
