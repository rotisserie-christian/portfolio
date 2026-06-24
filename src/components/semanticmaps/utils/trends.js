/**
 * Transforms time series data into chart datasets
 * Each series is plotted as-is (actual interest values) against real timestamps
 *
 * @param {{ series: Array<{ query: string, points: Array<{ timestamp: string, value: number }> }> }} raw
 * @param {Object} options
 * @param {Object} options.colorMap - map of query -> color string
 * @param {number} options.dropTrailing - number of trailing buckets to drop
 */
export function buildTrendData(raw, { colorMap = {}, dropTrailing = 3 } = {}) {
    const series = raw?.series ?? [];

    // Drop the most recent buckets: Google Trends under-reports the latest few weeks
    const trimPartial = (arr) => (dropTrailing > 0 ? arr.slice(0, -dropTrailing) : arr);

    const datasets = series.map((s) => {
        const color = colorMap[s.query] || '#888';
        return {
            label: s.query,
            data: trimPartial(
                s.points.map((p) => ({
                    x: Number(p.timestamp) * 1000,
                    y: p.value,
                }))
            ),
            borderColor: color,
            backgroundColor: color,
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBorderColor: color,
            tension: 0.3,
            fill: false,
        };
    });

    return { datasets };
}
