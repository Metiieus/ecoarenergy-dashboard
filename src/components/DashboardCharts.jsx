import { BarChart, Bar, PieChart, Pie, Cell, XAxis, ResponsiveContainer } from 'recharts';
import { chartData } from '../data/mockData';

const COLORS = ['#14B8A6', '#4299E1', '#FC8181', '#F6E05E'];

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Gráfico de Barras</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <Bar dataKey="value" fill="#14B8A6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Distribuição de Dados</h3>
        <div className="h-80 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Legenda</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
