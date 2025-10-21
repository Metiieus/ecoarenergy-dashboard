import { Calendar, ExternalLink } from 'lucide-react';
import { nextMonitoring } from '../data/mockData';

const NextMonitoring = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Próximo Monitoramento</h2>
        <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
          View calendar
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Calendar className="w-4 h-4" />
        <span>{nextMonitoring.date}</span>
      </div>
      
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-2xl">
            {nextMonitoring.deviceIcon}
          </div>
          <div>
            <p className="font-bold text-gray-800">{nextMonitoring.device}</p>
          </div>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
          <span className="text-sm font-bold text-pink-600">VS</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-2xl">
            {nextMonitoring.vsIcon}
          </div>
          <div>
            <p className="font-bold text-gray-800">{nextMonitoring.vs}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextMonitoring;

