import { useMemo } from 'react';

const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const useChartData = (apiData) => {
  const monthlyCostData = useMemo(() => {
    if (!apiData?.consumo_mensal || apiData.consumo_mensal.length === 0) {
      return [];
    }

    return apiData.consumo_mensal.map((consumption, index) => {
      const cons = Math.max(0, Number(consumption) || 0);
      const semSistema = (Array.isArray(apiData.consumo_sem_sistema_mensal) && apiData.consumo_sem_sistema_mensal[index] > 0)
        ? Math.max(0, Number(apiData.consumo_sem_sistema_mensal[index]))
        : Math.max(0, cons / 0.8);

      return {
        month: monthLabels[index % 12],
        cost: cons * 0.80,
        consumption: cons,
        consumoSemSistema: semSistema,
        target: 3000
      };
    });
  }, [apiData?.consumo_mensal, apiData?.consumo_sem_sistema_mensal]);

  const dailyConsumptionData = useMemo(() => {
    if (!apiData?.consumo_diario_mes_corrente || apiData.consumo_diario_mes_corrente.length === 0) {
      return [];
    }

    return apiData.consumo_diario_mes_corrente.map((consumption, index) => {
      const cons = Math.max(0, Number(consumption) || 0);
      const sem = (Array.isArray(apiData.consumo_sem_sistema_diario) && apiData.consumo_sem_sistema_diario[index] > 0)
        ? Math.max(0, Number(apiData.consumo_sem_sistema_diario[index]))
        : Math.max(0, cons / 0.8);

      return {
        day: `D${index + 1}`,
        consumption: cons,
        consumoSemSistema: sem,
        target: 4200 / 31
      };
    });
  }, [apiData?.consumo_diario_mes_corrente, apiData?.consumo_sem_sistema_diario]);

  const peakHoursData = useMemo(() => {
    if (!apiData?.potencias || apiData.potencias.length === 0) {
      return [];
    }

    const hourData = {};

    apiData.potencias.forEach(([power, timestamp]) => {
      const date = new Date(timestamp * 1000);
      const hour = date.getHours();

      if (!hourData[hour]) {
        hourData[hour] = { power: 0, count: 0 };
      }

      hourData[hour].power += power;
      hourData[hour].count += 1;
    });

    return Object.entries(hourData)
      .map(([hour, data]) => ({
        hour: `${hour}h`,
        power: Math.round(data.power / data.count / 1000)
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  }, [apiData?.potencias]);

  const downTimeData = useMemo(() => {
    if (!apiData?.minutos_desligado_diario || apiData.minutos_desligado_diario.length === 0) {
      return [];
    }

    return {
      diario: apiData.minutos_desligado_diario,
      mensal: apiData.minutos_desligado_mensal || []
    };
  }, [apiData?.minutos_desligado_diario, apiData?.minutos_desligado_mensal]);

  return {
    monthlyCostData,
    dailyConsumptionData,
    peakHoursData,
    downTimeData
  };
};
