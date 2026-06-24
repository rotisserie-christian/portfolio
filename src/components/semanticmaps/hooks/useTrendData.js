import { useEffect, useMemo, useState } from 'react';
import { buildTrendData } from '../utils/trends';
import { getClusterColors } from '../utils/colors';

const DATASETS = {
    visuals: () => import('../data/joyplotdata1.json'),
    music: () => import('../data/joyplotdata2.json'),
};

/**
 * Loads the trend dataset for the active viewMode 
 * Transforms it into line datasets
 *
 * @param {string} viewMode - 'visuals' | 'music'
 * @returns {{ raw: object | null, baseDatasets: Array }}
 */
export function useTrendData(viewMode) {
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

    const colorMap = useMemo(
        () => (raw ? getClusterColors(raw.series.map((s) => s.query)) : {}),
        [raw]
    );

    const { datasets: baseDatasets } = useMemo(
        () => buildTrendData(raw, { colorMap }),
        [raw, colorMap]
    );

    return { raw, baseDatasets };
}
