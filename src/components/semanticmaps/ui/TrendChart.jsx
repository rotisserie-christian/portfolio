import { useMemo, useState } from 'react';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Title,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { useTrendData } from '../hooks/useTrendData';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Title);

const RANGES = [
    { id: '5y', weeks: Infinity },
    { id: '1y', weeks: 52 },
    { id: '3m', weeks: 13 },
];

// Time scale snaps ticks to calendar boundaries, so they're evenly spaced no matter where the data starts.
const TIME_UNITS = { '5y': 'year', '1y': 'month', '3m': 'week' };
const DISPLAY_FORMATS = { year: 'yyyy', month: 'MMM', week: 'MMM d', day: 'MMM d' };

export default function TrendChart({ viewMode, onModeToggle }) {
    const [hidden, setHidden] = useState({});
    const [range, setRange] = useState('5y');
    const { raw, baseDatasets } = useTrendData(viewMode);

    const data = useMemo(() => {
        const weeks = RANGES.find((r) => r.id === range)?.weeks ?? Infinity;
        const slice = (arr) =>
            weeks === Infinity ? arr : arr.slice(Math.max(0, arr.length - weeks));
        return {
            datasets: baseDatasets.map((d) => ({
                ...d,
                data: slice(d.data),
                hidden: !!hidden[d.label],
            })),
        };
    }, [baseDatasets, hidden, range]);

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
                    title: (items) =>
                        new Date(items[0].parsed.x).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        }),
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
                },
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: TIME_UNITS[range],
                    displayFormats: DISPLAY_FORMATS,
                },
                grid: { color: '#2a323c' },
                ticks: {
                    color: '#a6adbb',
                    autoSkip: true,
                    maxTicksLimit: 6,
                    maxRotation: 0,
                    font: { family: '"Courier New", monospace', weight: 500 },
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
                {raw ? (
                    <Line options={options} data={data} />
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                )}
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
