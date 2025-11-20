export const ensureNonNegative = (value) => Math.max(0, Number(value) || 0);

/**
 * Calculate consumption data based on filter type (daily/monthly)
 * @param {Object} apiData - API data containing consumption arrays
 * @param {String} filterType - 'daily' or 'monthly'
 * @param {Number} selectedMonthIndex - Currently selected month index (0-11)
 * @returns {Array} Array of consumption data
 */
export const getFilteredConsumptionData = (apiData, filterType, selectedMonthIndex) => {
  if (!apiData) return [];

  if (filterType === 'daily') {
    // For daily filter, show current month data
    if (!Array.isArray(apiData.consumo_diario_mes_corrente)) return [];
    return apiData.consumo_diario_mes_corrente.map((consumo, index) => {
      const consumoVal = ensureNonNegative(consumo);
      const consumoSemSistemaApi = apiData.consumo_sem_sistema_diario?.[index];

      // If API provides value, use it; if zero or missing, derive from consumo; if consumo is zero, set to zero
      let consumoSemSistemaVal;
      if (consumoVal === 0) {
        consumoSemSistemaVal = 0;
      } else if (consumoSemSistemaApi !== undefined && consumoSemSistemaApi !== null && consumoSemSistemaApi !== 0) {
        consumoSemSistemaVal = ensureNonNegative(consumoSemSistemaApi);
      } else if (consumoSemSistemaApi === 0) {
        consumoSemSistemaVal = 0;
      } else {
        consumoSemSistemaVal = ensureNonNegative(consumoVal / 0.8);
      }

      return {
        period: `D${index + 1}`,
        index,
        consumo: consumoVal,
        consumoSemSistema: consumoSemSistemaVal
      };
    });
  }

  // Monthly filter
  if (!Array.isArray(apiData.consumo_mensal)) return [];
  return apiData.consumo_mensal.map((consumo, index) => {
    const consumoVal = ensureNonNegative(consumo);
    const consumoSemSistemaApi = apiData.consumo_sem_sistema_mensal?.[index];

    // If API provides value, use it; if zero or missing, derive from consumo; if consumo is zero, set to zero
    let consumoSemSistemaVal;
    if (consumoVal === 0) {
      consumoSemSistemaVal = 0;
    } else if (consumoSemSistemaApi !== undefined && consumoSemSistemaApi !== null && consumoSemSistemaApi !== 0) {
      consumoSemSistemaVal = ensureNonNegative(consumoSemSistemaApi);
    } else if (consumoSemSistemaApi === 0) {
      consumoSemSistemaVal = 0;
    } else {
      consumoSemSistemaVal = ensureNonNegative(consumoVal / 0.8);
    }

    return {
      period: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][index],
      index,
      consumo: consumoVal,
      consumoSemSistema: consumoSemSistemaVal
    };
  });
};

/**
 * Calculate total consumption for filtered period
 * @param {Array} filteredData - Filtered consumption data
 * @param {String} filterType - 'daily' or 'monthly'
 * @param {Number} selectedPeriodIndex - Selected month/day index
 * @returns {Number} Total consumption
 */
export const calculateTotalConsumption = (filteredData, filterType, selectedPeriodIndex = 0) => {
  if (!Array.isArray(filteredData) || filteredData.length === 0) return 0;

  if (filterType === 'daily') {
    // For daily, sum all days in the current month
    return filteredData.reduce((sum, item) => sum + item.consumo, 0);
  }

  // For monthly, return only the selected month's consumption
  if (filteredData[selectedPeriodIndex]) {
    return filteredData[selectedPeriodIndex].consumo || 0;
  }
  return 0;
};

/**
 * Calculate total economy (consumo_sem_sistema - consumo_com_sistema)
 * @param {Array} filteredData - Filtered consumption data
 * @returns {Number} Total economy
 */
export const calculateTotalEconomy = (filteredData) => {
  if (!Array.isArray(filteredData) || filteredData.length === 0) return 0;

  const totalWithoutSystem = filteredData.reduce(
    (sum, item) => sum + item.consumoSemSistema,
    0
  );
  const totalWithSystem = filteredData.reduce((sum, item) => sum + item.consumo, 0);

  return Math.max(0, totalWithoutSystem - totalWithSystem);
};

/**
 * Calculate red bars (sum of consumo + consumo_sem_sistema)
 * @param {Array} filteredData - Filtered consumption data
 * @returns {Array} Array with red bar values for each period
 */
export const calculateRedBars = (filteredData) => {
  if (!Array.isArray(filteredData)) return [];

  return filteredData.map((item) => ({
    ...item,
    redBar: ensureNonNegative(item.consumo + item.consumoSemSistema)
  }));
};

/**
 * Calculate economy percentage rate
 * @param {Number} totalEconomy - Total economy value
 * @param {Number} totalConsumption - Total consumption value
 * @returns {Number} Economy percentage (0-100)
 */
export const calculateEconomyRate = (totalEconomy, totalConsumption) => {
  if (totalConsumption <= 0) return 0;
  return Math.min((totalEconomy / totalConsumption) * 100, 100);
};

/**
 * Get comparison data with previous period
 * @param {Array} filteredData - Filtered consumption data
 * @param {String} filterType - 'daily' or 'monthly'
 * @param {Number} currentPeriodIndex - Index of current period (day or month)
 * @returns {Object} Comparison data with percentage change
 */
