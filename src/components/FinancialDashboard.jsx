import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Calendar, TrendingDown, Edit2, Check, TrendingUp, Clock, Zap, Leaf } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { deviceRankings } from '../data/mockData';
import { useApiDataContext } from '../context/ApiDataContext';

const FinancialDashboard = ({ selectedEstablishment, onSelectDevice }) => {
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Metas por mês - permite diferentes metas para cada mês
  const [monthlyMetaValues, setMonthlyMetaValues] = useState({
    0: 10000, 1: 10000, 2: 10000, 3: 10000, 4: 10000, 5: 10000,
    6: 10000, 7: 10000, 8: 10000, 9: 10000, 10: 10000, 11: 10000
  });

  const currentMonthIndex = new Date().getMonth();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [costInputValue, setCostInputValue] = useState(monthlyMetaValues[currentMonthIndex].toString());

  const [activationTimeMeta, setActivationTimeMeta] = useState(50);
  const [isEditingActivationMeta, setIsEditingActivationMeta] = useState(false);
  const [activationTimeInputValue, setActivationTimeInputValue] = useState('50');
  const [monthlyActivationTime, setMonthlyActivationTime] = useState(48.5);
  const [monthlyCostData, setMonthlyCostData] = useState([]);

  const { apiData, loading, error } = useApiDataContext();

  // ========================================
  // METRIC CALCULATIONS EXPLANATION:
  // ========================================
  // Meta: User-set monthly budget (default R$10,000)
  // Consumo Mensal: Monthly consumption from API (difference from previous month)
  // Consumo com Eco Ar (ecoAir): Monthly × 0.8 (simulated 20% savings with Eco Air equipment)
  // Consumo Previsto: Monthly × 0.85 (85% of actual consumption)
  // Economia: Consumo Mensal - Consumo com Eco Ar (savings per month)
  // Acumulado: Sum of all ecoAir values from start of year to current month
  // Desvio Meta: (Meta - Accumulated Spending) = surplus/deficit against target
  // ========================================

  const monthlyCostDataMemo = useMemo(() => {
    if (apiData && Array.isArray(apiData.consumo_mensal) && apiData.consumo_mensal.length > 0) {
      return apiData.consumo_mensal.map((consumoAcumulado, index) => {
        const consumoAnterior = index > 0 ? apiData.consumo_mensal[index - 1] : 0;
        const consumoMensal = Math.max(0, consumoAcumulado - consumoAnterior);
        const consumoComEcoAir = consumoMensal * 0.8;
        const consumoPrevisto = consumoMensal * 0.85;
        const consumoSemSistema = apiData.consumo_sem_sistema_mensal?.[index]
          ? Math.max(0, apiData.consumo_sem_sistema_mensal[index] - (apiData.consumo_sem_sistema_mensal[index - 1] || 0))
          : consumoMensal / 0.8;

        return {
          month: monthNames[index],
          consumed: Math.round(consumoMensal),
          ecoAir: Math.round(consumoComEcoAir),
          previsto: Math.round(consumoPrevisto),
          consumoSemSistema: Math.round(consumoSemSistema),
          consumoAcumulado: Math.round(consumoAcumulado)
        };
      });
    }

    const mockData = [
      { month: 'Jan', consumed: 257, ecoAir: 206, previsto: 218, consumoAcumulado: 257 },
      { month: 'Fev', consumed: 825, ecoAir: 660, previsto: 701, consumoAcumulado: 1082 },
      { month: 'Mar', consumed: 1959, ecoAir: 1567, previsto: 1666, consumoAcumulado: 3041 },
      { month: 'Abr', consumed: 3029, ecoAir: 2423, previsto: 2575, consumoAcumulado: 6070 },
      { month: 'Mai', consumed: 2931, ecoAir: 2345, previsto: 2491, consumoAcumulado: 9001 },
      { month: 'Jun', consumed: 1811, ecoAir: 1449, previsto: 1539, consumoAcumulado: 10812 },
      { month: 'Jul', consumed: 1822, ecoAir: 1458, previsto: 1549, consumoAcumulado: 12634 },
      { month: 'Ago', consumed: 1957, ecoAir: 1566, previsto: 1664, consumoAcumulado: 14591 },
      { month: 'Set', consumed: 1397, ecoAir: 1118, previsto: 1188, consumoAcumulado: 15988 },
      { month: 'Out', consumed: 2603, ecoAir: 2082, previsto: 2212, consumoAcumulado: 18591 },
      { month: 'Nov', consumed: 0, ecoAir: 0, previsto: 0, consumoAcumulado: 18591 },
      { month: 'Dez', consumed: 0, ecoAir: 0, previsto: 0, consumoAcumulado: 18591 }
    ];

    return mockData;
  }, [apiData?.consumo_mensal]);

  useEffect(() => {
    setMonthlyCostData(monthlyCostDataMemo);
  }, [monthlyCostDataMemo]);

  const { totalConsumptionYear, totalEconomyYear, economyPieData } = useMemo(() => {
    const totalConsumption = monthlyCostData.length > 0
      ? monthlyCostData[monthlyCostData.length - 1]?.consumoAcumulado || 0
      : 0;

    const totalEconomy = monthlyCostData.length > 0
      ? monthlyCostData.reduce((sum, month) => sum + Math.max(0, (month?.consumed || 0) - (month?.ecoAir || 0)), 0)
      : 0;

    const pieData = [
      { name: 'Consumo Total', value: Math.max(totalConsumption, 1), fill: '#dc2626' },
      { name: 'Economia', value: Math.max(totalEconomy, 1), fill: '#22c55e' }
    ];

    return {
      totalConsumptionYear: totalConsumption,
      totalEconomyYear: totalEconomy,
      economyPieData: pieData
    };
  }, [monthlyCostData]);

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
      setMonthlyMetaValues({
        ...monthlyMetaValues,
        [selectedMonthIndex]: newValue
      });
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

  // Get data for the ACTUAL current month (for history and comparisons)
  const actualCurrentMonthIndex = new Date().getMonth();

  // Get data for the SELECTED month (what user is viewing)
  const selectedMonthData = monthlyCostData[selectedMonthIndex];

  // DADOS DO MÊS SELECIONADO (não acumulado)
  const selectedMonthOnly = isNaN(selectedMonthData?.ecoAir) ? 0 : Math.max(0, selectedMonthData?.ecoAir || 0);
  const selectedMonthConsumption = isNaN(selectedMonthData?.consumed) ? 0 : Math.max(0, selectedMonthData?.consumed || 0);
  const selectedMonthSavings = isNaN(selectedMonthConsumption - selectedMonthOnly) ? 0 : Math.max(0, selectedMonthConsumption - selectedMonthOnly);

  // Meta do mês selecionado
  const selectedMonthMeta = monthlyMetaValues[selectedMonthIndex] || 10000;

  // DADOS ACUMULADOS ATÉ O MÊS ATUAL (para comparativo histórico)
  const currentMonthAccumulated = monthlyCostData.length > 0
    ? monthlyCostData.slice(0, actualCurrentMonthIndex + 1).reduce((sum, month) => sum + (month?.ecoAir || 0), 0)
    : 0;

  // Calculate actual monthly activation time from API downtime data
  const calculatedMonthlyActivationTime = apiData && apiData.minutos_desligado_mensal && apiData.minutos_desligado_mensal.length > 0
    ? Math.max(0, 720 - (apiData.minutos_desligado_mensal[selectedMonthIndex] || 0) / 60)
    : monthlyActivationTime;

  // Year-over-year growth: Compare current accumulated consumption with same period last year
  // Currently hardcoded to 12% because API doesn't provide historical year-over-year data
  // TODO: Implement logic to fetch and calculate actual year-over-year growth when API provides historical data
  const yearOverYearGrowth = 12;

  const dailyCostData = useMemo(() => {
    return apiData && Array.isArray(apiData.consumo_diario_mes_corrente)
      ? apiData.consumo_diario_mes_corrente.map((consumoDiario, index) => ({
          day: `D${index + 1}`,
          consumed: Math.round(consumoDiario),
          ecoAir: Math.round(consumoDiario * 0.8),
          previsto: Math.round(consumoDiario * 0.85)
        }))
      : [];
  }, [apiData?.consumo_diario_mes_corrente]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const ecoAirValue = data.ecoAir || 0;
      const monthIndex = data.month ? monthNames.indexOf(data.month) : selectedMonthIndex;
      const monthMeta = monthlyMetaValues[monthIndex] || 10000;
      const deviation = monthMeta - ecoAirValue;
      const deviationPercent = monthMeta > 0 ? ((deviation / monthMeta) * 100).toFixed(1) : 0;

      return (
        <div className="bg-white p-3 rounded-lg border border-gray-300 shadow-lg">
          <p className="font-semibold text-gray-900 text-sm mb-2">{data.month || 'Dia'} {data.day || ''}</p>
          <p className="text-xs text-green-600 mb-1">
            Eco Ar: <span className="font-semibold">R$ {(ecoAirValue || 0).toLocaleString('pt-BR')}</span>
          </p>
          <p className="text-xs text-red-400 mb-1">
            Meta: <span className="font-semibold">R$ {Math.round(monthMeta).toLocaleString('pt-BR')}</span>
          </p>
          <div className="border-t border-gray-200 mt-2 pt-2">
            <p className={`text-xs font-semibold ${deviation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Desvio: R$ {(isNaN(deviation) ? 0 : deviation).toFixed(0).toLocaleString('pt-BR')} ({deviationPercent}%)
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
      <div className="grid grid-cols-5 gap-3 items-start">
        {/* Meta Card - Mês Selecionado */}
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow h-fit">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Meta - {monthNames[selectedMonthIndex]}</p>
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
                <span>R${selectedMonthMeta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <button
                  onClick={() => {
                    setCostInputValue(selectedMonthMeta.toString());
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

        {/* Economia Total do Ano - Gauge */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow col-span-2 flex flex-col h-96">
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Economia Ano</p>
            <p className="text-xs text-gray-500 mt-1">Consumo vs Economia</p>
          </div>
          <div className="flex-1 flex items-center justify-center gap-12 overflow-hidden">
            <div className="flex-shrink-0">
              <ResponsiveContainer width={320} height={320} debounce={100}>
                <PieChart isAnimationActive={false}>
                  <Pie
                    data={economyPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={130}
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                  >
                    {economyPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-6 flex-shrink-0">
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">Consumo Total</p>
                <p className="text-3xl font-bold text-gray-900">R$ {isNaN(totalConsumptionYear) ? '0' : (totalConsumptionYear / 1000).toFixed(1)}k</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">Economia Alcançada</p>
                <p className="text-3xl font-bold text-green-600">R$ {isNaN(totalEconomyYear) ? '0' : (totalEconomyYear / 1000).toFixed(1)}k</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mês Selecionado Card - DADOS PRINCIPAIS */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 shadow-md border border-blue-200 hover:shadow-lg transition-shadow h-fit">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">{monthNames[selectedMonthIndex]}</p>
            <select
              value={selectedMonthIndex}
              onChange={(e) => {
                const newIndex = parseInt(e.target.value);
                setSelectedMonthIndex(newIndex);
                setCostInputValue(monthlyMetaValues[newIndex].toString());
              }}
              className="text-xs px-2 py-1 border border-blue-300 rounded bg-white text-gray-700 hover:border-blue-500 transition-colors appearance-none cursor-pointer"
            >
              {monthNames.map((name, index) => (
                <option key={index} value={String(index)}>{name}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <p className="text-2xl font-bold text-gray-900">R${isNaN(selectedMonthOnly) ? '0' : Math.round(selectedMonthOnly).toLocaleString('pt-BR')}</p>
            <p className="text-xs text-gray-500 mt-1">com Eco Ar</p>
          </div>
          <div className="bg-blue-50/50 rounded p-2 space-y-1">
            <p className="text-xs text-gray-600">Meta: <span className="font-semibold text-gray-900">R${isNaN(selectedMonthMeta) ? '0' : Math.round(selectedMonthMeta).toLocaleString('pt-BR')}</span></p>
            <p className="text-xs text-gray-600">Economia: <span className="font-semibold text-green-600">R${isNaN(selectedMonthSavings) ? '0' : Math.round(selectedMonthSavings).toLocaleString('pt-BR')}</span></p>
          </div>
        </div>

        {/* % vs Ano Anterior */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-5 shadow-md border border-teal-700/20 text-white flex flex-col justify-center hover:shadow-lg transition-shadow h-fit">
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
          <h3 className="text-sm font-bold text-gray-900 mb-1">
            Gráfico {periodFilter === 'monthly' ? 'Mensal' : 'Diário'}
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            {periodFilter === 'monthly' ? 'Consumo para o Ano Atual' : 'Consumo para o Mês Atual'}
          </p>

          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto mb-3"></div>
                <p className="text-xs text-gray-600">Carregando dados da API...</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-red-600 mb-2">Erro ao carregar dados</p>
                <p className="text-xs text-gray-500">{error}</p>
              </div>
            </div>
          ) : periodFilter === 'monthly' ? (
            monthlyCostData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} debounce={100}>
                <BarChart data={monthlyCostData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }} isAnimationActive={false}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="ecoAir" fill="#10b981" name="Consumo com Eco Ar (R$)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="previsto" fill="#f87171" name="Consumo Previsto (R$)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-xs text-gray-600">Nenhum dado disponível</p>
              </div>
            )
          ) : (
            dailyCostData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} debounce={100}>
                <BarChart data={dailyCostData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }} isAnimationActive={false}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="ecoAir" fill="#10b981" name="Consumo com Eco Ar (R$)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="previsto" fill="#f87171" name="Consumo Previsto (R$)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-xs text-gray-600">Nenhum dado disponível para este mês</p>
              </div>
            )
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-3 flex flex-col">
          {/* Desvio Meta - M��s Atual */}
          <div className={`bg-gradient-to-br rounded-lg p-4 shadow-md border hover:shadow-lg transition-shadow ${
            isNaN(selectedMonthOnly) || isNaN(selectedMonthMeta) || selectedMonthOnly <= selectedMonthMeta
              ? 'from-green-50 to-white border-green-200'
              : 'from-red-50 to-white border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-600 uppercase">Desvio Meta</p>
              {isNaN(selectedMonthOnly) || isNaN(selectedMonthMeta) || selectedMonthOnly <= selectedMonthMeta ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            <p className={`text-3xl font-bold mb-3 ${
              isNaN(selectedMonthOnly) || isNaN(selectedMonthMeta) || selectedMonthOnly <= selectedMonthMeta
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              R${isNaN(selectedMonthMeta) || isNaN(selectedMonthOnly) ? '0' : Math.round(Math.abs(selectedMonthMeta - selectedMonthOnly)).toLocaleString('pt-BR')}
            </p>
            <div className={`text-xs text-gray-600 space-y-0.5 rounded p-2 ${
              isNaN(selectedMonthOnly) || isNaN(selectedMonthMeta) || selectedMonthOnly <= selectedMonthMeta
                ? 'bg-green-50/50'
                : 'bg-red-50/50'
            }`}>
              <p>Meta do mês: <span className="font-semibold text-gray-900">R${isNaN(selectedMonthMeta) ? '0' : Math.round(selectedMonthMeta).toLocaleString('pt-BR')}</span></p>
              <p>Gasto do mês: <span className="font-semibold text-gray-900">R${isNaN(selectedMonthOnly) ? '0' : Math.round(selectedMonthOnly).toLocaleString('pt-BR')}</span></p>
              <p className="mt-1 pt-1 border-t border-gray-200">
                {isNaN(selectedMonthOnly) || isNaN(selectedMonthMeta) || selectedMonthOnly <= selectedMonthMeta
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
              <p className="text-lg font-bold text-gray-900">{Math.round(calculatedMonthlyActivationTime)}h</p>
            </div>

            {/* Device Details */}
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-600 font-semibold mb-2">Dispositivos Ativos</p>
              <div className="space-y-1 max-h-28 overflow-y-auto">
                {deviceRankings.slice(0, 3).map((device) => (
                  <div
                    key={device.id}
                    onClick={() => onSelectDevice && onSelectDevice(device.id)}
                    className="flex items-center gap-2 text-xs bg-gray-50 p-2 rounded hover:bg-teal-50 cursor-pointer transition-colors"
                  >
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

export default memo(FinancialDashboard);
