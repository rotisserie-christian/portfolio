import { differenceInDays, subMonths } from 'date-fns';

/**
 * Calculate one rep max using the Brzycki formula
 * @param {number} weight - Weight lifted
 * @param {number} reps - Number of repetitions
 * @returns {number} Estimated one rep max
 */
export const calculateOneRepMax = (weight, reps) => {
  return Math.round(weight / (1.0278 - 0.0278 * reps));
};

/**
 * Calculate time-based changes
 * @param {Array} data - Array of fitness entries with date and oneRepMax properties
 * @returns {Array} Data with calculated changes
 */
export const calculateChanges = (data) => {
  return data.map((entry, index) => {
    if (index === 0) return entry;

    const getChangeValue = (daysBack) => {
      const entryDate = new Date(entry.date.year, entry.date.month - 1, entry.date.day);
      const pastIndex = data.findIndex(pastEntry => {
        const pastDate = new Date(pastEntry.date.year, pastEntry.date.month - 1, pastEntry.date.day);
        return differenceInDays(entryDate, pastDate) >= daysBack;
      });
      return entry.oneRepMax.max - (pastIndex !== -1 ? data[pastIndex].oneRepMax.max : data[0].oneRepMax.max);
    };

    return {
      ...entry,
      oneRepMax: {
        ...entry.oneRepMax,
        weekChange: getChangeValue(7),
        monthChange: getChangeValue(30),
        threeMonthChange: getChangeValue(90),
        sixMonthChange: getChangeValue(180),
        yearChange: getChangeValue(365),
        allChange: entry.oneRepMax.max - data[0].oneRepMax.max
      }
    };
  });
};

/**
 * Get available time ranges based on data span
 * @param {Array} data - Array of fitness entries
 * @returns {Array} Available time ranges
 */
export const getAvailableTimeRanges = (data) => {
  if (data.length < 2) return ['all'];
  
  const firstDate = new Date(data[0].date.year, data[0].date.month - 1, data[0].date.day);
  const lastDate = new Date(data[data.length - 1].date.year, data[data.length - 1].date.month - 1, data[data.length - 1].date.day);
  const daysDifference = differenceInDays(lastDate, firstDate);
  
  const ranges = ['1m', '3m', '6m', '1y', 'all'];
  const dayThresholds = {
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365
  };

  return ranges.filter(range => {
    if (range === 'all') return true;
    return daysDifference >= dayThresholds[range];
  });
};

/**
 * Filter data by time range
 * @param {Array} data - Array of fitness entries
 * @param {string} activeTimeRange - Time range to filter by
 * @returns {Array} Filtered data
 */
export const filterDataByTimeRange = (data, activeTimeRange) => {
  if (activeTimeRange === 'all') return data;

  const lastDate = new Date(data[data.length - 1].date.year, data[data.length - 1].date.month - 1, data[data.length - 1].date.day);
  const cutoffDate = subMonths(lastDate, { '1m': 1, '3m': 3, '6m': 6, '1y': 12 }[activeTimeRange]);

  return data.filter(entry => {
    const entryDate = new Date(entry.date.year, entry.date.month - 1, entry.date.day);
    return entryDate >= cutoffDate;
  });
};

/**
 * Get estimated max from filtered data
 * @param {Array} filteredData - Filtered fitness data
 * @param {string} activeTimeRange - Current time range
 * @returns {number} Estimated max weight
 */
export const getEstimatedMax = (filteredData, activeTimeRange) => {
  if (filteredData.length === 0) return 0;
  const max = Math.max(...filteredData.map(entry => entry.oneRepMax.max));
  console.log(`Estimated max for ${activeTimeRange}: ${max}`);
  return max;
};
