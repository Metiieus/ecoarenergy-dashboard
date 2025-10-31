import { deviceRankings } from '../data/mockData';
import { useApiDataContext } from '../context/ApiDataContext';
import { ArrowLeft, Zap, Thermometer, Droplets, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DeviceDetailView = ({ deviceId, onBack }) => {
  const device = deviceRankings.find(d => d.id === deviceId);
  const { apiData, loading, error } = useApiDataContext();

  if (!device) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Dispositivo não encontrado</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Voltar
        </button>
      </div>
    );
  }

  const consumptionData = apiData?.consumo_diario_mes_corrente?.length > 0
    ? apiData.consumo_diario_mes_corrente.map((value, index) => ({
        time: `${String(index + 1).padStart(2, '0')}:00`,
        consumption: Math.round(value)
      }))
    : [
        { time: '00:00', consumption: Math.round(device.consumption * 0.6) },
        { time: '04:00', consumption: Math.round(device.consumption * 0.4) },
        { time: '08:00', consumption: Math.round(device.consumption * 0.8) },
        { time: '12:00', consumption: Math.round(device.consumption * 1.0) },
        { time: '16:00', consumption: Math.round(device.consumption * 0.9) },
        { time: '20:00', consumption: Math.round(device.consumption * 0.7) },
        { time: '23:59', consumption: Math.round(device.consumption * 0.5) }
      ];

  const efficiencyData = apiData?.potencias?.length > 0
    ? apiData.potencias.map((value, index) => ({
        period: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'][index % 7],
        efficiency: Math.round(value)
      }))
    : [
        { period: 'Seg', efficiency: device.efficiency + Math.round(Math.random() * 10 - 5) },
        { period: 'Ter', efficiency: device.efficiency + Math.round(Math.random() * 10 - 5) },
        { period: 'Qua', efficiency: device.efficiency + Math.round(Math.random() * 10 - 5) },
        { period: 'Qui', efficiency: device.efficiency + Math.round(Math.random() * 10 - 5) },
        { period: 'Sex', efficiency: device.efficiency + Math.round(Math.random() * 10 - 5) },
        { period: 'Sab', efficiency: device.efficiency + Math.round(Math.random() * 10 - 5) },
        { period: 'Dom', efficiency: device.efficiency + Math.round(Math.random() * 10 - 5) }
      ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{device.icon} {device.name}</h1>
          <p className="text-gray-600">Detalhes e análise do dispositivo</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Potência Média</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{device.avgPower.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">W</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Consumo</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{device.consumption.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">kWh</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-600">Tempo Ativo</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{device.activeTime}</p>
          <p className="text-xs text-gray-500 mt-1">Horas/dia</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">Economia</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">R${device.savings}k</p>
          <p className="text-xs text-gray-500 mt-1">Potencial</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consumo de Energia (24h)</h3>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={{ fill: '#14b8a6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eficiência Semanal (%)</h3>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="efficiency" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-red-200 bg-red-50">
          <p className="text-red-600 font-semibold">Erro ao carregar dados</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  );
};

export default DeviceDetailView;
