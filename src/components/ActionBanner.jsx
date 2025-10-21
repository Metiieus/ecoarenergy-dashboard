import { ArrowRight } from 'lucide-react';

const ActionBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-teal-600 via-teal-500 to-blue-600 rounded-2xl p-8 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 right-20 w-32 h-32 bg-yellow-400/30 rounded-full translate-y-1/2"></div>
      <div className="absolute top-1/2 right-32 w-20 h-20 bg-pink-400/40 rounded-full"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <p className="text-teal-100 text-sm font-semibold uppercase tracking-wide mb-2">NÃO ESQUEÇA</p>
        <h3 className="text-white text-2xl font-bold mb-4">
          Configure o monitoramento<br />para a próxima semana
        </h3>
        <button className="bg-white text-teal-700 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors flex items-center gap-2 group">
          Ir para central de controle
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      {/* Illustration Elements */}
      <div className="absolute bottom-8 right-12 text-6xl opacity-20">⚡</div>
      <div className="absolute top-8 right-24 text-4xl opacity-20">💡</div>
    </div>
  );
};

export default ActionBanner;

