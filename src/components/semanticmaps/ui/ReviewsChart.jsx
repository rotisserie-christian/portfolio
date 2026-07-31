import { useMemo, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import reviewData from '../data/review_scatter5.json';
import { buildReviewsScatterData } from '../utils/reviews';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function niceMax(value, fallback = 100) {
    if (!Number.isFinite(value) || value <= 0) return fallback;
    const step = value <= 20 ? 5 : 10;
    return Math.min(100, Math.ceil(value / step) * step);
}

export default function ReviewsChart() {
    const [hidden, setHidden] = useState({});

    const { points, types, colorMap, axes } = useMemo(
        () => buildReviewsScatterData(reviewData),
        []
    );

    const visiblePoints = useMemo(
        () => points.filter((p) => !hidden[p.type]),
        [points, hidden]
    );

    const data = useMemo(
        () => ({
            labels: visiblePoints.map((p) => p.label),
            datasets: [
                {
                    label: 'Prevalence',
                    data: visiblePoints.map((p) => p.prevalence),
                    backgroundColor: visiblePoints.map((p) => colorMap[p.type]),
                    borderColor: visiblePoints.map((p) => colorMap[p.type]),
                    borderWidth: 0,
                    borderRadius: 2,
                    barPercentage: 0.8,
                    categoryPercentage: 0.85,
                },
            ],
        }),
        [visiblePoints, colorMap]
    );

    const xMax = useMemo(() => {
        const values = visiblePoints.map((p) => p.prevalence);
        const dataMax = values.length ? Math.max(...values) : 0;
        const domainMax = axes?.y?.domain?.[1];
        return niceMax(dataMax || domainMax, domainMax ?? 100);
    }, [visiblePoints, axes]);

    const toggle = (label) =>
        setHidden((prev) => ({ ...prev, [label]: !prev[label] }));

    const options = useMemo(
        () => ({
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => items[0]?.label ?? '',
                        label: (ctx) => {
                            const point = visiblePoints[ctx.dataIndex];
                            if (!point) return `${ctx.parsed.x}%`;
                            return `Prevalence ${point.prevalence}% · Score ${point.score} · ${point.reviewCount} reviews`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: xMax,
                    grid: { color: '#2a323c' },
                    ticks: {
                        color: '#a6adbb',
                        font: { family: '"Courier New", monospace', weight: 500 },
                    },
                    title: {
                        display: true,
                        text: axes?.y?.label ?? 'Prevalence among all reviews (%)',
                        color: '#a6adbb',
                        font: { size: 14, family: 'Ubuntu", sans-serif', weight: 500 },
                    },
                },
                y: {
                    grid: { color: '#2a323c', drawOnChartArea: false },
                    ticks: {
                        color: '#a6adbb',
                        font: { size: 14, family: 'Ubuntu, sans-serif', weight: 500 },
                        autoSkip: false,
                    },
                },
            },
        }),
        [axes, visiblePoints, xMax]
    );

    const chartHeight = Math.max(350, visiblePoints.length * 22 + 48);

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-5 mb-5">
                {types.map((type) => {
                    const isHidden = !!hidden[type];
                    return (
                        <button
                            key={type}
                            type="button"
                            onClick={() => toggle(type)}
                            className="flex items-center gap-2 ubuntu-medium text-sm text-neutral-content/85 transition-opacity hover:opacity-100 cursor-pointer"
                            style={{ opacity: isHidden ? 0.4 : 1 }}
                        >
                            <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: colorMap[type] }}
                            />
                            <span className={isHidden ? 'line-through' : ''}>{type}</span>
                        </button>
                    );
                })}
            </div>

            <div className="p-4 w-full bg-base-300" style={{ height: chartHeight }}>
                <Bar options={options} data={data} />
            </div>
        </div>
    );
}
