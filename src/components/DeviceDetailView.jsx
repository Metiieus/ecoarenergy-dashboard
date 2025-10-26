import { useState, useEffect } from 'react';
import { AlertCircle, Loader2, ChevronLeft, Edit2, Check, X } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { deviceDetailMockData } from '../data/mockData';

const DeviceDetailView = ({ deviceId, onBack }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [goalValue, setGoalValue] = useState(null);
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoalValue, setTempGoalValue] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');

  const equipmentIcons = {
    'Bomba CAG': '⚡',
    'Chiller': '❄️',
    'Bomba de Recalque': '💧',
    'Bomba de Esgoto': '🚰',
    'Aquecimento de Água': '🔥',
    'Bomba de Gordura': '💨',
    'Bomba de Águas Pluviais': '🌧️',
  };

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://tb8calt97j.execute-api.sa-east-1.amazonaws.com/dev/dados?device_id=${deviceId}&historico=true`
        );

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        if (data.dados && Array.isArray(data.dados)) {
          setDevices(data.dados);
          setError(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceData();
    loadGoalFromStorage();
  }, [deviceId]);

  const loadGoalFromStorage = () => {
    const stored = localStorage.getItem(`goal_${deviceId}`);
    if (stored) setGoalValue(parseFloat(stored));
  };

  const saveGoalToStorage = (value) => {
    localStorage.setItem(`goal_${deviceId}`, value.toString());
    setGoalValue(value);
  };

  const handleSaveGoal = () => {
    if (tempGoalValue && tempGoalValue > 0) {
      saveGoalToStorage(tempGoalValue);
      setEditingGoal(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Carregando dados do dispositivo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
        <div className="flex items-start gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-900 font-semibold">Erro ao carregar dados</p>
            <p className="text-yellow-800 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const deviceInfo = devices.length > 0 ? devices[0] : null;
  const deviceName = deviceInfo?.nome || `Dispositivo ${deviceId}`;
  const icon = equipmentIcons[deviceName] || '⚙️';

  const totalEnergy = devices.reduce((sum, d) => sum + (parseFloat(d.energia) || 0), 0);
  const totalPower = devices.reduce((sum, d) => sum + (parseFloat(d.potencia) || 0), 0);
  const averageTemperature = devices.length > 0 
    ? (devices.reduce((sum, d) => sum + (parseFloat(d.temperatura) || 0), 0) / devices.length).toFixed(1)
    : 0;

  const estimatedCost = (totalEnergy * 0.87).toFixed(2);
  const savings = goalValue ? Math.max(0, (goalValue - totalEnergy) * 0.87).toFixed(2) : 0;
  const savingsPercentage = goalValue ? ((savings / (goalValue * 0.87)) * 100).toFixed(1) : 0;

  const operatingHours = (totalPower / 8000 * 24).toFixed(1);

  const chartData = [
    { month: 'Mês Anterior', value: totalEnergy * 0.95, goal: goalValue || totalEnergy },
    { month: 'Mês Atual', value: totalEnergy, goal: goalValue || totalEnergy }
  ];

  const comparisonData = [
    { name: 'Consumido', value: totalEnergy, fill: '#4299E1' },
    { name: 'Meta', value: goalValue || totalEnergy, fill: '#48BB78' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-2xl">
            {icon}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{deviceName} - Dispositivo {deviceId}</h1>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest block mb-2">Mês</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            >
              {monthNames.map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest block mb-2">Ano</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest block mb-2">Período</label>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos os dados</option>
              <option value="month">Este mês</option>
              <option value="quarter">Este trimestre</option>
              <option value="year">Este ano</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Consumo Total</p>
          <p className="text-3xl font-bold text-blue-700">{totalEnergy.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-2">kWh</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Custo Estimado</p>
          <p className="text-3xl font-bold text-pink-700">R${estimatedCost}</p>
          <p className="text-xs text-gray-500 mt-2">Total em R$</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Horas de Operação</p>
          <p className="text-3xl font-bold text-yellow-700">{operatingHours}</p>
          <p className="text-xs text-gray-500 mt-2">horas</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Temperatura Média</p>
          <p className="text-3xl font-bold text-orange-700">{averageTemperature}°C</p>
          <p className="text-xs text-gray-500 mt-2">Celsius</p>
        </div>
      </div>

      {/* Goal Section */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Meta de Consumo</h3>
          {!editingGoal && (
            <button
              onClick={() => {
                setEditingGoal(true);
                setTempGoalValue(goalValue?.toString() || '');
              }}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Editar Meta
            </button>
          )}
        </div>

        {editingGoal ? (
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest block mb-2">Meta em kWh</label>
              <input
                type="number"
                value={tempGoalValue}
                onChange={(e) => setTempGoalValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Digite a meta em kWh"
              />
            </div>
            <button
              onClick={handleSaveGoal}
              className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Salvar
            </button>
            <button
              onClick={() => setEditingGoal(false)}
              className="flex items-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1">Meta Definida</p>
              <p className="text-2xl font-bold text-green-700">{goalValue ? goalValue.toFixed(2) : 'Não definida'}</p>
              <p className="text-xs text-gray-500 mt-1">kWh</p>
            </div>

            {goalValue && (
              <>
                <div className="bg-gradient-to-r from-teal-50 to-teal-50 rounded-lg p-4 border border-teal-100">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1">Economia Atingida</p>
                  <p className="text-2xl font-bold text-teal-700">R${savings}</p>
                  <p className="text-xs text-gray-500 mt-1">{savingsPercentage}% da meta</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1">Diferença</p>
                  <p className="text-2xl font-bold text-blue-700">{(goalValue - totalEnergy).toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">kWh restante</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumo vs Meta */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Consumo vs Meta</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4299E1" name="Consumo (kWh)" />
                <Bar dataKey="goal" fill="#48BB78" name="Meta (kWh)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consumo Atual vs Meta */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Objetivo vs Consumo</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={comparisonData.map(item => ({
                    name: item.name,
                    value: item.value || 0
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(2)} kWh`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comparação Histórica */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Comparação: Este Ano vs Ano Passado</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { period: 'Jan', thisYear: totalEnergy * 0.9, lastYear: totalEnergy * 0.85 },
              { period: 'Fev', thisYear: totalEnergy * 0.92, lastYear: totalEnergy * 0.88 },
              { period: 'Mar', thisYear: totalEnergy * 0.95, lastYear: totalEnergy * 0.92 },
              { period: 'Abr', thisYear: totalEnergy, lastYear: totalEnergy * 0.98 },
              { period: 'Mai', thisYear: totalEnergy * 1.02, lastYear: totalEnergy * 1.05 },
              { period: 'Jun', thisYear: totalEnergy * 0.98, lastYear: totalEnergy * 1.02 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="thisYear" stroke="#4299E1" name="Este Ano" />
              <Line type="monotone" dataKey="lastYear" stroke="#48BB78" name="Ano Passado" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detalhes dos Equipamentos */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Detalhes dos Equipamentos</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-widest">Equipamento</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-widest">Potência (W)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-widest">Energia (kWh)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-widest">Temperatura (°C)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-widest">Umidade (%)</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{device.nome || `Dispositivo ${idx + 1}`}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{parseFloat(device.potencia || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{parseFloat(device.energia || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{parseFloat(device.temperatura || 0).toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{parseFloat(device.umidade || 0).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailView;
