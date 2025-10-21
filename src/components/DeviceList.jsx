import { useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(33);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://tb8calt97j.execute-api.sa-east-1.amazonaws.com/dev/dados?device_id=${selectedDevice}&historico=true`
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.dados && Array.isArray(data.dados)) {
          setDevices(data.dados);
          setError(null);
        } else {
          setDevices([]);
        }
      } catch (err) {
        setError(err.message);
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceData();
  }, [selectedDevice]);

  const equipmentIcons = {
    'Bomba CAG': '⚡',
    'Chiller': '❄️',
    'Bomba de Recalque': '💧',
    'Bomba de Esgoto': '🚰',
    'Aquecimento de Água': '🔥',
    'Bomba de Gordura': '💨',
    'Bomba de Águas Pluviais': '🌧️',
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Carregando dados dos dispositivos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
        <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-red-900 font-semibold">Erro ao carregar dados</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Seleção de Dispositivo</h2>
        </div>
        
        <select 
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(parseInt(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
        >
          <option value={33}>Dispositivo 33</option>
          <option value={34}>Dispositivo 34</option>
          <option value={35}>Dispositivo 35</option>
        </select>
      </div>

      {devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device, index) => {
            const deviceName = device.nome || `Dispositivo ${index + 1}`;
            const icon = equipmentIcons[deviceName] || '⚙️';
            const potencia = parseFloat(device.potencia) || 0;
            const energia = parseFloat(device.energia) || 0;
            const temperatura = parseFloat(device.temperatura) || 0;
            const umidade = parseFloat(device.umidade) || 0;

            return (
              <div 
                key={device.id || index}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-2xl mb-3">
                      {icon}
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{deviceName}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1">Potência</p>
                    <p className="text-2xl font-bold text-blue-700">{potencia.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">W</p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-lg p-4 border border-green-100">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1">Energia</p>
                    <p className="text-2xl font-bold text-green-700">{energia.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">kWh</p>
                  </div>

                  {temperatura > 0 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-50 rounded-lg p-4 border border-yellow-100">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1">Temperatura</p>
                      <p className="text-2xl font-bold text-yellow-700">{temperatura.toFixed(1)}</p>
                      <p className="text-xs text-gray-500 mt-1">°C</p>
                    </div>
                  )}

                  {umidade > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 to-purple-50 rounded-lg p-4 border border-purple-100">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1">Umidade</p>
                      <p className="text-2xl font-bold text-purple-700">{umidade.toFixed(1)}</p>
                      <p className="text-xs text-gray-500 mt-1">%</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
          <div className="text-center py-12">
            <p className="text-gray-600 font-medium">Nenhum dispositivo encontrado</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceList;
