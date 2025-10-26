import { useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { deviceDetailMockData } from '../data/mockData';

const AllDevices = ({ onSelectDevice }) => {
  const [devicesData, setDevicesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deviceIds = [33, 34, 35];

  const equipmentIcons = {
    'Bomba CAG': '⚡',
    'Chiller': '❄️',
    'Bomba de Recalque': '💧',
    'Bomba de Esgoto': '🚰',
    'Aquecimento de Água': '🔥',
    'Bomba de Gordura': '💨',
    'Bomba de Águas Pluviais': '🌧️',
  };

  useEffect(() => {
    const fetchAllDevices = async () => {
      try {
        setLoading(true);
        const promises = deviceIds.map(deviceId =>
          fetch(
            `https://tb8calt97j.execute-api.sa-east-1.amazonaws.com/dev/dados?device_id=${deviceId}&historico=true`
          )
            .then(response => {
              if (!response.ok) throw new Error(`API error: ${response.status}`);
              return response.json();
            })
            .then(data => ({
              deviceId,
              data: data.dados && Array.isArray(data.dados) ? data.dados : [],
              error: null
            }))
            .catch(err => ({
              deviceId,
              data: [],
              error: err.message
            }))
        );

        const results = await Promise.all(promises);
        const dataMap = {};
        const errorMessages = [];

        results.forEach(result => {
          dataMap[result.deviceId] = result.data;
          if (result.error) {
            errorMessages.push(`Dispositivo ${result.deviceId}: ${result.error}`);
          }
        });

        setDevicesData(dataMap);
        if (errorMessages.length > 0) {
          setError(errorMessages.join('. '));
        }
      } catch (err) {
        setError(`Erro ao carregar dispositivos: ${err.message}`);
        setDevicesData({});
      } finally {
        setLoading(false);
      }
    };

    fetchAllDevices();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Carregando todos os dispositivos...</p>
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
            <p className="text-yellow-900 font-semibold">Aviso ao carregar dispositivos</p>
            <p className="text-yellow-800 text-sm mt-1">{error}</p>
            <p className="text-yellow-700 text-xs mt-2">A API externa pode estar temporariamente indisponível. Tente recarregar a página.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {deviceIds.map(deviceId => {
        const devices = devicesData[deviceId] || [];
        
        return (
          <div key={deviceId} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Dispositivo {deviceId}</h2>

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
                      onClick={() => onSelectDevice && onSelectDevice(deviceId)}
                      className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
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
              <div className="text-center py-12">
                <p className="text-gray-600 font-medium">Nenhum dispositivo encontrado</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AllDevices;
