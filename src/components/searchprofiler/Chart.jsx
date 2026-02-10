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

export default function Chart() {
    const options = {
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
                        return `${point.query}: Slope ${point.slope}, Avg ${point.x}, Max ${point.y}`;
                    }
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Max Interest',
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
                    text: 'Average Interest',
                    color: '#a6adbb'
                },
                grid: {
                    color: '#2a323c'
                },
                ticks: {
                    color: '#a6adbb'
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 10
                },
                max: 100
            },
        },
    };

    // Group data by cluster
    const clusters = {};
    searchData.forEach((item) => {
        if (!clusters[item.cluster]) {
            clusters[item.cluster] = [];
        }
        clusters[item.cluster].push({
            x: item.avg_interest,
            y: item.max_interest,
            r: 5 + (Math.sqrt(Math.abs(item.slope)) * 40), // Base size + sqrt scaling for visibility
            query: item.query,
            slope: item.slope
        });
    });

    // datasets
    const datasets = Object.keys(clusters).map((cluster, index) => {
        const hue = (index * 137.508) % 360;
        const color = `hsla(${hue}, 70%, 50%, 0.7)`;
        const borderColor = `hsla(${hue}, 70%, 50%, 1)`;

        return {
            label: cluster,
            data: clusters[cluster],
            backgroundColor: color,
            borderColor: borderColor,
        };
    });

    const data = {
        datasets: datasets,
    };

    const legendMargin = {
        id: 'legendMargin',
        beforeInit(chart) {
            const originalFit = chart.legend.fit;
            chart.legend.fit = function fit() {
                originalFit.bind(chart.legend)();
                this.height += 40; // padding bottom on legend 
            };
        }
    };

    return (
        <div className="p-4 w-full h-[450px] max-w-[600px] bg-base-300">
            <Bubble options={options} data={data} plugins={[legendMargin]} />
        </div>
    );
}