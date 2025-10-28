import { createContext, useContext, useState, useCallback } from 'react';
import { useApiData } from '../hooks/useApiData';
import { useChartData } from '../hooks/useChartData';

const ApiDataContext = createContext();

export const ApiDataProvider = ({ children }) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState(33);
  const { data: apiData, loading, error } = useApiData(selectedDeviceId, true);
  const chartData = useChartData(apiData);

  const handleDeviceChange = useCallback((deviceId) => {
    setSelectedDeviceId(deviceId);
  }, []);

  const value = {
    apiData,
    chartData,
    loading,
    error,
    selectedDeviceId,
    handleDeviceChange
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
