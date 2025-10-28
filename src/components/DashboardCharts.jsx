import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Info } from 'lucide-react';
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

const DashboardCharts = ({ selectedEstablishment }) => {
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const [costTarget, setCostTarget] = useState(3000);
  const [costInputValue, setCostInputValue] = useState('3000');
  const [kwhTarget, setKwhTarget] = useState(4200);
  const [kwhInputValue, setKwhInputValue] = useState('4200');

  const pricePerKwh = 0.80;

  // Establishment data mapping for monthly data
  const establishmentMonthlyData = {
    1: [
      { month: 'Jan', consumption: 4000 },
      { month: 'Fev', consumption: 4200 },
      { month: 'Mar', consumption: 3800 },
      { month: 'Abr', consumption: 4500 },
      { month: 'Mai', consumption: 4100 },
      { month: 'Jun', consumption: 3900 },
      { month: 'Jul', consumption: 4300 },
      { month: 'Ago', consumption: 4400 },
      { month: 'Set', consumption: 4000 },
      { month: 'Out', consumption: 4100 },
      { month: 'Nov', consumption: 3950 },
      { month: 'Dez', consumption: 4050 }
    ],
    2: [
      { month: 'Jan', consumption: 3200 },
      { month: 'Fev', consumption: 3400 },
      { month: 'Mar', consumption: 3100 },
      { month: 'Abr', consumption: 3600 },
      { month: 'Mai', consumption: 3300 },
      { month: 'Jun', consumption: 3000 },
      { month: 'Jul', consumption: 3500 },
      { month: 'Ago', consumption: 3700 },
      { month: 'Set', consumption: 3200 },
      { month: 'Out', consumption: 3400 },
      { month: 'Nov', consumption: 3150 },
      { month: 'Dez', consumption: 3300 }
    ],
    3: [
      { month: 'Jan', consumption: 5200 },
      { month: 'Fev', consumption: 5400 },
      { month: 'Mar', consumption: 5100 },
      { month: 'Abr', consumption: 5600 },
      { month: 'Mai', consumption: 5300 },
      { month: 'Jun', consumption: 5000 },
      { month: 'Jul', consumption: 5500 },
      { month: 'Ago', consumption: 5700 },
      { month: 'Set', consumption: 5200 },
      { month: 'Out', consumption: 5400 },
      { month: 'Nov', consumption: 5150 },
      { month: 'Dez', consumption: 5300 }
    ]
  };

  // Daily data for each establishment
  const establishmentDailyData = {
    1: [
      { day: 'Seg', consumption: 450 },
      { day: 'Ter', consumption: 480 },
      { day: 'Qua', consumption: 420 },
      { day: 'Qui', consumption: 510 },
      { day: 'Sex', consumption: 490 },
      { day: 'Sab', consumption: 350 },
      { day: 'Dom', consumption: 320 }
    ],
    2: [
      { day: 'Seg', consumption: 320 },
      { day: 'Ter', consumption: 340 },
      { day: 'Qua', consumption: 310 },
      { day: 'Qui', consumption: 360 },
      { day: 'Sex', consumption: 350 },
      { day: 'Sab', consumption: 280 },
      { day: 'Dom', consumption: 270 }
    ],
    3: [
      { day: 'Seg', consumption: 580 },
      { day: 'Ter', consumption: 610 },
      { day: 'Qua', consumption: 550 },
      { day: 'Qui', consumption: 640 },
      { day: 'Sex', consumption: 620 },
      { day: 'Sab', consumption: 450 },
      { day: 'Dom', consumption: 420 }
    ]
  };

  const baseMonthlyData = establishmentMonthlyData[selectedEstablishment] || establishmentMonthlyData[1];
  const baseDailyData = establishmentDailyData[selectedEstablishment] || establishmentDailyData[1];

  const selectedData = periodFilter === 'monthly' ? baseMonthlyData : baseDailyData;
  const dataKeyName = periodFilter === 'monthly' ? 'month' : 'day';

  const monthlyCostData = baseMonthlyData.map(item => ({
    month: item.month,
    cost: Math.round(item.consumption * pricePerKwh * 100) / 100,
    target: costTarget
  }));

  const monthlyConsumptionData = baseMonthlyData.map(item => ({
    month: item.month,
    consumption: item.consumption,
    target: kwhTarget
  }));

  const dailyCostData = baseDailyData.map(item => ({
    day: item.day,
    cost: Math.round(item.consumption * pricePerKwh * 100) / 100,
    target: costTarget / 30
  }));

  const dailyConsumptionData = baseDailyData.map(item => ({
    day: item.day,
    consumption: item.consumption,
    target: kwhTarget / 30
  }));

  const deviceConsumptionData = [
    { name: 'Bomba CAG', value: 60000 },
    { name: 'Chiller', value: 50000 },
    { name: 'Fancoil', value: 50000 },
    { name: 'Aquecimento', value: 40000 },
    { name: 'Bomba Recalque', value: 40000 },
    { name: 'Bomba Esgoto', value: 40000 }
  ];

  const peakHoursData = [
    { hour: '00:00', power: 2.4 },
    { hour: '04:00', power: 1.8 },
    { hour: '08:00', power: 3.2 },
    { hour: '12:00', power: 4.1 },
    { hour: '16:00', power: 3.8 },
    { hour: '20:00', power: 2.8 },
    { hour: '23:59', power: 2.2 }
  ];

  const COLORS = ['#06b6d4', '#06d6a0', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const handleSaveCostMeta = () => {
    const newValue = parseFloat(costInputValue);
    if (!isNaN(newValue) && newValue > 0) {
      setCostTarget(newValue);
    } else {
      setCostInputValue(costTarget.toString());
    }
  };

  const handleCostInputChange = (e) => {
    setCostInputValue(e.target.value);
  };

  const handleCostKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveCostMeta();
    }
  };

  const handleSaveKwhMeta = () => {
    const newValue = parseFloat(kwhInputValue);
    if (!isNaN(newValue) && newValue > 0) {
      setKwhTarget(newValue);
    } else {
      setKwhInputValue(kwhTarget.toString());
    }
  };

  const handleKwhInputChange = (e) => {
    setKwhInputValue(e.target.value);
  };

  const handleKwhKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveKwhMeta();
    }
  };

  const costChartData = periodFilter === 'monthly' ? monthlyCostData : dailyCostData;
  const consumptionChartData = periodFilter === 'monthly' ? monthlyConsumptionData : dailyConsumptionData;

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex items-center gap-2 bg-white rounded-lg p-2 w-fit border border-gray-200">
        <UITooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setPeriodFilter('monthly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                periodFilter === 'monthly'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

      {/* Monthly Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Cost Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Custo {periodFilter === 'monthly' ? 'Mensal' : 'Semanal'} vs Meta
              </h3>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  Comparação entre o custo real e a meta definida para o período
                </TooltipContent>
              </UITooltip>
            </div>
            <div className="flex items-center gap-2">
              <UITooltip>
                <TooltipTrigger asChild>
                  <label className="text-sm font-medium text-gray-700 cursor-help">Meta (R$):</label>
                </TooltipTrigger>
                <TooltipContent>
                  Defina o valor máximo de custo esperado
                </TooltipContent>
              </UITooltip>
              <input
                type="number"
                value={costInputValue}
                onChange={handleCostInputChange}
                onKeyPress={handleCostKeyPress}
                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="3000"
              />
              <UITooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSaveCostMeta}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Salvar
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Salvar a nova meta de custo
                </TooltipContent>
              </UITooltip>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={costChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={dataKeyName} />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="cost" stroke="#14b8a6" strokeWidth={2} name="Custo Real" />
              <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Meta" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Consumption Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Consumo {periodFilter === 'monthly' ? 'Mensal' : 'Semanal'} vs Meta
              </h3>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  Comparação entre o consumo real e a meta definida em kWh
                </TooltipContent>
              </UITooltip>
            </div>
            <div className="flex items-center gap-2">
              <UITooltip>
                <TooltipTrigger asChild>
                  <label className="text-sm font-medium text-gray-700 cursor-help">Meta (kWh):</label>
                </TooltipTrigger>
                <TooltipContent>
                  Defina o valor máximo de energia esperada a consumir
                </TooltipContent>
              </UITooltip>
              <input
                type="number"
                value={kwhInputValue}
                onChange={handleKwhInputChange}
                onKeyPress={handleKwhKeyPress}
                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="4200"
              />
              <UITooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSaveKwhMeta}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Salvar
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Salvar a nova meta de consumo
                </TooltipContent>
              </UITooltip>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={consumptionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={dataKeyName} />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()} kWh`} />
              <Legend />
              <Line type="monotone" dataKey="consumption" stroke="#06b6d4" strokeWidth={2} name="Consumo Real" />
              <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Meta" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device Consumption Distribution */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consumo por Dispositivo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceConsumptionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name.split(' ')[0]}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceConsumptionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toLocaleString()} kWh`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Potência por Hora</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="power" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