export const getComparisonWithPreviousPeriod = (
  filteredData,
  filterType,
  currentPeriodIndex
) => {
  if (!Array.isArray(filteredData) || filteredData.length < 2) {
    return { percentChange: 0, currentValue: 0, previousValue: 0 };
  }

  const currentIndex = Math.min(currentPeriodIndex, filteredData.length - 1);

  if (filterType === 'daily') {
    // Compare with day from previous month
    const daysInCurrentMonth = filteredData.length;
    const previousMonthIndex = currentIndex - daysInCurrentMonth;

    if (previousMonthIndex < 0) {
      return { percentChange: 0, currentValue: 0, previousValue: 0 };
    }

    const currentValue = filteredData[currentIndex]?.consumo || 0;
    const previousValue = filteredData[previousMonthIndex]?.consumo || 0;

    if (previousValue === 0) {
      return { percentChange: 0, currentValue, previousValue };
    }

    const percentChange = ((previousValue - currentValue) / previousValue) * 100;
    return { percentChange, currentValue, previousValue };
  }

  // Monthly comparison
  if (currentIndex < 1) {
    return { percentChange: 0, currentValue: 0, previousValue: 0 };
  }

  const currentValue = filteredData[currentIndex]?.consumo || 0;
  const previousValue = filteredData[currentIndex - 1]?.consumo || 0;

  if (previousValue === 0) {
    return { percentChange: 0, currentValue, previousValue };
  }

  const percentChange = ((previousValue - currentValue) / previousValue) * 100;
  return { percentChange, currentValue, previousValue };
};

/**
 * Get activation hours for filtered period
 * @param {Object} apiData - API data containing downtime minutes
 * @param {String} filterType - 'daily' or 'monthly'
 * @param {Number} periodIndex - Index of current period
 * @returns {Number} Activation hours
 */
export const getActivationHours = (apiData, filterType, periodIndex) => {
  if (!apiData) return 0;

  if (filterType === 'daily') {
    // For daily: 24 hours minus downtime in minutes
    const downtimeMinutes = apiData.minutos_desligado_diario?.[periodIndex] || 0;
    return Math.max(0, 24 - downtimeMinutes / 60);
  }

  // For monthly: 720 hours (30 days * 24) minus total downtime
  const downtimeMinutes = apiData.minutos_desligado_mensal?.[periodIndex] || 0;
  return Math.max(0, 720 - downtimeMinutes / 60);
};

/**
 * Load meta from localStorage for a device
 * @param {Number|String} deviceId - Device ID
 * @param {String} filterType - 'daily' or 'monthly'
 * @param {Number} periodIndex - Period index (month or day)
 * @returns {Number} Saved meta or default value
 */
export const loadMetaFromStorage = (deviceId, filterType, periodIndex) => {
  // Use a combined key that includes device to ensure different devices can have different metas
  const key = `meta_device_${deviceId}_${filterType}_${periodIndex}`;
  const stored = localStorage.getItem(key);

  if (stored) {
    return parseFloat(stored);
  }

  // Return default value (can be different per device if needed)
  return 10000;
};

/**
 * Save meta to localStorage
 * @param {Number|String} deviceId - Device ID
 * @param {String} filterType - 'daily' or 'monthly'
 * @param {Number} periodIndex - Period index
 * @param {Number} value - Meta value to save
 */
export const saveMetaToStorage = (deviceId, filterType, periodIndex, value) => {
  const key = `meta_device_${deviceId}_${filterType}_${periodIndex}`;
  localStorage.setItem(key, String(value));
  console.log(`📊 Meta salva para dispositivo ${deviceId}:`, key, '=', value);
};

/**
 * Get all daily data for the current month
 * @param {Array} dailyData - Full daily consumption data
 * @returns {Array} All daily data (all days of current month)
 */
export const getLastSevenDays = (dailyData) => {
  if (!Array.isArray(dailyData)) return [];
  // Return all daily data instead of just last 7 days
  return dailyData;
};

/**
 * Get last 3 months of monthly data
 * @param {Array} monthlyData - Full monthly consumption data
 * @returns {Array} Last 3 months
 */
export const getLastThreeMonths = (monthlyData) => {
  if (!Array.isArray(monthlyData)) return [];
  return monthlyData.slice(Math.max(0, monthlyData.length - 3));
};

/**
 * Load activation time meta from localStorage for a specific device
 * @param {Number|String} deviceId - Device ID
 * @param {String} filterType - 'daily' or 'monthly'
 * @param {Number} periodIndex - Period index (month or day)
 * @returns {Number} Saved activation time meta in hours or default value
 */
export const loadActivationTimeMeta = (deviceId, filterType, periodIndex) => {
  const key = `activation_meta_device_${deviceId}_${filterType}_${periodIndex}`;
  const stored = localStorage.getItem(key);

  if (stored) {
    return parseFloat(stored);
  }

  // Default values: 24 hours for daily, 720 hours for monthly
  return filterType === 'daily' ? 24 : 720;
};

/**
 * Save activation time meta to localStorage for a specific device
 * @param {Number|String} deviceId - Device ID
 * @param {String} filterType - 'daily' or 'monthly'
 * @param {Number} periodIndex - Period index
 * @param {Number} value - Activation time meta in hours
 */
export const saveActivationTimeMeta = (deviceId, filterType, periodIndex, value) => {
  const key = `activation_meta_device_${deviceId}_${filterType}_${periodIndex}`;
  localStorage.setItem(key, String(value));
  console.log(`⏱️ Meta de tempo de atuação salva para dispositivo ${deviceId}:`, key, '=', value);
};
