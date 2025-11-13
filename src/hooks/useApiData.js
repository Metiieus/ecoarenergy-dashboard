import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.PROD
  ? 'https://tb8calt97j.execute-api.sa-east-1.amazonaws.com/dev/dados'
  : '/api/dados';

const defaultApiData = {
  consumo_mensal: [257, 825, 1959, 3029, 2931, 1811, 1822, 1957, 1397, 2603, 0, 0],
  consumo_diario_mes_corrente: [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390],
  consumo_sem_sistema_mensal: [321, 1031, 2449, 3786, 3664, 2264, 2278, 2446, 1746, 3254, 0, 0],
  consumo_sem_sistema_diario: [125, 137, 150, 162, 175, 187, 200, 212, 225, 237, 250, 262, 275, 287, 300, 312, 325, 337, 350, 362, 375, 387, 400, 412, 425, 437, 450, 462, 475, 487],
  potencias: [],
  minutos_desligado_diario: Array(30).fill(120),
  minutos_desligado_mensal: [1800, 1800, 1800, 1800, 1800, 1800, 1800, 1800, 1800, 1800, 1800, 1800]
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
        try {
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
        } catch (urlErr) {
          console.warn('Erro ao construir URL:', urlErr.message);
          throw new Error(`URL inválida: ${urlErr.message}`);
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

        // Enrich API data with calculated fields for consumption without system
        // Prefer API-provided "consumo_sem_sistema" arrays when they contain meaningful values.
        // Otherwise, derive them from consumo_mensal / consumo_diario_mes_corrente without rounding
        const hasApiMonthlyWithout = Array.isArray(apiData.consumo_sem_sistema_mensal) && apiData.consumo_sem_sistema_mensal.some(v => v && Number(v) > 0);
        const hasApiDailyWithout = Array.isArray(apiData.consumo_sem_sistema_diario) && apiData.consumo_sem_sistema_diario.some(v => v && Number(v) > 0);

        const enrichedData = {
          ...apiData,
          consumo_sem_sistema_mensal: hasApiMonthlyWithout
            ? apiData.consumo_sem_sistema_mensal.map(v => Math.max(0, Number(v)))
            : (apiData.consumo_mensal?.length > 0 ? apiData.consumo_mensal.map(consumo => Math.max(0, (Number(consumo) || 0) / 0.8)) : []),
          consumo_sem_sistema_diario: hasApiDailyWithout
            ? apiData.consumo_sem_sistema_diario.map(v => Math.max(0, Number(v)))
            : (apiData.consumo_diario_mes_corrente?.length > 0 ? apiData.consumo_diario_mes_corrente.map(consumo => Math.max(0, (Number(consumo) || 0) / 0.8)) : [])
        };

        setData(enrichedData);
        console.log('📊 Enriched API Data:', enrichedData);
      } catch (err) {
        console.warn('Erro ao buscar dados da API:', err.message);
        console.warn('URL tentada:', urlString);
        setError(`Erro ao conectar com a API: ${err.message}`);
        // Use mock data como fallback
        setData(defaultApiData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deviceId, includeHistory]);

  return { data, loading, error };
};
