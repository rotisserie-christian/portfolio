import { getSeriesColors } from './colors';

export const OMIT_CLUSTERS = ['visual loops'];

/**
 * Builds Chart.js scatter datasets from validated terms, one dataset per cluster.
 * X = max interest, Y = average interest.
 *
 * @param {Array} terms
 * @param {{ omitClusters?: string[] }} [options]
 * @returns {{ datasets: Array, clusters: string[], colorMap: Object, terms: Array }}
 */
export function buildScatterData(terms = [], { omitClusters = OMIT_CLUSTERS } = {}) {
    const omitted = new Set(omitClusters);
    const filtered = terms.filter((t) => !omitted.has(t.cluster));
    const clusters = [...new Set(filtered.map((t) => t.cluster))];
    const colorMap = getSeriesColors(clusters);

    const datasets = clusters.map((cluster) => {
        const color = colorMap[cluster];
        const points = filtered
            .filter((t) => t.cluster === cluster)
            .map((t) => ({
                x: Math.min(t.metrics.max_interest, 100),
                y: Math.min(t.metrics.avg_interest, 100),
                query: t.query,
                trend: t.metrics.trend_direction,
            }));

        return {
            label: cluster,
            data: points,
            backgroundColor: color,
            borderColor: color,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBorderWidth: 0,
        };
    });

    return { datasets, clusters, colorMap, terms: filtered };
}
