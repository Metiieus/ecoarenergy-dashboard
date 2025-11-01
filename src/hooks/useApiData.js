import { useState, useEffect, useRef } from 'react';

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

const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

export const useApiData = (deviceId = 33, includeHistory = true) => {
  const [data, setData] = useState(defaultApiData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const cacheKey = `${deviceId}-${includeHistory}`;
        const cachedData = apiCache.get(cacheKey);
        const now = Date.now();

        if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
          setData(cachedData.data);
          setLoading(false);
          return;
        }

        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

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
          },
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const apiData = await response.json();
        apiCache.set(cacheKey, { data: apiData, timestamp: now });
        setData(apiData);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        console.warn('Erro ao buscar dados da API, usando mock data:', err.message);
        setError(err.message);
        setData(defaultApiData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [deviceId, includeHistory]);

  return { data, loading, error };
};
