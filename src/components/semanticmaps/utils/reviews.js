import { getSeriesColors } from './colors';

const TYPE_ORDER = ['Weakness', 'Strength'];

/**
 * Normalizes review_scatter5-style data for chart/table use.
 * Uses the full market point set (Strength + Weakness together).
 *
 * @param {object} payload
 * @returns {{ types: string[], axes: object, colorMap: Object, points: Array }}
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

    return { types, axes, colorMap, points };
}
