import { getSeriesColors } from './colors';

function primaryState(row) {
    const raw = String(row?.state ?? '').trim();
    const first = raw.split('-')[0];
    return first || 'Unknown';
}

/**
 * Builds Chart.js scatter datasets from ACS census rows, one dataset per state.
 * X = median household income, Y = detached housing units.
 *
 * @param {object} payload
 * @returns {{ datasets: Array, states: string[], colorMap: Object, points: Array }}
 */
export function buildCensusScatterData(payload) {
    const rows = payload?.rows ?? [];
    const points = rows
        .filter(
            (r) =>
                Number.isFinite(r.median_hh_income) &&
                Number.isFinite(r.detached_units) &&
                r.detached_units > 0
        )
        .map((r) => ({
            x: r.median_hh_income,
            y: r.detached_units,
            name: r.name,
            state: primaryState(r),
            population: r.population,
            detachedUnits: r.detached_units,
            pctDetached: r.pct_detached,
            inPortfolio: !!r.in_portfolio,
        }));

    const states = [...new Set(points.map((p) => p.state))].sort();
    const colorMap = getSeriesColors(states);

    const datasets = states.map((state) => {
        const color = colorMap[state];
        return {
            label: state,
            data: points.filter((p) => p.state === state),
            backgroundColor: color,
            borderColor: color,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBorderWidth: 0,
        };
    });

    return { datasets, states, colorMap, points };
}
