import { useMemo, useState } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import reviewData from '../data/review_scatter5.json';
import { buildReviewsScatterData } from '../utils/reviews';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

function niceMax(value, fallback = 100) {
    if (!Number.isFinite(value) || value <= 0) return fallback;
    const step = value <= 20 ? 5 : 10;
    return Math.min(100, Math.ceil(value / step) * step);
}

export default function ReviewsChart() {
    const [hidden, setHidden] = useState({});

    const { datasets: baseDatasets, axes } = useMemo(
        () => buildReviewsScatterData(reviewData),
        []
    );

    const data = useMemo(
        () => ({
            datasets: baseDatasets.map((d) => ({
                ...d,
                hidden: !!hidden[d.label],
            })),
        }),
        [baseDatasets, hidden]
    );

    const yMax = useMemo(() => {
        const values = baseDatasets.flatMap((d) => d.data.map((p) => p.y));
        const dataMax = values.length ? Math.max(...values) : 0;
        const domainMax = axes?.y?.domain?.[1];
        return niceMax(dataMax || domainMax, domainMax ?? 100);
    }, [baseDatasets, axes]);

    const toggle = (label) =>
        setHidden((prev) => ({ ...prev, [label]: !prev[label] }));

    const options = useMemo(() => {
        const xDomain = axes?.x?.domain ?? [1, 5];
        return {
            responsive: true,
            maintainAspectRatio: false,
            clip: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => items[0]?.raw?.label ?? '',
                        label: (ctx) => {
                            const point = ctx.raw;
                            if (!point) return '';
                            return `Score ${point.score} · ${point.prevalence}% · ${point.reviewCount} reviews`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    type: 'linear',
                    min: xDomain[0],
                    max: xDomain[1],
                    grid: { color: '#2a323c' },
                    ticks: {
                        color: '#a6adbb',
                        font: { family: '"Courier New", monospace', weight: 500 },
                    },
                    title: {
                        display: true,
                        text: axes?.x?.label ?? 'Average review score',
                        color: '#a6adbb',
                        font: { size: 13, family: '"Courier New", monospace', weight: 500 },
                    },
                },
                y: {
                    type: 'linear',
                    beginAtZero: true,
                    max: yMax,
                    grid: { color: '#2a323c' },
                    ticks: {
                        color: '#a6adbb',
                        font: { family: '"Courier New", monospace', weight: 500 },
                    },
                    title: {
                        display: true,
                        text: axes?.y?.label ?? 'Prevalence (%)',
                        color: '#a6adbb',
                        font: { size: 13, family: '"Courier New", monospace', weight: 500 },
                    },
                },
            },
        };
    }, [axes, yMax]);

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-5 mb-5">
                {baseDatasets.map((d) => {
                    const isHidden = !!hidden[d.label];
                    return (
                        <button
                            key={d.label}
                            type="button"
                            onClick={() => toggle(d.label)}
                            className="flex items-center gap-2 ubuntu-medium text-sm text-neutral-content/85 transition-opacity hover:opacity-100 cursor-pointer"
                            style={{ opacity: isHidden ? 0.4 : 1 }}
                        >
                            <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: d.borderColor }}
                            />
                            <span className={isHidden ? 'line-through' : ''}>{d.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="p-4 w-full h-[350px] bg-base-300">
                <Scatter options={options} data={data} />
            </div>
        </div>
    );
}
