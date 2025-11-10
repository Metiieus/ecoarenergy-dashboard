import { useState, useEffect, useMemo, memo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { Calendar, TrendingDown, Edit2, Check, TrendingUp, Clock, Zap, Leaf } from 'lucide-react';
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { deviceRankings } from '../data/mockData';
import { useApiDataContext } from '../context/ApiDataContext';

const FinancialDashboard = ({ selectedEstablishment, onSelectDevice }) => {
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

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

  const formatBRL = (v) => {
    const num = Number(v);
    if (!isFinite(num) || isNaN(num)) return '0,00';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const monthlyCostDataMemo = useMemo(() => {
    if (apiData && Array.isArray(apiData.consumo_mensal) && apiData.consumo_mensal.length > 0) {
      let consumoAcumulado = 0;
      return apiData.consumo_mensal.map((consumoMensal, index) => {
        const valorMensal = Math.max(0, Number(consumoMensal) || 0);
        consumoAcumulado += valorMensal;
        const consumoPrevisto = valorMensal * 0.85;
        const consumoSemSistema = Array.isArray(apiData.consumo_sem_sistema_mensal) && apiData.consumo_sem_sistema_mensal[index] > 0
          ? Math.max(0, Number(apiData.consumo_sem_sistema_mensal[index]))
          : Math.max(0, valorMensal / 0.8);

        const metaValue = monthlyMetaValues[index] ?? monthlyMetaValues[currentMonthIndex] ?? 10000;

        return {
          month: monthNames[index],
          consumed: valorMensal,
          ecoAir: valorMensal,
          previsto: consumoPrevisto,
          consumoSemSistema: consumoSemSistema,
          consumoAcumulado: consumoAcumulado,
          meta: metaValue,
          isSelected: index === selectedMonthIndex
        };
      });
    }

    const mockData = [
      { month: 'Jan', consumed: 257, ecoAir: 206, previsto: 218, consumoAcumulado: 257, consumoSemSistema: 321, meta: monthlyMetaValues[0] || 10000 },
      { month: 'Fev', consumed: 825, ecoAir: 660, previsto: 701, consumoAcumulado: 1082, consumoSemSistema: 1031, meta: monthlyMetaValues[1] || 10000 },
      { month: 'Mar', consumed: 1959, ecoAir: 1567, previsto: 1666, consumoAcumulado: 3041, consumoSemSistema: 2449, meta: monthlyMetaValues[2] || 10000 },
      { month: 'Abr', consumed: 3029, ecoAir: 2423, previsto: 2575, consumoAcumulado: 6070, consumoSemSistema: 3786, meta: monthlyMetaValues[3] || 10000 },
      { month: 'Mai', consumed: 2931, ecoAir: 2345, previsto: 2491, consumoAcumulado: 9001, consumoSemSistema: 3664, meta: monthlyMetaValues[4] || 10000 },
      { month: 'Jun', consumed: 1811, ecoAir: 1449, previsto: 1539, consumoAcumulado: 10812, consumoSemSistema: 2264, meta: monthlyMetaValues[5] || 10000 },
      { month: 'Jul', consumed: 1822, ecoAir: 1458, previsto: 1549, consumoAcumulado: 12634, consumoSemSistema: 2278, meta: monthlyMetaValues[6] || 10000 },
      { month: 'Ago', consumed: 1957, ecoAir: 1566, previsto: 1664, consumoAcumulado: 14591, consumoSemSistema: 2446, meta: monthlyMetaValues[7] || 10000 },
      { month: 'Set', consumed: 1397, ecoAir: 1118, previsto: 1188, consumoAcumulado: 15988, consumoSemSistema: 1746, meta: monthlyMetaValues[8] || 10000 },
      { month: 'Out', consumed: 2603, ecoAir: 2082, previsto: 2212, consumoAcumulado: 18591, consumoSemSistema: 3254, meta: monthlyMetaValues[9] || 10000 },
      { month: 'Nov', consumed: 0, ecoAir: 0, previsto: 0, consumoAcumulado: 18591, consumoSemSistema: 0, meta: monthlyMetaValues[10] || 10000 },
      { month: 'Dez', consumed: 0, ecoAir: 0, previsto: 0, consumoAcumulado: 18591, consumoSemSistema: 0, meta: monthlyMetaValues[11] || 10000 }
    ];

    return mockData;
  }, [apiData?.consumo_mensal, selectedMonthIndex, monthlyMetaValues]);

  useEffect(() => {
    const sanitize = (arr) => (arr || []).map(item => ({
      ...item,
      consumed: Math.max(0, Number(item.consumed) || 0),
      ecoAir: Math.max(0, Number(item.ecoAir) || 0),
      previsto: Math.max(0, Number(item.previsto) || 0),
      consumoSemSistema: Math.max(0, Number(item.consumoSemSistema) || 0),
      consumoAcumulado: Math.max(0, Number(item.consumoAcumulado) || 0),
      meta: Math.max(0, Number(item.meta) || 0)
    }));

    setMonthlyCostData(sanitize(monthlyCostDataMemo));
  }, [monthlyCostDataMemo]);

  const chartMax = useMemo(() => {
    const values = monthlyCostData.length > 0
      ? monthlyCostData.flatMap(m => [Number(m.consumed) || 0, Number(m.consumoSemSistema) || 0, Number(m.meta) || 0])
      : [];
    return values.length > 0 ? Math.max(...values) : 0;
  }, [monthlyCostData]);

  const yAxisMax = Math.ceil(chartMax * 1.15 || 100);

  const monthlyEChartsOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          if (!params || !params.length) return '';
          return params.map(p => `${p.seriesName}: R$ ${Number(p.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`).join('<br/>');
        }
      },
      legend: { bottom: 0, data: ['Consumo Mensal + Sem Sistema (R$)', 'Valor Real (R$)', 'Meta'] },
      grid: { left: '3%', right: '4%', top: '10%', bottom: '18%' },
      xAxis: { type: 'category', data: monthlyCostData.map(m => m.month), axisTick: { alignWithLabel: true }, axisLine: { show: true } },
      yAxis: { type: 'value', min: 0, max: yAxisMax },
      series: [
        {
          name: 'Consumo Mensal + Sem Sistema (R$)',
          type: 'bar',
          data: monthlyCostData.map(m => m.consumoSemSistema || 0),
          itemStyle: {
            color: (params) => monthlyCostData[params.dataIndex]?.isSelected ? '#f87171' : '#fca5a5'
          },
          barGap: 0,
          barWidth: '36%',
          emphasis: { focus: 'series' }
        },
        {
          name: 'Valor Real (R$)',
          type: 'bar',
          data: monthlyCostData.map(m => m.consumed || 0),
          itemStyle: {
            color: (params) => monthlyCostData[params.dataIndex]?.isSelected ? '#34d399' : '#86efac'
          },
          barWidth: '36%'
        },
        {
          name: 'Meta',
          type: 'line',
          data: monthlyCostData.map(m => m.meta || 0),
          smooth: true,
          lineStyle: { color: '#1e40af', width: 3 },
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color: '#1e40af' }
        }
      ]
    };
  }, [monthlyCostData, yAxisMax]);

  // Gauge data computed from monthlyCostData
  const gaugeMeta = useMemo(() => {
    const totalWith = monthlyCostData.length > 0 ? monthlyCostData.reduce((s, m) => s + (m.consumed || 0), 0) : 0;
    const totalWithout = monthlyCostData.length > 0 ? monthlyCostData.reduce((s, m) => s + (m.consumoSemSistema || 0), 0) : 0;
    const economy = Math.max(0, totalWithout - totalWith);
    const percent = totalWithout > 0 ? Math.round((economy / totalWithout) * 100) : 0;
    const displayPercent = Math.min(100, Math.max(0, percent));
    return { totalWith, totalWithout, economy, percent: displayPercent };
  }, [monthlyCostData]);

  const gaugeEChartsOption = useMemo(() => {
    const { percent, economy, totalWithout } = gaugeMeta;
    const displayPercent = Math.min(100, Math.max(0, Number(percent) || 0));
    // Half doughnut (semi-circle) using pie with startAngle 180
    return {
      tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
      legend: { show: false },
      series: [
        {
          name: 'Economia',
          type: 'pie',
          startAngle: 180,
          radius: ['50%', '80%'],
          center: ['50%', '65%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}',
            color: '#374151'
          },
          labelLine: {
            length: 20,
            length2: 8,
            smooth: true
          },
          data: [
            { value: displayPercent, name: 'Economia', itemStyle: { color: '#3b82f6' } },
            { value: 100 - displayPercent, name: 'Restante', itemStyle: { color: '#e5e7eb' } }
          ]
        }
      ]
    };
  }, [gaugeMeta]);

  const { totalConsumptionYear, totalEconomyYear, economyPieData } = useMemo(() => {
    const totalConsumption = monthlyCostData.length > 0
      ? monthlyCostData[monthlyCostData.length - 1]?.consumoAcumulado || 0
      : 0;

    const totalConsumptionWithSystem = monthlyCostData.length > 0
      ? monthlyCostData.reduce((sum, month) => sum + (month?.consumed || 0), 0)
      : 0;

    const totalConsumptionWithoutSystem = monthlyCostData.length > 0
      ? monthlyCostData.reduce((sum, month) => sum + (month?.consumoSemSistema || 0), 0)
      : 0;

    const totalEconomy = Math.max(0, totalConsumptionWithoutSystem - totalConsumptionWithSystem);

    const pieData = [
      { name: 'Consumo com Sistema', value: Math.max(totalConsumptionWithSystem, 1), fill: '#10b981' },
      { name: 'Consumo sem Sistema', value: Math.max(totalConsumptionWithoutSystem, 1), fill: '#dc2626' }
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

  const handleCostInputChange = (e) => setCostInputValue(e.target.value);
  const handleCostKeyPress = (e) => { if (e.key === 'Enter') handleSaveCostMeta(); };
  const handleSaveCostMeta = () => {
    const newValue = parseFloat(costInputValue);
    if (!isNaN(newValue) && newValue > 0) {
      setMonthlyMetaValues({ ...monthlyMetaValues, [selectedMonthIndex]: newValue });
      setIsEditingMeta(false);
    }
  };

  const handleActivationTimeInputChange = (e) => setActivationTimeInputValue(e.target.value);
  const handleActivationTimeKeyPress = (e) => { if (e.key === 'Enter') handleSaveActivationTimeMeta(); };
  const handleSaveActivationTimeMeta = () => {
    const newValue = parseFloat(activationTimeInputValue);
    if (!isNaN(newValue) && newValue > 0) {
      setActivationTimeMeta(newValue);
      setIsEditingActivationMeta(false);
    }
  };

  const actualCurrentMonthIndex = new Date().getMonth();
  const selectedMonthData = monthlyCostData[selectedMonthIndex];
  const selectedMonthWithoutSystem = isNaN(selectedMonthData?.consumoSemSistema) ? 0 : Math.max(0, selectedMonthData?.consumoSemSistema || 0);
  const selectedMonthWithSystem = isNaN(selectedMonthData?.consumed) ? 0 : Math.max(0, selectedMonthData?.consumed || 0);
  const selectedMonthSavings = isNaN(selectedMonthWithoutSystem - selectedMonthWithSystem) ? 0 : Math.max(0, selectedMonthWithoutSystem - selectedMonthWithSystem);
  const selectedMonthMeta = monthlyMetaValues[selectedMonthIndex] || 10000;
  const currentMonthAccumulated = monthlyCostData.length > 0
    ? monthlyCostData.slice(0, actualCurrentMonthIndex + 1).reduce((sum, month) => sum + (month?.consumed || 0), 0)
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
            consumed: Number(consumoDiario) || 0,
            ecoAir: Number(consumoDiario) || 0,
            previsto: (Number(consumoDiario) || 0) * 0.85,
            consumoSemSistema: (Array.isArray(apiData.consumo_sem_sistema_diario) && apiData.consumo_sem_sistema_diario[index] > 0)
              ? Math.max(0, Number(apiData.consumo_sem_sistema_diario[index]))
              : Math.max(0, (Number(consumoDiario) || 0) / 0.8)
          }))
        : [];
    }

    if (apiData && Array.isArray(apiData.consumo_mensal) && selectedMonthIndex < apiData.consumo_mensal.length) {
      const monthlyConsumptionRaw = apiData.consumo_mensal[selectedMonthIndex];
      const monthlyConsumption = Math.max(0, Number(monthlyConsumptionRaw) || 0);
      const monthlyWithoutSystem = (Array.isArray(apiData.consumo_sem_sistema_mensal) && apiData.consumo_sem_sistema_mensal[selectedMonthIndex] > 0)
        ? Math.max(0, Number(apiData.consumo_sem_sistema_mensal[selectedMonthIndex]))
        : Math.max(0, monthlyConsumption / 0.8);
      const daysInMonth = new Date(currentYear, selectedMonthIndex + 1, 0).getDate();

      const avgDailyConsumption = daysInMonth > 0 ? monthlyConsumption / daysInMonth : 0;
      const avgDailyWithoutSystem = daysInMonth > 0 ? monthlyWithoutSystem / daysInMonth : 0;

      const dailyData = [];
      for (let i = 0; i < daysInMonth; i++) {
        dailyData.push({
          day: `D${i + 1}`,
          consumed: avgDailyConsumption,
          ecoAir: avgDailyConsumption,
          previsto: avgDailyConsumption * 0.85,
          consumoSemSistema: avgDailyWithoutSystem
        });
      }
      return dailyData;
    }

    return [];
  }, [apiData?.consumo_diario_mes_corrente, apiData?.consumo_sem_sistema_diario, apiData?.consumo_mensal, apiData?.consumo_sem_sistema_mensal, selectedMonthIndex, currentMonthIndex]);

  const dailyEChartsOption = useMemo(() => ({
    tooltip: { trigger: 'axis', formatter: (params) => params.map(p => `${p.seriesName}: R$ ${Number(p.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`).join('<br/>') },
    legend: { bottom: 0 },
    grid: { left: '3%', right: '4%', top: '10%', bottom: '18%' },
    xAxis: { type: 'category', data: dailyCostData.map(d => d.day), axisTick: { alignWithLabel: true } },
    yAxis: { type: 'value', min: 0, max: yAxisMax },
    series: [
      { name: 'Consumo Sem Sistema (R$)', type: 'bar', data: dailyCostData.map(d => d.consumoSemSistema || 0), itemStyle: { color: '#fca5a5' }, barWidth: '40%' },
      { name: 'Valor Real (R$)', type: 'bar', data: dailyCostData.map(d => d.consumed || 0), itemStyle: { color: '#86efac' }, barWidth: '40%' }
    ]
  }), [dailyCostData, yAxisMax]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const consumed = Number(data.consumed) || 0;
      const semSistema = Number(data.consumoSemSistema) || 0;
      const monthIndex = data.month ? monthNames.indexOf(data.month) : selectedMonthIndex;
      const monthMeta = monthlyMetaValues[monthIndex] || 10000;
      const deviation = monthMeta - consumed;
      const deviationPercent = monthMeta > 0 ? ((deviation / monthMeta) * 100).toFixed(1) : 0;

      return (
        <div className="tooltip-card">
          <p className="tooltip-title">{data.month || 'Dia'} {data.day || ''}</p>
          <p className="tooltip-line">Consumo (sem sistema): <span className="tooltip-strong">R$ {formatBRL(semSistema)}</span></p>
          <p className="tooltip-line">Valor Real: <span className="tooltip-strong">R$ {formatBRL(consumed)}</span></p>
          <p className="tooltip-line">Meta: <span className="tooltip-strong">R$ {formatBRL(monthMeta)}</span></p>
          <div className="tooltip-divider">
            <p className={`tooltip-deviation ${deviation >= 0 ? 'positive' : 'negative'}`}>Desvio: R$ {formatBRL(isNaN(deviation) ? 0 : deviation)} ({deviationPercent}%)</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => {
    const legendItems = [
      { key: 'consumoSemSistema', label: 'Consumo Mensal + Sem Sistema (R$)', color: '#fca5a5' },
      { key: 'consumed', label: 'Valor Real (R$)', color: '#34d399' }
    ];

    return (
      <div className="legend-row">
        {legendItems.map(item => (
          <div key={item.key} className="legend-item">
            <span className="legend-color" style={{ background: item.color }}></span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2 items-start">
        <div className="space-y-3">
          <div className="card">
            <div className="card-header">
              <p className="card-subtitle">Meta - {monthNames[selectedMonthIndex]}</p>
              <TrendingDown className="w-4 h-4 text-green-600" />
            </div>
            <div className="card-value">
              {isEditingMeta ? (
                <div className="meta-edit">
                  <input
                    autoFocus
                    type="number"
                    value={costInputValue}
                    onChange={handleCostInputChange}
                    onKeyPress={handleCostKeyPress}
                    className="meta-input"
                  />
                  <button onClick={handleSaveCostMeta} className="meta-save">
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="meta-display">
                  <span>R${selectedMonthMeta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <button onClick={() => { setCostInputValue(selectedMonthMeta.toString()); setIsEditingMeta(true); }} className="meta-edit-btn">
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <p className="card-subtitle">Valor Acumulado</p>
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <p className="card-large">R${formatBRL(selectedMonthWithSystem)}</p>
            <p className="card-note">Consumo do mês - {monthNames[selectedMonthIndex]}</p>
          </div>
        </div>

        <div className="gauge-card col-span-2">
          <div>
            <p className="card-title">Economia Ano</p>
            <p className="card-note">Consumo vs Economia</p>
          </div>
          <div className="gauge-content">
            <div className="gauge-widget">
              <ReactECharts option={gaugeEChartsOption} echarts={echarts} className="echarts-widget echarts-gauge" />
              <div className="gauge-center">
                <div className="gauge-label">Economia</div>
                <div className="gauge-value">R$ {formatBRL(gaugeMeta?.economy ?? 0)}</div>
                <div className="gauge-percent">{gaugeMeta?.percent ?? 0}%</div>
              </div>
            </div>
            <div className="gauge-stats">
              <div>
                <p className="stat-sub">Consumo Total</p>
                <p className="stat-value">R$ {isNaN(totalConsumptionYear) ? '0' : (totalConsumptionYear / 1000).toFixed(1)}k</p>
              </div>
              <div>
                <p className="stat-sub">Economia Alcançada</p>
                <p className="stat-value stat-positive">R$ {isNaN(totalEconomyYear) ? '0' : (totalEconomyYear / 1000).toFixed(1)}k</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card gradient-card">
          <div className="card-header">
            <p className="card-subtitle">{monthNames[selectedMonthIndex]}</p>
            <select value={selectedMonthIndex} onChange={(e) => { const newIndex = parseInt(e.target.value); handleMonthChange(newIndex); }} className="month-select">
              {monthNames.map((name, index) => (
                <option key={index} value={String(index)}>{name}</option>
              ))}
            </select>
          </div>
          <div className="card-note mt-3">
            <p className="text-xs text-gray-600 mb-1">Valor Real (com Ecoar)</p>
            <div className="flex items-baseline gap-2">
              <p className="card-large text-blue">R${formatBRL(selectedMonthWithSystem)}</p>
            </div>
          </div>

          <div className="meta-box">
            <p className="meta-box-line">Meta: <span className="meta-box-strong">R${formatBRL(selectedMonthMeta)}</span></p>
            <p className="meta-box-line">Economia: <span className="meta-box-strong">R${formatBRL(selectedMonthSavings)}</span></p>
          </div>

          <div className={`meta-deviation mt-3 ${isNaN(selectedMonthWithSystem) || isNaN(selectedMonthMeta) || selectedMonthWithSystem <= selectedMonthMeta ? 'deviation-positive' : 'deviation-negative'}`}>
            <div className="meta-deviation-header">
              <p className="meta-deviation-title">Desvio Meta</p>
              {isNaN(selectedMonthWithSystem) || isNaN(selectedMonthMeta) || selectedMonthWithSystem <= selectedMonthMeta ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            <p className={`meta-deviation-value ${isNaN(selectedMonthWithSystem) || isNaN(selectedMonthMeta) || selectedMonthWithSystem <= selectedMonthMeta ? 'text-green-600' : 'text-red-600'}`}>
              R${formatBRL(Math.abs(selectedMonthMeta - selectedMonthWithSystem))}
            </p>
            <div className="meta-deviation-details">
              <p>Meta do mês: <span className="meta-strong">R${isNaN(selectedMonthMeta) ? '0' : Math.round(selectedMonthMeta).toLocaleString('pt-BR')}</span></p>
              <p>Gasto do mês: <span className="meta-strong">R${isNaN(selectedMonthWithSystem) ? '0' : Math.round(selectedMonthWithSystem).toLocaleString('pt-BR')}</span></p>
              <p className="mt-1 pt-1 border-top">{isNaN(selectedMonthWithSystem) || isNaN(selectedMonthMeta) || selectedMonthWithSystem <= selectedMonthMeta ? '✓ Dentro da meta' : '✗ Acima da meta'}</p>
            </div>
          </div>
        </div>

        <div className="card small-stats">
          <p className="large-number">{yearOverYearGrowth}%</p>
          <p className="small-note">Em Relação ao Ano Passado</p>
        </div>
      </div>

      <div className="info-bar">
        <div className="info-left">
          <div className="unit-badge">E</div>
          <div>
            <p className="info-title">Unidade {selectedEstablishment}</p>
            <p className="info-sub">Reais (R$)</p>
          </div>
        </div>

        <div className="info-right">
          <span className="info-period">Período:</span>
          <div className="period-buttons">
            <UITooltip>
              <TooltipTrigger asChild>
                <button onClick={() => setPeriodFilter('monthly')} className={`period-btn ${periodFilter === 'monthly' ? 'active' : ''}`}>
                  <Calendar className="w-3 h-3" />
                  <span>Mensal</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Visualizar dados por mês</TooltipContent>
            </UITooltip>
            <UITooltip>
              <TooltipTrigger asChild>
                <button onClick={() => setPeriodFilter('daily')} className={`period-btn ${periodFilter === 'daily' ? 'active' : ''}`}>
                  <Calendar className="w-3 h-3" />
                  <span>Diário</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Visualizar dados por dia</TooltipContent>
            </UITooltip>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 card">
          <h3 className="chart-title">Gráfico {periodFilter === 'monthly' ? 'Mensal' : 'Diário'}</h3>
          <p className="chart-sub">{periodFilter === 'monthly' ? 'Consumo para o Ano Atual' : 'Consumo para o Mês Atual'}</p>

          {loading ? (
            <div className="loading-placeholder">
              <div className="spinner" />
              <p className="loading-text">Carregando dados da API...</p>
            </div>
          ) : error ? (
            <div className="loading-placeholder">
              <p className="text-xs text-red-600 mb-2">Erro ao carregar dados</p>
              <p className="text-xs text-gray-500">{error}</p>
            </div>
          ) : periodFilter === 'monthly' ? (
            monthlyCostData.length > 0 ? (
              <div className="chart-area">
                <ReactECharts option={monthlyEChartsOption} echarts={echarts} className="echarts-widget" />
              </div>
            ) : (
              <div className="empty-placeholder">Nenhum dado disponível</div>
            )
          ) : (
            <div>
              {selectedMonthIndex !== currentMonthIndex && (
                <div className="info-simulated">Exibindo dados simulados para <strong>{monthNames[selectedMonthIndex]}</strong>. Dados reais disponíveis apenas para o mês atual.</div>
              )}
              {dailyCostData.length > 0 ? (
                <div className="chart-area">
                  <ReactECharts option={dailyEChartsOption} echarts={echarts} className="echarts-widget" />
                </div>
              ) : (
                <div className="empty-placeholder">Nenhum dado disponível para este mês</div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="card small-card">
            <p className="small-card-title">Mês / Metas / Atualiz.</p>
            <div>
              {updateTable.map((item, index) => (
                <div key={index} className="update-row">
                  <span className="update-month">{item.month}</span>
                  <span className="update-value">{item.value}</span>
                  <span className="update-update">{item.atualização}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                <p className="card-subtitle">Tempo de Atuação</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-600 font-semibold">Meta Mensal (h)</p>
              <div className="flex items-center gap-2">
                {isEditingActivationMeta ? (
                  <>
                    <input autoFocus type="number" value={activationTimeInputValue} onChange={handleActivationTimeInputChange} onKeyPress={handleActivationTimeKeyPress} className="meta-input" />
                    <button onClick={handleSaveActivationTimeMeta} className="meta-save"><Check className="w-3 h-3" /></button>
                  </>
                ) : (
                  <>
                    <p className="card-large">{activationTimeMeta}h</p>
                    <button onClick={() => { setActivationTimeInputValue(activationTimeMeta.toString()); setIsEditingActivationMeta(true); }} className="meta-edit-btn"><Edit2 className="w-3 h-3" /></button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2 border-top pt-3">
              <p className="text-xs text-gray-600 font-semibold">Atuação do Mês</p>
              <p className="card-large">{Math.round(calculatedMonthlyActivationTime)}h</p>
            </div>

            <div className="space-y-2 border-top pt-3">
              <p className="text-xs text-gray-600 font-semibold mb-2">Dispositivos Ativos</p>
              <div className="devices-list">
                {deviceRankings.slice(0, 3).map((device) => (
                  <div key={device.id} onClick={() => onSelectDevice && onSelectDevice(device.id)} className="device-row">
                    <span className="device-icon">{device.icon}</span>
                    <div className="device-info">
                      <p className="device-name">{device.name}</p>
                      <p className="device-sub">{device.activeTime}h - Score: {device.score}</p>
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
