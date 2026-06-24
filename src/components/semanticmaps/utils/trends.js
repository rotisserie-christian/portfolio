/**
 * Transforms Google-Trends-style series data into multi-line chart datasets.
 * Each series is plotted as-is (actual interest values) on a shared y-axis.
 *
 * @param {{ series: Array<{ query: string, points: Array<{ date: string, value: number }> }> }} raw
 * @param {Object} options
 * @param {Object} options.colorMap - map of query -> { border, bg, indicator }
 */
export function buildTrendData(raw, { colorMap = {}, dropTrailing = 3 } = {}) {
    const series = raw?.series ?? [];

    // Drop the most recent buckets: Google Trends under-reports the latest few weeks
    // (preliminary data, revised upward later), so all series dip in lockstep there.
    const trimPartial = (arr) => (dropTrailing > 0 ? arr.slice(0, -dropTrailing) : arr);

    const labels = trimPartial(series[0]?.points.map((p) => p.date) ?? []);

    const datasets = series.map((s) => {
        const color = colorMap[s.query]?.border || '#888';
        return {
            label: s.query,
            data: trimPartial(s.points.map((p) => p.value)),
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

    return { labels, datasets };
}

/** Extracts the trailing year from a label like "Jun 20 – 26, 2021". */
export function yearFromLabel(label = '') {
    const match = String(label).match(/\d{4}/);
    return match ? match[0] : label;
}

/**
 * Formats an x-axis tick label based on the selected time range.
 * Source labels look like "Jun 20 – 26, 2021".
 *  - 3m: "Jun 20" (week start)
 *  - 1y: "Jun" (month)
 *  - 5y: "2021" (year)
 */
export function formatLabel(label = '', range = '5y') {
    const s = String(label);
    if (range === '3m') {
        return s.split(/[–-]/)[0].trim();
    }
    if (range === '1y') {
        return s.split(' ')[0];
    }
    return yearFromLabel(s);
}
