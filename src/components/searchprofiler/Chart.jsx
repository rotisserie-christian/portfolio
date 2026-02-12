import { useMemo } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import searchData from './data/searchterms.json';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

export default function Chart({ dataOverride }) {
    const dataToUse = dataOverride || searchData;

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#a6adbb', // base-content color
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const point = context.raw;
                        return `${point.query}: Slope ${point.x}, Avg ${point.y}`;
                    }
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Average Interest',
                    color: '#a6adbb'
                },
                grid: {
                    color: '#2a323c' // base-300
                },
                ticks: {
                    color: '#a6adbb'
                },
                beginAtZero: true,
            },
            x: {
                title: {
                    display: true,
                    text: 'Rate of Change',
                    color: '#a6adbb'
                },
                grid: {
                    color: (context) => {
                        if (context.tick.value === 0) {
                            return '#575c64ff';
                        }
                        return '#2a323c';
                    }
                },
                ticks: {
                    color: '#a6adbb'
                },
                beginAtZero: false,
            },
        },
    }), []);

    // color map for clusters
    const colorMap = useMemo(() => {
        const allClusters = [...new Set(searchData.map(item => item.cluster))].sort();
        const map = {};
        allClusters.forEach((cluster, index) => {
            const hue = (index * 137.508) % 360;
            map[cluster] = {
                bg: `hsla(${hue}, 70%, 50%, 0.7)`,
                border: `hsla(${hue}, 70%, 50%, 1)`
            };
        });
        return map;
    }, []);

    const data = useMemo(() => {
        // Group data by cluster
        const clusters = {};
        dataToUse.forEach((item) => {
            if (!clusters[item.cluster]) {
                clusters[item.cluster] = [];
            }
            clusters[item.cluster].push({
                x: item.slope,
                y: item.avg_interest,
                r: 7,
                query: item.query,
                slope: item.slope,
                max_interest: item.max_interest
            });
        });

        // datasets
        const datasets = Object.keys(clusters).map((cluster) => {
            return {
                label: cluster,
                data: clusters[cluster],
                backgroundColor: colorMap[cluster].bg,
                borderColor: colorMap[cluster].border,
            };
        });

        return { datasets };
    }, [dataToUse, colorMap]);

    const legendMargin = useMemo(() => ({
        id: 'legendMargin',
        beforeInit(chart) {
            const originalFit = chart.legend.fit;
            chart.legend.fit = function fit() {
                originalFit.bind(chart.legend)();
                this.height += 40; // padding bottom on legend 
            };
        }
    }), []);

    return (
        <div className="p-4 w-full h-[450px] bg-base-300">
            <Bubble options={options} data={data} plugins={[legendMargin]} redraw={true} />
        </div>
    );
}