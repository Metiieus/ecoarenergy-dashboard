import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useApiData } from '../hooks/useApiData';
import { useChartData } from '../hooks/useChartData';
import { DEVICE_ID_ALL, getAllDeviceIds } from '../data/devices';

const ApiDataContext = createContext();

export const ApiDataProvider = ({ children }) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState(33);
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(new Date().getMonth());

  // Fetch data for single device
  const { data: singleDeviceData, loading, error } = useApiData(selectedDeviceId, false);

  // Fetch data for all devices if "all" is selected
  const allDeviceIds = useMemo(() => getAllDeviceIds(), []);
  const [allDevicesData, setAllDevicesData] = useState({});
  const [loadingAllDevices, setLoadingAllDevices] = useState(false);

  // When "all devices" is selected, fetch data for all devices
  const loadAllDevicesData = useCallback(async () => {
    if (selectedDeviceId !== DEVICE_ID_ALL) {
      setAllDevicesData({});
      return;
    }

    setLoadingAllDevices(true);
    const aggregatedData = {};

    try {
      // Fetch data for each device and aggregate
      for (const deviceId of allDeviceIds) {
        try {
          const baseUrl = import.meta.env.PROD
            ? 'https://tb8calt97j.execute-api.sa-east-1.amazonaws.com/dev/dados'
            : '/api/dados';

          const url = new URL(baseUrl, window.location.origin);
          url.searchParams.append('device_id', deviceId);
          url.searchParams.append('historico', 'true');

          const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            aggregatedData[deviceId] = data;
          } else {
            console.warn(`API returned status ${response.status} for device ${deviceId}`);
          }
        } catch (err) {
          console.warn(`Error loading device ${deviceId}:`, err.message);
        }
      }

      setAllDevicesData(aggregatedData);
    } catch (err) {
      console.error('Error loading all devices data:', err);
    } finally {
      setLoadingAllDevices(false);
    }
  }, [selectedDeviceId]);

  // Aggregate data from multiple devices
  const aggregateDevicesData = useCallback((devicesDataMap) => {
    if (Object.keys(devicesDataMap).length === 0) {
      return {
        consumo_mensal: [],
        consumo_diario_mes_corrente: [],
        consumo_sem_sistema_mensal: [],
        consumo_sem_sistema_diario: [],
        minutos_desligado_mensal: [],
        minutos_desligado_diario: []
      };
    }

    const aggregated = {
      consumo_mensal: Array(12).fill(0),
      consumo_diario_mes_corrente: Array(31).fill(0),
      consumo_sem_sistema_mensal: Array(12).fill(0),
      consumo_sem_sistema_diario: Array(31).fill(0),
      minutos_desligado_mensal: Array(12).fill(0),
      minutos_desligado_diario: Array(31).fill(0)
    };

    // Sum data from all devices
    Object.values(devicesDataMap).forEach((deviceData) => {
      if (deviceData.consumo_mensal) {
        deviceData.consumo_mensal.forEach((val, idx) => {
          aggregated.consumo_mensal[idx] = (aggregated.consumo_mensal[idx] || 0) + (Number(val) || 0);
        });
      }

      if (deviceData.consumo_diario_mes_corrente) {
        deviceData.consumo_diario_mes_corrente.forEach((val, idx) => {
          aggregated.consumo_diario_mes_corrente[idx] = (aggregated.consumo_diario_mes_corrente[idx] || 0) + (Number(val) || 0);
        });
      }

      if (deviceData.consumo_sem_sistema_mensal) {
        deviceData.consumo_sem_sistema_mensal.forEach((val, idx) => {
          aggregated.consumo_sem_sistema_mensal[idx] = (aggregated.consumo_sem_sistema_mensal[idx] || 0) + (Number(val) || 0);
        });
      }

      if (deviceData.consumo_sem_sistema_diario) {
        deviceData.consumo_sem_sistema_diario.forEach((val, idx) => {
          aggregated.consumo_diario_mes_corrente[idx] = (aggregated.consumo_sem_sistema_diario[idx] || 0) + (Number(val) || 0);
        });
      }

      if (deviceData.minutos_desligado_mensal) {
        deviceData.minutos_desligado_mensal.forEach((val, idx) => {
          aggregated.minutos_desligado_mensal[idx] = (aggregated.minutos_desligado_mensal[idx] || 0) + (Number(val) || 0);
        });
      }

      if (deviceData.minutos_desligado_diario) {
        deviceData.minutos_desligado_diario.forEach((val, idx) => {
          aggregated.minutos_desligado_diario[idx] = (aggregated.minutos_desligado_diario[idx] || 0) + (Number(val) || 0);
        });
      }
    });

    return aggregated;
  }, []);

  // Determine which data to use
  const apiData = useMemo(() => {
    if (selectedDeviceId === DEVICE_ID_ALL) {
      return aggregateDevicesData(allDevicesData);
    }
    return singleDeviceData;
  }, [selectedDeviceId, singleDeviceData, allDevicesData, aggregateDevicesData]);

  const chartData = useChartData(apiData);

  const handleDeviceChange = useCallback((deviceId) => {
    setSelectedDeviceId(deviceId);
    if (deviceId === DEVICE_ID_ALL) {
      loadAllDevicesData();
    }
  }, [loadAllDevicesData]);

  const value = {
    apiData,
    chartData,
    loading: selectedDeviceId === DEVICE_ID_ALL ? loadingAllDevices : loading,
    error,
    selectedDeviceId,
    handleDeviceChange,
    periodFilter,
    setPeriodFilter,
    selectedPeriodIndex,
    setSelectedPeriodIndex
  };

  return (
    <ApiDataContext.Provider value={value}>
      {children}
    </ApiDataContext.Provider>
  );
};

export const useApiDataContext = () => {
  const context = useContext(ApiDataContext);
  if (!context) {
    throw new Error('useApiDataContext must be used within ApiDataProvider');
  }
  return context;
};
