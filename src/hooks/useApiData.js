import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.PROD
  ? 'https://tb8calt97j.execute-api.sa-east-1.amazonaws.com/dev/dados'
  : '/api/dados';

const defaultApiData = {
  consumo_mensal: [],
  consumo_diario_mes_corrente: [],
  potencias: [],
  minutos_desligado_diario: [],
  minutos_desligado_mensal: []
};

export const useApiData = (deviceId = 33, includeHistory = true) => {
  const [data, setData] = useState(defaultApiData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

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

        const response = await fetch(urlString, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const apiData = await response.json();
        setData(apiData);
      } catch (err) {
        console.warn('Erro ao buscar dados da API, usando mock data:', err.message);
        setError(err.message);
        setData(defaultApiData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deviceId, includeHistory]);

  return { data, loading, error };
};
