import { getSeriesColors } from './colors';

const TYPE_ORDER = ['Weakness', 'Strength'];

/**
 * Builds Chart.js scatter datasets from review_scatter5-style data, one dataset per type.
 * Uses the full market point set (Strength + Weakness together).
 *
 * @param {object} payload
 * @returns {{ datasets: Array, types: string[], axes: object, colorMap: Object, points: Array }}
 */
export function buildReviewsScatterData(payload) {
    const axes = payload?.market?.axes ?? payload?.axes;
    const rawPoints = payload?.market?.points ?? payload?.points ?? [];
    const types = TYPE_ORDER.filter((type) => rawPoints.some((p) => p.type === type));
    const colorMap = getSeriesColors(types);

    const points = [...rawPoints]
        .map((p) => ({
            id: p.id,
            label: p.label,
            x: p.x,
            y: p.y,
            score: p.score,
            prevalence: p.prevalence,
            reviewCount: p.review_count,
            type: p.type,
            examples: p.examples ?? [],
        }))
        .sort((a, b) => b.prevalence - a.prevalence || b.score - a.score);

    const datasets = types.map((type) => {
        const color = colorMap[type];
        const data = points.filter((p) => p.type === type);

        return {
            label: type,
            data,
            backgroundColor: color,
            borderColor: color,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBorderWidth: 0,
        };
    });

    return { datasets, types, axes, colorMap, points };
}
