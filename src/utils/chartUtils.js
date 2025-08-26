import { format } from 'date-fns';

/**
 * Generate chart data
 * @param {Array} filteredData - Filtered fitness data
 * @returns {Object} Chart data object
 */
export const generateChartData = (filteredData) => {
  const labels = filteredData.map(entry => new Date(entry.date.year, entry.date.month - 1, entry.date.day));

  const datasets = [
    {
      label: '1RM',
      data: filteredData.map(entry => entry.oneRepMax.max),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      tension: 0.1,
    },
  ];

  return {
    labels: labels.map(date => format(date, 'yyyy-MM-dd')),
    datasets,
  };
};

/**
 * Generate chart options
 * @param {string} activeTimeRange - Current time range
 * @param {Array} maxValues - Array of maximum values
 * @returns {Object} Chart options object
 */
export const generateChartOptions = (activeTimeRange, maxValues) => ({
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    point: {
      radius: 0,
    },
    line: {
      tension: 0.1,
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: activeTimeRange === '1m' ? 'week' : 'month',
        displayFormats: {
          week: 'MMM d',
          month: 'MMM yyyy'
        }
      },
      ticks: {
        source: 'auto',
        maxTicksLimit: 4,
        autoSkip: true,
        callback: function(value, index) {
          if (index === 0) return '';
          const date = new Date(value);
          return activeTimeRange === '1m' ? format(date, 'MMM d') : format(date, 'MMM yyyy');
        },
      },
    },
    y: {
      suggestedMax: Math.max(...maxValues) + 10,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
});
