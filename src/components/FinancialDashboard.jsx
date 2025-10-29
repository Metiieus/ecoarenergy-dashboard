import { useState } from 'react';
import { Calendar, TrendingDown, Edit2, Check, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

const FinancialDashboard = ({ selectedEstablishment }) => {
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const [costMeta, setCostMeta] = useState(3000);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [costInputValue, setCostInputValue] = useState('3000');

  const monthlyCostData = [
    { month: 'Jan', consumed: 2100, economia: 900 },
    { month: 'Fev', consumed: 2400, economia: 600 },
    { month: 'Mar', consumed: 2850, economia: 150 },
    { month: 'Abr', consumed: 3100, economia: -100 },
    { month: 'Mai', consumed: 2800, economia: 200 },
    { month: 'Jun', consumed: 2600, economia: 400 },
    { month: 'Jul', consumed: 2900, economia: 100 },
    { month: 'Ago', consumed: 2700, economia: 300 },
    { month: 'Set', consumed: 2500, economia: 500 },
    { month: 'Out', consumed: 2400, economia: 600 },
    { month: 'Nov', consumed: 2200, economia: 800 },
    { month: 'Dez', consumed: 2300, economia: 700 }
  ];

  const totalConsumptionYear = 32450;
  const totalEconomyYear = 5750;

  const economyPieData = [
    { name: 'Consumo Total', value: totalConsumptionYear, fill: '#dc2626' },
    { name: 'Economia', value: totalEconomyYear, fill: '#22c55e' }
  ];

  const updateTable = [
    { month: 'JAN', value: '50 h', atualização: '46 H' },
    { month: 'FEV', value: '50 h', atualização: '51 H' },
    { month: 'MAR', value: '45 h', atualização: '29 H' },
    { month: 'ABR', value: '49 h', atualização: '32 H' }
  ];

  const handleCostInputChange = (e) => {
    setCostInputValue(e.target.value);
  };

  const handleCostKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveCostMeta();
    }
  };

  const handleSaveCostMeta = () => {
    const newValue = parseFloat(costInputValue);
    if (!isNaN(newValue) && newValue > 0) {
      setCostMeta(newValue);
      setIsEditingMeta(false);
    }
  };

  const currentMonthAccumulated = monthlyCostData.slice(0, new Date().getMonth() + 1)
    .reduce((sum, month) => sum + month.consumed, 0);

  const yearOverYearGrowth = 114;

  return (
    <div className="space-y-6">
      {/* Top Metrics Row - 4 Cards */}
      <div className="grid grid-cols-4 gap-3">
        {/* Meta Card */}
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Meta</p>
            <TrendingDown className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {isEditingMeta ? (
              <div className="flex gap-1">
                <input
                  autoFocus
                  type="number"
                  value={costInputValue}
                  onChange={handleCostInputChange}
                  onKeyPress={handleCostKeyPress}
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleSaveCostMeta}
                  className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-medium transition-colors"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-1">
                <span>R${costMeta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <button
                  onClick={() => {
                    setCostInputValue(costMeta.toString());
                    setIsEditingMeta(true);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </p>
        </div>

        {/* Acumulado Card */}
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Acumulado</p>
          <p className="text-2xl font-bold text-gray-900">R${currentMonthAccumulated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Economia Total do Ano */}
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow flex flex-col items-center justify-center">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Economia Ano</p>
          <div className="w-24 h-24 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={economyPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={48}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {economyPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900 text-sm leading-tight">
              R$ {(totalConsumptionYear / 1000).toFixed(1)}k
            </p>
            <p className="text-xs font-semibold text-green-600">Economia</p>
          </div>
        </div>

        {/* % vs Ano Anterior */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-5 shadow-md border border-teal-700/20 text-white flex flex-col justify-center hover:shadow-lg transition-shadow">
          <p className="text-3xl font-bold mb-1 text-center">{yearOverYearGrowth}%</p>
          <p className="text-xs font-semibold text-center leading-tight text-teal-50">Em Relação ao Ano Passado</p>
        </div>
      </div>

      {/* Info and Filter Bar */}
      <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-md border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-600">E</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700">Unidade {selectedEstablishment}</p>
            <p className="text-xs text-gray-500">Reais (R$)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Período:</span>
          <div className="flex items-center gap-1">
            <UITooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setPeriodFilter('monthly')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                    periodFilter === 'monthly'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>Mensal</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Visualizar dados por mês</TooltipContent>
            </UITooltip>
            <UITooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setPeriodFilter('daily')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                    periodFilter === 'daily'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>Diário</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Visualizar dados por dia</TooltipContent>
            </UITooltip>
          </div>
        </div>
      </div>

      {/* Main Content - Graph and Right Panel */}
      <div className="grid grid-cols-3 gap-3">
        {/* Large Graph Section */}
        <div className="col-span-2 bg-white rounded-lg p-4 shadow-md border-4 border-yellow-400">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Gráfico Mensal</h3>
          <p className="text-xs text-gray-500 mb-3">Consumo para o Ano Atual</p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyCostData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Bar dataKey="consumed" fill="#22c55e" name="Consumo (R$) em R$ (R$)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="economia" fill="#ef4444" name="Consumo Previsto (R$)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right Panel */}
        <div className="space-y-3 flex flex-col">
          {/* Desvio Meta */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 shadow-md border-4 border-green-400">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-600 uppercase">Desvio Meta</p>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600 mb-2">
              R${Math.max(0, costMeta - currentMonthAccumulated).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div className="text-xs text-gray-600 space-y-0.5">
              <p>Meta: <span className="font-semibold text-gray-900">R${(costMeta / 1000).toFixed(1)}k</span></p>
              <p>Gasto: <span className="font-semibold text-gray-900">R${(currentMonthAccumulated / 1000).toFixed(1)}k</span></p>
            </div>
          </div>

          {/* Update Table */}
          <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200">
            <p className="text-xs font-bold text-gray-700 uppercase mb-2 text-center">Mês / Metas / Atualiz.</p>
            <div className="space-y-1">
              {updateTable.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs border-b border-gray-100 pb-1 last:border-b-0 hover:bg-gray-50 px-1 py-0.5 rounded transition-colors">
                  <span className="font-bold text-gray-700 min-w-10">{item.month}</span>
                  <span className="text-teal-600 flex-1 text-center font-medium text-xs">{item.value}</span>
                  <span className="font-bold text-gray-900 text-right w-10 text-xs">{item.atualização}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hours Box */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-4 shadow-md border-4 border-teal-700 text-center text-white">
            <Clock className="w-5 h-5 mx-auto mb-1 opacity-90" />
            <p className="text-lg font-bold mb-0.5">48.5h</p>
            <p className="text-xs font-semibold leading-tight">Atualização Mensal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
