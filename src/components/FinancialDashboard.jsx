import { useState } from 'react';
import { Calendar, TrendingDown, DollarSign, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

const FinancialDashboard = ({ selectedEstablishment }) => {
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const [costMeta, setCostMeta] = useState(3000);
  const [costInputValue, setCostInputValue] = useState('3000');

  const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const monthlyCostData = [
    { month: 'Jan', consumed: 2100, economy: 900 },
    { month: 'Fev', consumed: 2400, economy: 600 },
    { month: 'Mar', consumed: 2850, economy: 150 },
    { month: 'Abr', consumed: 3100, economy: -100 },
    { month: 'Mai', consumed: 2800, economy: 200 },
    { month: 'Jun', consumed: 2600, economy: 400 },
    { month: 'Jul', consumed: 2900, economy: 100 },
    { month: 'Ago', consumed: 2700, economy: 300 },
    { month: 'Set', consumed: 2500, economy: 500 },
    { month: 'Out', consumed: 2400, economy: 600 },
    { month: 'Nov', consumed: 2200, economy: 800 },
    { month: 'Dez', consumed: 2300, economy: 700 }
  ];

  const totalConsumptionYear = 32450;
  const totalEconomyYear = 5750;

  const economyPieData = [
    { name: 'Consumo Total', value: totalConsumptionYear, fill: '#ef4444' },
    { name: 'Economia', value: totalEconomyYear, fill: '#22c55e' }
  ];

  const updateTable = [
    { month: 'JAN', value: '50 h', timeUpdate: '46 H' },
    { month: 'FEV', value: '50 h', timeUpdate: '51 H' },
    { month: 'MAR', value: '45 h', timeUpdate: '29 H' },
    { month: 'ABR', value: '49 h', timeUpdate: '32 H' }
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
    if (!isNaN(newValue)) {
      setCostMeta(newValue);
    }
  };

  const currentMonthAccumulated = monthlyCostData.slice(0, new Date().getMonth() + 1)
    .reduce((sum, month) => sum + month.consumed, 0);
  
  const yearOverYearGrowth = 14; // 114% vs ano anterior

  return (
    <div className="space-y-8">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-4 gap-6">
        {/* Meta Card */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-yellow-300 border-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-700 uppercase">Meta</p>
            <TrendingDown className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">R${costMeta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Acumulado Card */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-yellow-300 border-2">
          <p className="text-sm font-bold text-gray-700 uppercase mb-4">Acumulado</p>
          <p className="text-3xl font-bold text-gray-900">R${currentMonthAccumulated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Economia Total do Ano */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-yellow-300 border-2">
          <p className="text-sm font-bold text-gray-700 uppercase mb-4">Economia Total Ano</p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={economyPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
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
            <div>
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-bold text-red-600">R$ {totalConsumptionYear.toLocaleString('pt-BR')}</span>
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-bold text-green-600">Economia</span>
              </p>
            </div>
          </div>
        </div>

        {/* % vs Ano Anterior */}
        <div className="bg-blue-600 rounded-xl p-6 shadow-md border border-yellow-300 border-2 text-white">
          <p className="text-lg font-bold opacity-90 mb-2">{yearOverYearGrowth + 100}%</p>
          <p className="text-xs font-semibold opacity-75">EM RELAÇÃO AO ANO PASSADO</p>
        </div>
      </div>

      {/* Client Info and Filter */}
      <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-600">E</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Unidade {selectedEstablishment}</p>
            <p className="text-xs text-gray-500">Dados em Reais (R$)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
          <UITooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setPeriodFilter('monthly')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  periodFilter === 'monthly'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Mensal</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Visualizar dados por mês
            </TooltipContent>
          </UITooltip>
          <UITooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setPeriodFilter('daily')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  periodFilter === 'daily'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Diário</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Visualizar dados por dia
            </TooltipContent>
          </UITooltip>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Gráfico Mensal */}
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-md border border-yellow-300 border-2">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Gráfico Mensal</h3>
            <UITooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-gray-500">Consumo Mensal para o Ano Atual</p>
              </TooltipTrigger>
              <TooltipContent>
                Comparação de consumo e economia por mês
              </TooltipContent>
            </UITooltip>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Bar dataKey="consumed" fill="#22c55e" name="Consumo (R$)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="economy" fill="#ef4444" name="Desvio (R$)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right Side Panel */}
        <div className="space-y-6">
          {/* Desvio Meta */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-green-300 border-2">
            <p className="text-sm font-bold text-gray-700 uppercase mb-4">Desvio EM RELAÇÃO À META</p>
            <p className="text-2xl font-bold text-green-600 mb-4">
              R${Math.max(0, costMeta - currentMonthAccumulated).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={costInputValue}
                onChange={handleCostInputChange}
                onKeyPress={handleCostKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Nova meta"
              />
              <button
                onClick={handleSaveCostMeta}
                className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>

          {/* Update Table */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <p className="text-xs font-bold text-gray-700 uppercase mb-4 text-center">Atualização Mensal</p>
            <div className="space-y-2">
              {updateTable.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs border-b border-gray-200 pb-2 last:border-b-0">
                  <span className="font-semibold text-gray-700 w-12">{item.month}</span>
                  <span className="text-gray-600">{item.value}</span>
                  <span className="font-semibold text-gray-700 w-12 text-right">{item.timeUpdate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hours Box */}
          <div className="bg-blue-600 rounded-xl p-6 shadow-md border border-gray-200 text-white text-center">
            <p className="text-xs font-bold uppercase mb-3 opacity-90">Quantidade de Horas</p>
            <p className="text-xs font-bold opacity-75">de Atualização Mensal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
