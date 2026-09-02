import { useMemo, useState } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    LogarithmicScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import censusData from '../data/census.json';
import { buildCensusScatterData } from '../utils/census';

ChartJS.register(LinearScale, LogarithmicScale, PointElement, Tooltip, Legend);

const incomeTick = (value) => `$${(value / 1000).toFixed(0)}k`;
const countTick = (value) =>
    value >= 1_000_000
        ? `${(value / 1_000_000).toFixed(1)}M`
        : `${Math.round(value / 1000)}k`;

export default function CensusChart() {
    const [hidden, setHidden] = useState({});
    const { datasets: baseDatasets } = useMemo(
        () => buildCensusScatterData(censusData),
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

    const toggle = (label) =>
        setHidden((prev) => ({ ...prev, [label]: !prev[label] }));

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            clip: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => items[0]?.raw?.name ?? '',
                        label: (ctx) => {
                            const point = ctx.raw;
                            if (!point) return '';
                            const detachedPct = Number.isFinite(point.pctDetached)
                                ? ` · ${point.pctDetached}% detached`
                                : '';
                            return `${point.state} · Income ${incomeTick(point.x)} · ${countTick(point.y)} detached homes${detachedPct}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    type: 'linear',
                    grid: { color: '#2a323c' },
                    ticks: {
                        color: '#a6adbb',
                        font: { family: '"Courier New", monospace', weight: 500 },
                        callback: incomeTick,
                    },
                    title: {
                        display: true,
                        text: 'Median household income',
                        color: '#a6adbb',
                        font: { size: 13, family: '"Courier New", monospace', weight: 500 },
                    },
                },
                y: {
                    type: 'logarithmic',
                    grid: { color: '#2a323c' },
                    ticks: {
                        color: '#a6adbb',
                        font: { family: '"Courier New", monospace', weight: 500 },
                        callback: countTick,
                    },
                    title: {
                        display: true,
                        text: 'Detached homes',
                        color: '#a6adbb',
                        font: { size: 13, family: '"Courier New", monospace', weight: 500 },
                    },
                },
            },
        }),
        []
    );

    return (
        <div className="w-full">
            <h2 className="ubuntu-medium text-lg text-neutral-content/85 text-center">
                Number of detached homes vs median income: Southern USA
            </h2>
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
