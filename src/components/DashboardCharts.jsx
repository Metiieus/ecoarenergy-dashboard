import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardCharts = () => {
  const monthlyConsumptionData = [
    { month: 'Jan', consumption: 4000, target: 4200 },
    { month: 'Fev', consumption: 4200, target: 4200 },
    { month: 'Mar', consumption: 3800, target: 4200 },
    { month: 'Abr', consumption: 4500, target: 4200 },
    { month: 'Mai', consumption: 4100, target: 4200 },
    { month: 'Jun', consumption: 3900, target: 4200 },
    { month: 'Jul', consumption: 4300, target: 4200 },
    { month: 'Ago', consumption: 4400, target: 4200 },
    { month: 'Set', consumption: 4000, target: 4200 },
    { month: 'Out', consumption: 4100, target: 4200 },
    { month: 'Nov', consumption: 3950, target: 4200 },
    { month: 'Dez', consumption: 4050, target: 4200 }
  ];

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

  return (
    <div className="space-y-6">
      {/* Monthly Consumption vs Target */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Consumo Mensal vs Meta</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyConsumptionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="consumption" stroke="#14b8a6" strokeWidth={2} name="Consumo Real" />
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
