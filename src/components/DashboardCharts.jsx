import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardCharts = () => {
  const pricePerKwh = 0.80;
  const [targetValue, setTargetValue] = useState(3000);
  const [inputValue, setInputValue] = useState('3000');

  const baseMonthlyData = [
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
  ];

  const monthlyConsumptionData = baseMonthlyData.map(item => ({
    month: item.month,
    cost: Math.round(item.consumption * pricePerKwh * 100) / 100,
    target: targetValue
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

  const handleSaveMeta = () => {
    const newValue = parseFloat(inputValue);
    if (!isNaN(newValue) && newValue > 0) {
      setTargetValue(newValue);
    } else {
      setInputValue(targetValue.toString());
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveMeta();
    }
  };

  return (
    <div className="space-y-6">
      {/* Monthly Cost vs Target */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Custo Mensal vs Meta</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Meta (R$):</label>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="3000"
            />
            <button
              onClick={handleSaveMeta}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyConsumptionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="cost" stroke="#14b8a6" strokeWidth={2} name="Custo Real" />
            <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Meta" />
          </LineChart>
        </ResponsiveContainer>
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
