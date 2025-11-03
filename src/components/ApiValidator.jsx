import { useState, useEffect } from 'react';
import { ChevronDown, Copy, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function ApiValidator() {
  const [isOpen, setIsOpen] = useState(false);
  const [deviceId, setDeviceId] = useState(33);
  const [includeHistory, setIncludeHistory] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const API_BASE_URL = import.meta.env.PROD
    ? 'https://tb8calt97j.execute-api.sa-east-1.amazonaws.com/dev/dados'
    : '/api/dados';

  const validateApi = async () => {
    setLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      let urlString;
      if (import.meta.env.PROD) {
        const url = new URL(API_BASE_URL);
        url.searchParams.append('device_id', deviceId);
        url.searchParams.append('historico', includeHistory);
        urlString = url.toString();
      } else {
        const baseUrl = `${window.location.origin}${API_BASE_URL}`;
        const url = new URL(baseUrl);
        url.searchParams.append('device_id', deviceId);
        url.searchParams.append('historico', includeHistory);
        urlString = url.toString();
      }

      console.log('🔍 Validating API:', urlString);

      const response = await fetch(urlString, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setApiResponse(data);
      console.log('✅ API Response:', data);
    } catch (err) {
      console.error('❌ API Error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getDataStructure = () => {
    if (!apiResponse) return null;

    return [
      {
        key: 'consumo_mensal',
        label: 'Monthly Consumption',
        data: apiResponse.consumo_mensal,
        description: 'Array of monthly consumption values'
      },
      {
        key: 'consumo_diario_mes_corrente',
        label: 'Daily Consumption (Current Month)',
        data: apiResponse.consumo_diario_mes_corrente,
        description: 'Array of daily consumption values for the current month'
      },
      {
        key: 'potencias',
        label: 'Power Data',
        data: apiResponse.potencias,
        description: 'Array of [power, timestamp] pairs'
      },
      {
        key: 'minutos_desligado_diario',
        label: 'Daily Offline Minutes',
        data: apiResponse.minutos_desligado_diario,
        description: 'Array of daily offline minutes'
      },
      {
        key: 'minutos_desligado_mensal',
        label: 'Monthly Offline Minutes',
        data: apiResponse.minutos_desligado_mensal,
        description: 'Array of monthly offline minutes'
      }
    ];
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg flex items-center gap-2 transition-all"
      >
        <span className="text-xl">🔍</span>
        API Validator
        <ChevronDown
          size={18}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-96 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Controls */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Device ID
              </label>
              <input
                type="number"
                value={deviceId}
                onChange={(e) => setDeviceId(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeHistory"
                checked={includeHistory}
                onChange={(e) => setIncludeHistory(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="includeHistory" className="text-sm text-gray-700">
                Include History
              </label>
            </div>

            <button
              onClick={validateApi}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              {loading ? 'Validating...' : 'Validate API'}
            </button>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-2">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Response Display */}
            {apiResponse && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">✅ API Response Received</span>
                </div>

                {getDataStructure()?.map((item, index) => (
                  <details key={item.key} className="bg-gray-50 rounded-md border border-gray-200">
                    <summary className="cursor-pointer p-3 hover:bg-gray-100 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-gray-900">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {Array.isArray(item.data) ? item.data.length : 'N/A'} items
                      </span>
                    </summary>
                    <div className="border-t border-gray-200 p-3 bg-white">
                      <div className="bg-gray-900 text-gray-100 rounded p-2 font-mono text-xs overflow-x-auto max-h-48 overflow-y-auto">
                        <pre>{JSON.stringify(item.data, null, 2)}</pre>
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.data, index)}
                        className="mt-2 w-full text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 rounded flex items-center justify-center gap-1 transition-colors"
                      >
                        <Copy size={14} />
                        {copiedIndex === index ? 'Copied!' : 'Copy JSON'}
                      </button>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
