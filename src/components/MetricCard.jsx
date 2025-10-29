import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

const MetricCard = ({ icon: Icon, title, value, suffix, color = 'teal', tooltip }) => {
  const colorClasses = {
    teal: 'from-teal-400 to-teal-600 text-teal-600',
    pink: 'from-pink-400 to-pink-600 text-pink-600',
    yellow: 'from-yellow-400 to-yellow-600 text-yellow-600',
    blue: 'from-blue-400 to-blue-600 text-blue-600'
  };

  const colorTextClasses = {
    teal: 'text-teal-600',
    pink: 'text-pink-600',
    yellow: 'text-yellow-600',
    blue: 'text-blue-600'
  };

  const colorBgClasses = {
    teal: 'from-teal-400 to-teal-600',
    pink: 'from-pink-400 to-pink-600',
    yellow: 'from-yellow-400 to-yellow-600',
    blue: 'from-blue-400 to-blue-600'
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-help">
          <div className="flex items-start justify-between mb-6">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorBgClasses[color]} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{title}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {suffix && <p className="text-sm text-gray-500">{suffix}</p>}
          </div>
        </div>
      </TooltipTrigger>
      {tooltip && (
        <TooltipContent>
          {tooltip}
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export default MetricCard;
