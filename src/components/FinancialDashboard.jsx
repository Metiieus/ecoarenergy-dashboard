import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Calendar, TrendingDown, Edit2, Check, TrendingUp, Clock, Zap, Leaf } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import GaugeChart from 'react-gauge-chart';
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { deviceRankings } from '../data/mockData';
import { useApiDataContext } from '../context/ApiDataContext';

// Utility function to ensure no negative values
const ensureNonNegative = (value) => Math.max(0, Number(value) || 0);

const FinancialDashboard = ({ selectedEstablishment, onSelectDevice }) => {
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Metas por mês - permite diferentes metas para cada mês
  const [monthlyMetaValues, setMonthlyMetaValues] = useState({
    0: 10000, 1: 10000, 2: 10000, 3: 10000, 4: 10000, 5: 10000,
    6: 10000, 7: 10000, 8: 10000, 9: 10000, 10: 10000, 11: 10000
  });

  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);

  const handleMonthChange = (monthIndex) => {
    setSelectedMonthIndex(monthIndex);
    setCostInputValue(monthlyMetaValues[monthIndex].toString());
    if (monthIndex !== currentMonthIndex) {
      setPeriodFilter('monthly');
    }
  };

  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [costInputValue, setCostInputValue] = useState(monthlyMetaValues[currentMonthIndex].toString());

  const [activationTimeMeta, setActivationTimeMeta] = useState(50);
  const [isEditingActivationMeta, setIsEditingActivationMeta] = useState(false);
  const [activationTimeInputValue, setActivationTimeInputValue] = useState('50');
  const [monthlyActivationTime, setMonthlyActivationTime] = useState(48.5);
  const [monthlyCostData, setMonthlyCostData] = useState([]);

  const { apiData, loading, error } = useApiDataContext();

  const monthlyCostDataMemo = useMemo(() => {
    if (apiData && Array.isArray(apiData.consumo_mensal) && apiData.consumo_mensal.length > 0) {
      let consumoAcumulado = 0;
      return apiData.consumo_mensal.map((consumoMensal, index) => {
        const valorMensal = ensureNonNegative(consumoMensal);
        consumoAcumulado += valorMensal;
        const consumoPrevisto = valorMensal * 0.85;
        const consumoSemSistema = apiData.consumo_sem_sistema_mensal?.[index] && apiData.consumo_sem_sistema_mensal[index] > 0
          ? ensureNonNegative(apiData.consumo_sem_sistema_mensal[index])
          : valorMensal / 0.8;

        return {
          month: monthNames[index],
          consumed: Math.round(ensureNonNegative(valorMensal)),
          ecoAir: Math.round(ensureNonNegative(valorMensal)),
          previsto: Math.round(ensureNonNegative(consumoPrevisto)),
          consumoSemSistema: Math.round(ensureNonNegative(consumoSemSistema)),
          consumoAcumulado: Math.round(ensureNonNegative(consumoAcumulado)),
          isSelected: index === selectedMonthIndex
        };
      });
    }

    const mockData = [
      { month: 'Jan', consumed: 257, ecoAir: 206, previsto: 218, consumoAcumulado: 257, consumoSemSistema: 321 },
      { month: 'Fev', consumed: 825, ecoAir: 660, previsto: 701, consumoAcumulado: 1082, consumoSemSistema: 1031 },
      { month: 'Mar', consumed: 1959, ecoAir: 1567, previsto: 1666, consumoAcumulado: 3041, consumoSemSistema: 2449 },
      { month: 'Abr', consumed: 3029, ecoAir: 2423, previsto: 2575, consumoAcumulado: 6070, consumoSemSistema: 3786 },
      { month: 'Mai', consumed: 2931, ecoAir: 2345, previsto: 2491, consumoAcumulado: 9001, consumoSemSistema: 3664 },
      { month: 'Jun', consumed: 1811, ecoAir: 1449, previsto: 1539, consumoAcumulado: 10812, consumoSemSistema: 2264 },
      { month: 'Jul', consumed: 1822, ecoAir: 1458, previsto: 1549, consumoAcumulado: 12634, consumoSemSistema: 2278 },
      { month: 'Ago', consumed: 1957, ecoAir: 1566, previsto: 1664, consumoAcumulado: 14591, consumoSemSistema: 2446 },
      { month: 'Set', consumed: 1397, ecoAir: 1118, previsto: 1188, consumoAcumulado: 15988, consumoSemSistema: 1746 },
      { month: 'Out', consumed: 2603, ecoAir: 2082, previsto: 2212, consumoAcumulado: 18591, consumoSemSistema: 3254 },
      { month: 'Nov', consumed: 0, ecoAir: 0, previsto: 0, consumoAcumulado: 18591, consumoSemSistema: 0 },
      { month: 'Dez', consumed: 0, ecoAir: 0, previsto: 0, consumoAcumulado: 18591, consumoSemSistema: 0 }
    ];

    return mockData;
  }, [apiData?.consumo_mensal]);

  useEffect(() => {
    setMonthlyCostData(monthlyCostDataMemo);
  }, [monthlyCostDataMemo]);

  const { totalConsumptionYear, totalEconomyYear, economyPieData, monthComparisonPercent } = useMemo(() => {
    const totalConsumption = monthlyCostData.length > 0
      ? monthlyCostData[monthlyCostData.length - 1]?.consumoAcumulado || 0
      : 0;

    const totalConsumptionWithSystem = monthlyCostData.length > 0
      ? monthlyCostData.reduce((sum, month) => sum + ensureNonNegative(month?.consumed || 0), 0)
      : 0;

    const totalConsumptionWithoutSystem = monthlyCostData.length > 0
      ? monthlyCostData.reduce((sum, month) => sum + ensureNonNegative(month?.consumoSemSistema || 0), 0)
      : 0;

    const totalEconomy = ensureNonNegative(totalConsumptionWithoutSystem - totalConsumptionWithSystem);

    // Calcular comparação com mês anterior
    let monthComparisonPercent = 0;
    if (selectedMonthIndex > 0 && monthlyCostData.length > selectedMonthIndex) {
      const currentMonthConsumption = ensureNonNegative(monthlyCostData[selectedMonthIndex]?.consumed || 0);
      const previousMonthConsumption = ensureNonNegative(monthlyCostData[selectedMonthIndex - 1]?.consumed || 0);
      if (previousMonthConsumption > 0) {
        monthComparisonPercent = ((previousMonthConsumption - currentMonthConsumption) / previousMonthConsumption) * 100;
      }
    }

    const pieData = [
      { name: 'Consumo com Sistema', value: Math.max(totalConsumptionWithSystem, 1), fill: '#10b981' },
      { name: 'Consumo sem Sistema', value: Math.max(totalConsumptionWithoutSystem, 1), fill: '#dc2626' }
    ];

    return {
      totalConsumptionYear: totalConsumption,
      totalEconomyYear: totalEconomy,
      economyPieData: pieData,
      monthComparisonPercent
    };
  }, [monthlyCostData, selectedMonthIndex]);

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

  const actualCurrentMonthIndex = new Date().getMonth();
  const selectedMonthData = monthlyCostData[selectedMonthIndex];

  const selectedMonthWithoutSystem = ensureNonNegative(selectedMonthData?.consumoSemSistema || 0);
  const selectedMonthWithSystem = ensureNonNegative(selectedMonthData?.consumed || 0);
  const selectedMonthSavings = ensureNonNegative(selectedMonthWithoutSystem - selectedMonthWithSystem);
  const selectedMonthMeta = monthlyMetaValues[selectedMonthIndex] || 10000;

  const currentMonthAccumulated = monthlyCostData.length > 0
    ? monthlyCostData.slice(0, actualCurrentMonthIndex + 1).reduce((sum, month) => sum + ensureNonNegative(month?.consumed || 0), 0)
    : 0;

  const calculatedMonthlyActivationTime = apiData && apiData.minutos_desligado_mensal && apiData.minutos_desligado_mensal.length > 0
    ? Math.max(0, 720 - (apiData.minutos_desligado_mensal[selectedMonthIndex] || 0) / 60)
    : monthlyActivationTime;

  const yearOverYearGrowth = 12;

  const dailyCostData = useMemo(() => {
    if (selectedMonthIndex === currentMonthIndex) {
      return apiData && Array.isArray(apiData.consumo_diario_mes_corrente)
        ? apiData.consumo_diario_mes_corrente.map((consumoDiario, index) => ({
            day: `D${index + 1}`,
            consumed: Math.round(ensureNonNegative(consumoDiario)),
            ecoAir: Math.round(ensureNonNegative(consumoDiario)),
            previsto: Math.round(ensureNonNegative(consumoDiario * 0.85)),
            consumoSemSistema: Math.round(ensureNonNegative(apiData.consumo_sem_sistema_diario?.[index] && apiData.consumo_sem_sistema_diario[index] > 0 ? apiData.consumo_sem_sistema_diario[index] : consumoDiario / 0.8))
          }))
        : [];
    }

    if (apiData && Array.isArray(apiData.consumo_mensal) && selectedMonthIndex < apiData.consumo_mensal.length) {
      const monthlyConsumption = ensureNonNegative(apiData.consumo_mensal[selectedMonthIndex]);
      const monthlyWithoutSystem = apiData.consumo_sem_sistema_mensal?.[selectedMonthIndex] && apiData.consumo_sem_sistema_mensal[selectedMonthIndex] > 0
        ? ensureNonNegative(apiData.consumo_sem_sistema_mensal[selectedMonthIndex])
        : monthlyConsumption / 0.8;
      const daysInMonth = new Date(currentYear, selectedMonthIndex + 1, 0).getDate();

      const avgDailyConsumption = monthlyConsumption / daysInMonth;
      const avgDailyWithoutSystem = monthlyWithoutSystem / daysInMonth;

      const dailyData = [];
      for (let i = 0; i < daysInMonth; i++) {
        dailyData.push({
          day: `D${i + 1}`,
          consumed: Math.round(ensureNonNegative(avgDailyConsumption)),
          ecoAir: Math.round(ensureNonNegative(avgDailyConsumption)),
          previsto: Math.round(ensureNonNegative(avgDailyConsumption * 0.85)),
          consumoSemSistema: Math.round(ensureNonNegative(avgDailyWithoutSystem))
        });
      }
      return dailyData;
    }

    return [];
  }, [apiData?.consumo_diario_mes_corrente, apiData?.consumo_sem_sistema_diario, apiData?.consumo_mensal, apiData?.consumo_sem_sistema_mensal, selectedMonthIndex, currentMonthIndex]);

  // ECharts options
  const getMonthlyChartOption = () => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1f2937' },
        formatter: (params) => {
          if (!params || params.length === 0) return '';
          const data = params[0].data;
          let html = `<div style="padding: 8px; font-weight: 600; color: #1f2937;">${params[0].name}</div>`;
          params.forEach((param) => {
            const color = param.color;
            html += `<div style="color: #4b5563; font-size: 12px; margin-top: 4px;">
              <span style="display: inline-block; width: 8px; height: 8px; background: ${color}; border-radius: 50%; margin-right: 6px;"></span>
              ${param.seriesName}: <span style="font-weight: 600;">R$ ${param.value.toLocaleString('pt-BR')}</span>
            </div>`;
          });
          return html;
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        top: '15%',
        bottom: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: monthlyCostData.map(d => d.month),
        axisLine: { lineStyle: { color: '#d1d5db' } },
        axisLabel: { color: '#6b7280', fontSize: 11 },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#d1d5db' } },
        axisLabel: { color: '#6b7280', fontSize: 11 },
        splitLine: { lineStyle: { color: '#f3f4f6' } }
      },
      legend: {
        data: ['Consumo com Sistema', 'Consumo sem Sistema', 'Meta Mensal'],
        top: 0,
        textStyle: { color: '#6b7280', fontSize: 12 }
      },
      series: [
        {
          name: 'Consumo com Sistema',
          data: monthlyCostData.map(d => ensureNonNegative(d.consumed)),
          type: 'bar',
          itemStyle: { color: '#10b981', borderRadius: [8, 8, 0, 0], shadowColor: 'rgba(16, 185, 129, 0.3)', shadowBlur: 4, shadowOffsetY: 2 },
          emphasis: { itemStyle: { color: '#059669', shadowBlur: 8 } }
        },
        {
          name: 'Consumo sem Sistema',
          data: monthlyCostData.map(d => ensureNonNegative(d.consumoSemSistema)),
          type: 'bar',
          itemStyle: { color: '#ef4444', borderRadius: [8, 8, 0, 0], shadowColor: 'rgba(239, 68, 68, 0.3)', shadowBlur: 4, shadowOffsetY: 2 },
          emphasis: { itemStyle: { color: '#dc2626', shadowBlur: 8 } }
        },
        {
          name: 'Meta Mensal',
          data: monthlyCostData.map(() => ensureNonNegative(selectedMonthMeta)),
          type: 'line',
          smooth: false,
          lineStyle: { width: 2, color: '#f59e0b', type: 'dashed' },
          itemStyle: { color: '#f59e0b' },
          symbolSize: 4,
          emphasis: { itemStyle: { borderWidth: 2 } }
        }
      ]
    };
  };

  const getDailyChartOption = () => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1f2937' }
      },
      grid: {
        left: '5%',
        right: '5%',
        top: '15%',
        bottom: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dailyCostData.map(d => d.day),
        axisLine: { lineStyle: { color: '#d1d5db' } },
        axisLabel: { color: '#6b7280', fontSize: 10 },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#d1d5db' } },
        axisLabel: { color: '#6b7280', fontSize: 11 },
        splitLine: { lineStyle: { color: '#f3f4f6' } }
      },
      series: [
        {
          name: 'Consumo com Sistema',
          data: dailyCostData.map(d => ensureNonNegative(d.consumed)),
          type: 'bar',
          
          itemStyle: { color: '#10b981' },
          
          
          emphasis: { itemStyle: { borderWidth: 2 } }
        },
        {
          name: 'Consumo sem Sistema',
          data: dailyCostData.map(d => ensureNonNegative(d.consumoSemSistema)),
          type: 'bar',
          
          itemStyle: { color: '#ef4444' },
          
          
          emphasis: { itemStyle: { borderWidth: 2 } }
        }
      ]
    };
  };

  const getPieChartOption = () => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1f2937' },
        formatter: '{b}: R$ {c}'
      },
      series: [
        {
          name: 'Economia',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          data: economyPieData,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            formatter: '{b}\nR$ {c}',
            color: '#1f2937',
            fontSize: 11
          }
        }
      ]
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Row - Reorganizado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {/* Meta Card */}
        <div className="space-y-3">
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

          {/* Valor Acumulado Card */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Valor Acumulado</p>
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              R${ensureNonNegative(selectedMonthWithSystem).toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-gray-500">Consumo do mês - {monthNames[selectedMonthIndex]}</p>
          </div>
        </div>

        {/* Economia Total do Ano - Gauge Chart (Velocímetro) */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow col-span-1 sm:col-span-2 flex flex-col h-auto sm:h-96">
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Economia Ano</p>
            <p className="text-xs text-gray-500 mt-1">Percentual de Economia Alcançado</p>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 overflow-hidden">
            <div className="flex-shrink-0 w-48 h-48 sm:w-72 sm:h-72 flex items-center justify-center">
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GaugeChart
                  id="economia-gauge"
                  nrOfLevels={5}
                  colors={['#ef4444', '#f97316', '#eab308', '#84cc16', '#10b981']}
                  arcPadding={0.1}
                  percent={Math.min(totalEconomyYear / totalConsumptionYear, 1)}
                  textColor="#1f2937"
                  needleColor="#1f2937"
                  needleBaseColor="#1f2937"
                  arcWidth={0.3}
                  hideText={false}
                />
              </div>
            </div>
            <div className="space-y-6 flex-shrink-0">
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">Consumo Total</p>
                <p className="text-3xl font-bold text-gray-900">R$ {ensureNonNegative(totalConsumptionYear / 1000).toFixed(1)}k</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">Economia Alcançada</p>
                <p className="text-3xl font-bold text-green-600">R$ {ensureNonNegative(totalEconomyYear / 1000).toFixed(1)}k</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">Taxa de Economia</p>
                <p className="text-2xl font-bold text-teal-600">{(Math.min(totalEconomyYear / totalConsumptionYear, 1) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mês Selecionado Card */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 shadow-md border border-blue-200 hover:shadow-lg transition-shadow h-fit col-span-1 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">{monthNames[selectedMonthIndex]}</p>
            <select
              value={selectedMonthIndex}
              onChange={(e) => {
                const newIndex = parseInt(e.target.value);
                handleMonthChange(newIndex);
              }}
              className="text-xs px-2 py-1 border border-blue-300 rounded bg-white text-gray-700 hover:border-blue-500 transition-colors appearance-none cursor-pointer"
            >
              {monthNames.map((name, index) => (
                <option key={index} value={String(index)}>{name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3 space-y-2">
            <div>
              <p className="text-xs text-gray-600 mb-1">Consumo sem Sistema</p>
              <p className="text-2xl font-bold text-gray-900">R${ensureNonNegative(selectedMonthWithoutSystem).toLocaleString('pt-BR')}</p>
            </div>
            <div className="border-t border-blue-200 pt-2">
              <p className="text-xs text-gray-600 mb-1">Valor Real (com Eco Air)</p>
              <div className="flex items-baseline gap-2">
                <p className="text-lg font-bold text-blue-600">R${ensureNonNegative(selectedMonthWithSystem).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50/50 rounded p-2 space-y-1">
            <p className="text-xs text-gray-600">Meta: <span className="font-semibold text-gray-900">R${ensureNonNegative(selectedMonthMeta).toLocaleString('pt-BR')}</span></p>
            <p className="text-xs text-gray-600">Economia: <span className="font-semibold text-green-600">R${ensureNonNegative(selectedMonthSavings).toLocaleString('pt-BR')}</span></p>
          </div>
        </div>

        {/* % vs Mês Anterior */}
        <div className={`bg-gradient-to-br rounded-lg p-5 shadow-md border text-white flex flex-col justify-center hover:shadow-lg transition-shadow h-fit ${
          monthComparisonPercent >= 0
            ? 'from-green-500 to-green-600 border-green-700/20'
            : 'from-red-500 to-red-600 border-red-700/20'
        }`}>
          <p className="text-3xl font-bold mb-1 text-center">{Math.abs(monthComparisonPercent).toFixed(1)}%</p>
          <p className="text-xs font-semibold text-center leading-tight">
            {monthComparisonPercent >= 0 ? '↓ Redução' : '↑ Aumento'} vs Mês Anterior
          </p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Large Graph Section */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-bold text-gray-900 mb-1">
            Gráfico {periodFilter === 'monthly' ? 'Mensal' : 'Diário'}
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            {periodFilter === 'monthly' ? 'Consumo para o Ano Atual' : 'Consumo para o Mês Atual'}
          </p>

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto mb-3"></div>
                <p className="text-xs text-gray-600">Carregando dados da API...</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-red-600 mb-2">Erro ao carregar dados</p>
                <p className="text-xs text-gray-500">{error}</p>
              </div>
            </div>
          ) : periodFilter === 'monthly' ? (
            monthlyCostData.length > 0 ? (
              <div style={{ width: '100%', height: '350px' }}>
                <ReactECharts option={getMonthlyChartOption()} style={{ width: '100%', height: '100%' }} />
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500">
                <p>Nenhum dado disponível</p>
              </div>
            )
          ) : dailyCostData.length > 0 ? (
            <div style={{ width: '100%', height: '350px' }}>
              <ReactECharts option={getDailyChartOption()} style={{ width: '100%', height: '100%' }} />
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-3">
          {/* Status Card */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-700 uppercase">Status</p>
              <Leaf className="w-4 h-4 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${selectedMonthWithSystem <= selectedMonthMeta ? 'bg-green-600' : 'bg-red-600'}`}></div>
                <p className={`text-xs font-semibold ${selectedMonthWithSystem <= selectedMonthMeta ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedMonthWithSystem <= selectedMonthMeta ? '✓ Dentro da meta' : '✗ Acima da meta'}
                </p>
              </div>
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

          {/* Activation Time */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                <p className="text-xs font-bold text-gray-700 uppercase">Tempo de Atuação</p>
              </div>
            </div>
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
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-600 font-semibold">Atuação do Mês</p>
              <p className="text-lg font-bold text-gray-900">{Math.round(ensureNonNegative(calculatedMonthlyActivationTime))}h</p>
            </div>
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