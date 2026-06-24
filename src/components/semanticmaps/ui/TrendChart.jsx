import { useMemo, useState } from 'react';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Title,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { buildTrendData, formatLabel } from '../utils/trends';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Title);

const RANGES = [
    { id: '5y', weeks: Infinity },
    { id: '1y', weeks: 52 },
    { id: '3m', weeks: 13 },
];

export default function TrendChart({ raw, colorMap, viewMode, onModeToggle }) {
    const [hidden, setHidden] = useState({});
    const [range, setRange] = useState('5y');

    const { labels, datasets: baseDatasets } = useMemo(
        () => buildTrendData(raw, { colorMap }),
        [raw, colorMap]
    );

    const data = useMemo(() => {
        const weeks = RANGES.find((r) => r.id === range)?.weeks ?? Infinity;
        const count = weeks === Infinity ? labels.length : Math.min(labels.length, weeks);
        const slice = (arr) => arr.slice(arr.length - count);
        return {
            labels: slice(labels),
            datasets: baseDatasets.map((d) => ({
                ...d,
                data: slice(d.data),
                hidden: !!hidden[d.label],
            })),
        };
    }, [labels, baseDatasets, hidden, range]);

    const toggle = (label) =>
        setHidden((prev) => ({ ...prev, [label]: !prev[label] }));

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
                },
            },
        },
        scales: {
            x: {
                type: 'category',
                grid: { color: '#2a323c' },
                ticks: {
                    color: '#a6adbb',
                    autoSkip: true,
                    maxTicksLimit: 6,
                    maxRotation: 0,
                    font: { family: '"Courier New", monospace', weight: 500 },
                    callback(index) {
                        return formatLabel(this.getLabelForValue(index), range);
                    },
                },
            },
            y: {
                type: 'linear',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Search Interest',
                    color: '#a6adbb',
                    font: { size: 13, family: '"Courier New", monospace', weight: 500 },
                },
                grid: { color: '#2a323c' },
                ticks: {
                    color: '#a6adbb',
                    font: { family: '"Courier New", monospace', weight: 500 },
                },
            },
        },
    }), [range]);

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
                <Line options={options} data={data} />
            </div>
            
            <div className="flex justify-center w-full mt-6 mb-4">
                <ToggleSwitch
                    leftLabel="Visuals"
                    rightLabel="Music"
                    isChecked={viewMode === 'music'}
                    onChange={onModeToggle}
                />
            </div>

            <div className='flex flex-row items-center justify-center gap-2'>
                {RANGES.map((r) => (
                    <button
                        key={r.id}
                        type="button"
                        onClick={() => setRange(r.id)}
                        className={`btn btn-sm border-2 rounded-lg ${
                            range === r.id
                                ? 'border-cyan-200/50 text-cyan-200/80'
                                : 'bg-base-300 border-white/2 text-neutral-content/60'
                        }`}
                    >
                        {r.id}
                    </button>
                ))}
            </div>
        </div>
    );
}
