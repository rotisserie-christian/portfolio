import { useEffect, useMemo, useState } from 'react';
import { buildTrendData } from '../utils/trends';
import { getSeriesColors } from '../utils/colors';

const DATASETS = {
    visuals: () => import('../data/joyplotdata1.json'),
    music: () => import('../data/joyplotdata2.json'),
};

/**
 * Loads the trend dataset for the active viewMode 
 * Transforms it into line datasets
 *
 * @param {string} viewMode - 'visuals' | 'music'
 * @param {string[]=} queries - optional allowlist of series labels to include
 * @returns {{ raw: object | null, baseDatasets: Array }}
 */
export function useTrendData(viewMode, queries) {
    const [raw, setRaw] = useState(null);

    useEffect(() => {
        let active = true;
        setRaw(null);
        (DATASETS[viewMode] ?? DATASETS.visuals)().then((mod) => {
            if (active) setRaw(mod.default);
        });
        return () => {
            active = false;
        };
    }, [viewMode]);

    const filteredRaw = useMemo(() => {
        if (!raw) return null;
        if (!queries?.length) return raw;
        const allowed = new Set(queries);
        return {
            ...raw,
            series: raw.series.filter((s) => allowed.has(s.query)),
        };
    }, [raw, queries]);

    const colorMap = useMemo(
        () => (filteredRaw ? getSeriesColors(filteredRaw.series.map((s) => s.query)) : {}),
        [filteredRaw]
    );

    const { datasets: baseDatasets } = useMemo(
        () => buildTrendData(filteredRaw, { colorMap }),
        [filteredRaw, colorMap]
    );

    return { raw: filteredRaw, baseDatasets };
}
