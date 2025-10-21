const MetricCard = ({ icon: Icon, title, value, suffix, color = 'teal' }) => {
  const colorClasses = {
    teal: 'from-teal-400 to-teal-600',
    pink: 'from-pink-400 to-pink-600',
    yellow: 'from-yellow-400 to-yellow-600',
    blue: 'from-blue-400 to-blue-600'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:scale-105 duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
      </div>
      <div className="flex items-baseline gap-1">
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {suffix && <p className="text-lg text-gray-500">{suffix}</p>}
      </div>
    </div>
  );
};

export default MetricCard;

