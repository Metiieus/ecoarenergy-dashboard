import { useState, useEffect } from 'react';
import { Calendar, TrendingDown, Edit2, Check, TrendingUp, Clock, Zap, Leaf } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { deviceRankings } from '../data/mockData';
import { useApiData } from '../hooks/useApiData';

const FinancialDashboard = ({ selectedEstablishment }) => {
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const [costMeta, setCostMeta] = useState(10000);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [costInputValue, setCostInputValue] = useState('10000');
  const [activationTimeMeta, setActivationTimeMeta] = useState(50);
  const [isEditingActivationMeta, setIsEditingActivationMeta] = useState(false);
  const [activationTimeInputValue, setActivationTimeInputValue] = useState('50');
  const [monthlyActivationTime, setMonthlyActivationTime] = useState(48.5);
  const [monthlyCostData, setMonthlyCostData] = useState([]);

  const { data: apiData, loading, error } = useApiData(selectedEstablishment, true);

  useEffect(() => {
    if (apiData && apiData.consumo_mensal && apiData.consumo_mensal.length > 0) {
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const transformedData = apiData.consumo_mensal.map((consumoAcumulado, index) => {
        // Consumo anterior (para calcular consumo mensal real)
        const consumoAnterior = index > 0 ? apiData.consumo_mensal[index - 1] : 0;
        const consumoMensal = consumoAcumulado - consumoAnterior;

        // Eco Ar é 80% do consumo (simulação de otimização)
        const consumoComEcoAr = consumoMensal * 0.8;

        // Previsto é 85% do consumo mensal (meta otimista)
        const consumoPrevisto = consumoMensal * 0.85;

        return {
          month: monthNames[index],
          consumed: Math.round(consumoMensal),
          ecoAir: Math.round(consumoComEcoAr),
          previsto: Math.round(consumoPrevisto),
          consumoAcumulado: Math.round(consumoAcumulado)
        };
      });
      setMonthlyCostData(transformedData);
    }
  }, [apiData, selectedEstablishment]);

  const totalConsumptionYear = monthlyCostData.reduce((sum, month) => sum + month.consumoAcumulado, 0) || 0;
  const totalEconomyYear = monthlyCostData.reduce((sum, month) => sum + (month.consumed - month.ecoAir), 0) || 0;

  const economyPieData = [
    { name: 'Consumo Total', value: Math.max(totalConsumptionYear, 1), fill: '#dc2626' },
    { name: 'Economia', value: Math.max(totalEconomyYear, 1), fill: '#22c55e' }
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

  const handleActivationTimeInputChange = (e) => {
    setActivationTimeInputValue(e.target.value);
  };

  const handleActivationTimeKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveActivationTimeMeta();
    }
  };

  const handleSaveActivationTimeMeta = () => {
    const newValue = parseFloat(activationTimeInputValue);
    if (!isNaN(newValue) && newValue > 0) {
      setActivationTimeMeta(newValue);
      setIsEditingActivationMeta(false);
    }
  };

  const currentMonthIndex = new Date().getMonth();
  const currentMonthData = monthlyCostData[currentMonthIndex];
  const currentMonthAccumulated = monthlyCostData.slice(0, currentMonthIndex + 1)
    .reduce((sum, month) => sum + month.ecoAir, 0) || 0;

  const yearOverYearGrowth = 12;
  const monthlyMeta = costMeta / 12; // Divide a meta anual pela quantidade de meses

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const metaValue = monthlyMeta;
      const ecoAirValue = data.ecoAir;
      const deviation = metaValue - ecoAirValue;
      const deviationPercent = ((deviation / metaValue) * 100).toFixed(1);

      return (
        <div className="bg-white p-3 rounded-lg border border-gray-300 shadow-lg">
          <p className="font-semibold text-gray-900 text-sm mb-2">{data.month}</p>
          <p className="text-xs text-green-600 mb-1">
            Eco Ar: <span className="font-semibold">R$ {data.ecoAir.toLocaleString('pt-BR')}</span>
          </p>
          <p className="text-xs text-red-400 mb-1">
            Previsto: <span className="font-semibold">R$ {data.previsto.toLocaleString('pt-BR')}</span>
          </p>
          <div className="border-t border-gray-200 mt-2 pt-2">
            <p className={`text-xs font-semibold ${deviation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Desvio Meta: R$ {deviation.toLocaleString('pt-BR')} ({deviationPercent}%)
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

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
          <div className="mb-2">
            <p className="text-2xl font-bold text-gray-900">R${currentMonthAccumulated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-gray-500 mt-1">com Eco Ar</p>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <p className="text-xs text-gray-600">Meta acumulada: <span className="font-semibold text-gray-900">R${((currentMonthIndex + 1) * monthlyMeta).toLocaleString('pt-BR')}</span></p>
          </div>
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
        <div className="col-span-2 bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Gráfico Mensal</h3>
          <p className="text-xs text-gray-500 mb-3">Consumo para o Ano Atual</p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyCostData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="ecoAir" fill="#10b981" name="Consumo com Eco Ar (R$)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="previsto" fill="#f87171" name="Consumo Previsto (R$)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right Panel */}
        <div className="space-y-3 flex flex-col">
          {/* Desvio Meta */}
          <div className={`bg-gradient-to-br rounded-lg p-4 shadow-md border hover:shadow-lg transition-shadow ${
            currentMonthAccumulated <= (currentMonthIndex + 1) * monthlyMeta
              ? 'from-green-50 to-white border-green-200'
              : 'from-red-50 to-white border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-600 uppercase">Desvio Meta</p>
              {currentMonthAccumulated <= (currentMonthIndex + 1) * monthlyMeta ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            <p className={`text-3xl font-bold mb-3 ${
              currentMonthAccumulated <= (currentMonthIndex + 1) * monthlyMeta
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              R${Math.abs((currentMonthIndex + 1) * monthlyMeta - currentMonthAccumulated).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div className={`text-xs text-gray-600 space-y-0.5 rounded p-2 ${
              currentMonthAccumulated <= (currentMonthIndex + 1) * monthlyMeta
                ? 'bg-green-50/50'
                : 'bg-red-50/50'
            }`}>
              <p>Meta acumulada: <span className="font-semibold text-gray-900">R${((currentMonthIndex + 1) * monthlyMeta).toLocaleString('pt-BR')}</span></p>
              <p>Gasto acumulado: <span className="font-semibold text-gray-900">R${currentMonthAccumulated.toLocaleString('pt-BR')}</span></p>
              <p className="mt-1 pt-1 border-t border-gray-200">
                {currentMonthAccumulated <= (currentMonthIndex + 1) * monthlyMeta
                  ? '✓ Dentro da meta'
                  : '✗ Acima da meta'}
              </p>
            </div>
          </div>

          {/* Update Table */}
          <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
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

          {/* Activation Time with Meta and Device Details */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow space-y-4">
            {/* Header with Icon */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                <p className="text-xs font-bold text-gray-700 uppercase">Tempo de Atuação</p>
              </div>
            </div>

            {/* Activation Time Meta */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600 font-semibold">Meta Mensal (h)</p>
              <div className="flex items-center gap-2">
                {isEditingActivationMeta ? (
                  <>
                    <input
                      autoFocus
                      type="number"
                      value={activationTimeInputValue}
                      onChange={handleActivationTimeInputChange}
                      onKeyPress={handleActivationTimeKeyPress}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      onClick={handleSaveActivationTimeMeta}
                      className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-medium transition-colors"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold text-teal-600">{activationTimeMeta}h</p>
                    <button
                      onClick={() => {
                        setActivationTimeInputValue(activationTimeMeta.toString());
                        setIsEditingActivationMeta(true);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Current Month Activation Time */}
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-600 font-semibold">Atuação do Mês</p>
              <p className="text-lg font-bold text-gray-900">{monthlyActivationTime}h</p>
            </div>

            {/* Device Details */}
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-600 font-semibold mb-2">Dispositivos Ativos</p>
              <div className="space-y-1 max-h-28 overflow-y-auto">
                {deviceRankings.slice(0, 3).map((device) => (
                  <div key={device.id} className="flex items-center gap-2 text-xs bg-gray-50 p-2 rounded">
                    <span className="text-base">{device.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-700">{device.name}</p>
                      <p className="text-gray-500">{device.activeTime}h - Score: {device.score}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
