import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Target, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { metrics } from '../data/mockData';

const ConsumptionTab = () => {
  const [consumptionGoal, setConsumptionGoal] = useState(null);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [tempGoalValue, setTempGoalValue] = useState('');

  // Mock data for consumption history
  const monthlyConsumptionData = [
    { month: 'Janeiro', actual: 8500, goal: 8000, savings: 500 },
    { month: 'Fevereiro', actual: 8200, goal: 8000, savings: 200 },
    { month: 'Março', actual: 8700, goal: 8000, savings: -700 },
    { month: 'Abril', actual: 8100, goal: 8000, savings: 100 },
    { month: 'Maio', actual: 7900, goal: 8000, savings: 1100 },
    { month: 'Junho', actual: 8300, goal: 8000, savings: -300 },
    { month: 'Julho', actual: 8000, goal: 8000, savings: 800 },
    { month: 'Agosto', actual: 7800, goal: 8000, savings: 1200 },
    { month: 'Setembro', actual: 7600, goal: 8000, savings: 1400 },
    { month: 'Outubro', actual: 7900, goal: 8000, savings: 1100 },
    { month: 'Novembro', actual: 8100, goal: 8000, savings: 900 },
    { month: 'Dezembro', actual: 8200, goal: 8000, savings: 1200 }
  ];

  const currentMonth = monthlyConsumptionData[10]; // Novembro
  const lastMonth = monthlyConsumptionData[9]; // Outubro
  const lastYear = monthlyConsumptionData[0]; // Janeiro do ano anterior (mock)

  const currentMonthSavings = currentMonth.savings;
  const previousMonthSavings = lastMonth.savings;
  const yearlyTotalSavings = monthlyConsumptionData.reduce((sum, d) => sum + d.savings, 0);

  const savingsVsLastMonth = currentMonthSavings - previousMonthSavings;
  const savingsVsLastYear = currentMonthSavings - lastYear.savings;

  const handleSetGoal = () => {
    setShowGoalInput(true);
  };

  const handleSaveGoal = () => {
    if (tempGoalValue) {
      setConsumptionGoal(parseFloat(tempGoalValue));
      setShowGoalInput(false);
      setTempGoalValue('');
    }
  };

  const getProgressPercentage = () => {
    if (!consumptionGoal) return 0;
    return ((currentMonth.actual / consumptionGoal) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header with Goal Setting */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Análise de Consumo</h2>
            <p className="text-gray-600">Monitore seu consumo real, metas e economias</p>
          </div>
          <button
            onClick={handleSetGoal}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            {consumptionGoal ? 'Editar Meta' : 'Definir Meta'}
          </button>
        </div>

        {showGoalInput && (
          <div className="flex gap-2 mt-4">
            <input
              type="number"
              value={tempGoalValue}
              onChange={(e) => setTempGoalValue(e.target.value)}
              placeholder="Digite a meta de consumo mensal (kWh)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleSaveGoal}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
            >
              Salvar
            </button>
          </div>
        )}

        {consumptionGoal && (
          <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Consumo Atual</p>
                <p className="text-3xl font-bold text-gray-900">{currentMonth.actual} kWh</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Meta Definida</p>
                <p className="text-3xl font-bold text-teal-600">{consumptionGoal} kWh</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Progresso</p>
                <p className="text-3xl font-bold text-gray-900">{getProgressPercentage()}%</p>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  getProgressPercentage() >= 100 ? 'bg-red-500' : getProgressPercentage() >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Savings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Month Savings */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900">Economia Mês Atual</h4>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-2">{currentMonthSavings} kWh</p>
          <p className="text-sm text-gray-600">
            {currentMonthSavings > 0 ? '✓ Dentro da meta' : '✗ Acima da meta'}
          </p>
        </div>

        {/* vs Last Month */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              savingsVsLastMonth > 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {savingsVsLastMonth > 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
            </div>
            <h4 className="font-bold text-gray-900">vs Mês Passado</h4>
          </div>
          <p className={`text-3xl font-bold mb-2 ${savingsVsLastMonth > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {savingsVsLastMonth > 0 ? '+' : ''}{savingsVsLastMonth} kWh
          </p>
          <p className="text-sm text-gray-600">
            {savingsVsLastMonth > 0 ? 'Melhor economia' : 'Pior economia'}
          </p>
        </div>

        {/* vs Last Year */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900">vs Ano Passado</h4>
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-2">{savingsVsLastYear} kWh</p>
          <p className="text-sm text-gray-600">
            Comparação anual
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumption vs Goal Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Consumo Atual vs Meta</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyConsumptionData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} stroke="#718096" />
                <YAxis stroke="#718096" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a202c',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="actual" name="Consumo Real" fill="url(#colorActual)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="goal" name="Meta" fill="#94A3B8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings Trend Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Tendência de Economia</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyConsumptionData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} stroke="#718096" />
                <YAxis stroke="#718096" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a202c',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="savings"
                  name="Economia"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 5 }}
                  activeDot={{ r: 7 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Yearly Summary */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Resumo Anual</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Total Economizado</p>
            <p className="text-3xl font-bold text-green-600">{yearlyTotalSavings} kWh</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Consumo Anual</p>
            <p className="text-3xl font-bold text-blue-600">
              {monthlyConsumptionData.reduce((sum, d) => sum + d.actual, 0)} kWh
            </p>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Meta Anual</p>
            <p className="text-3xl font-bold text-teal-600">
              {monthlyConsumptionData.reduce((sum, d) => sum + d.goal, 0)} kWh
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Economia %</p>
            <p className="text-3xl font-bold text-purple-600">
              {((yearlyTotalSavings / monthlyConsumptionData.reduce((sum, d) => sum + d.goal, 0)) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionTab;
