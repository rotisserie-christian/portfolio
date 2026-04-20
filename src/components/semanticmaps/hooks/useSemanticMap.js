import { useState, useMemo } from "react";
import searchData from "../data/searchterms.json";
import reviewData from "../data/reviews1.json";
import { getClusterColors } from '../utils/colors';

export function useSemanticMap() {
    const [viewMode, setViewMode] = useState('reviews'); // keywords/reviews
    const [activeCluster, setActiveCluster] = useState('all');

    const activeData = useMemo(() => {
        return viewMode === 'keywords' ? searchData : reviewData;
    }, [viewMode]);

    const clusterKey = viewMode === 'keywords' ? 'cluster' : 'type';

    const clusters = useMemo(() => {
        const unique = [...new Set(activeData.map(item => item[clusterKey]))].sort();
        return unique;
    }, [activeData, clusterKey]);

    const filteredData = useMemo(() => {
        if (activeCluster === 'all') return activeData;
        return activeData.filter(item => item[clusterKey] === activeCluster);
    }, [activeData, activeCluster, clusterKey]);

    const colorMap = useMemo(() => {
        if (viewMode === 'reviews') {
            return {
                Strength: {
                    bg: 'hsla(142, 70%, 45%, 0.7)',
                    border: 'hsla(142, 70%, 45%, 1)',
                    indicator: 'hsla(142, 70%, 45%, 1)'
                },
                Weakness: {
                    bg: 'hsla(0, 70%, 50%, 0.7)',
                    border: 'hsla(0, 70%, 50%, 1)',
                    indicator: 'hsla(0, 70%, 50%, 1)'
                }
            };
        }
        return getClusterColors(clusters);
    }, [clusters, viewMode]);

    const handleModeToggle = (checked) => {
        setViewMode(checked ? 'reviews' : 'keywords');
        setActiveCluster('all');
    };

    return {
        viewMode,
        activeCluster,
        setActiveCluster,
        filteredData,
        colorMap,
        clusters,
        clusterKey,
        handleModeToggle
    };
}
