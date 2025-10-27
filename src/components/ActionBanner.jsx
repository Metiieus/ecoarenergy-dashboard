import { ArrowRight } from 'lucide-react';

const ActionBanner = ({ onControlCenterClick }) => {
  return (
    <div className="relative bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl p-8 overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-teal-400/30">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 right-20 w-32 h-32 bg-teal-400/20 rounded-full translate-y-1/2"></div>
      <div className="absolute top-1/2 right-32 w-20 h-20 bg-white/5 rounded-full"></div>

      {/* Content */}
      <div className="relative z-10">
        <p className="text-teal-100 text-xs font-bold uppercase tracking-wider mb-3">⚡ Lembrete Importante</p>
        <h3 className="text-white text-xl font-bold mb-4">
          Configure o monitoramento<br />para a próxima semana
        </h3>
        <button
          onClick={onControlCenterClick}
          className="bg-white text-teal-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 group shadow-md"
        >
          Ir para central de controle
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Illustration Elements */}
      <div className="absolute bottom-6 right-8 text-5xl opacity-15">⚡</div>
      <div className="absolute top-6 right-20 text-3xl opacity-15">💡</div>
    </div>
  );
};

export default ActionBanner;
