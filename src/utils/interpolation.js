/**
 * Linear interpolation between two values
 * @param {number} start - Starting value
 * @param {number} end - Ending value  
 * @param {number} steps - Number of steps to interpolate
 * @returns {number[]} Array of interpolated values
 */
export function interpolate(start, end, steps) {
  const result = [];
  for (let i = 0; i < steps; i++) {
    result.push(start + (end - start) * (i / (steps - 1)));
  }
  return result;
}

/**
 * Interpolate between two RGB colors
 * @param {string} color1 - Starting RGB color
 * @param {string} color2 - Ending RGB color
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {string} Interpolated RGB color
 */
export function interpolateColor(color1, color2, factor) {
  const result = color1.slice(4, -1).split(',').map((num, idx) => {
    return Math.round(parseInt(num) + factor * (parseInt(color2.slice(4, -1).split(',')[idx]) - parseInt(num)));
  });
  return `rgb(${result.join(',')})`;
}

/**
 * Apply moving average smoothing to data
 * @param {number[]} data - Input data array
 * @param {number} windowSize - Size of the smoothing window
 * @returns {number[]} Smoothed data array
 */
export function movingAverage(data, windowSize) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const end = i + 1;
    const window = data.slice(start, end);
    const average = window.reduce((sum, val) => sum + val, 0) / window.length;
    result.push(average);
  }
  return result;
}