import searchData from '../data/searchterms.json';

export const getClusterColors = () => {
    const allClusters = [...new Set(searchData.map(item => item.cluster))].sort();
    const map = {};
    allClusters.forEach((cluster, index) => {
        const hue = (index * 137.508) % 360;
        map[cluster] = {
            bg: `hsla(${hue}, 70%, 50%, 0.7)`,
            border: `hsla(${hue}, 70%, 50%, 1)`,
            indicator: `hsla(${hue}, 70%, 50%, 1)`
        };
    });
    return map;
};
