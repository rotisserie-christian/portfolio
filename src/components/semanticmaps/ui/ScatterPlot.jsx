import { useMemo, useState } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import validatedTerms from '../data/validatedterms8.json';
import { buildScatterData, OMIT_CLUSTERS } from '../utils/scatter';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export default function ScatterPlot() {
    const [hidden, setHidden] = useState({});
    const { datasets: baseDatasets } = useMemo(
        () => buildScatterData(validatedTerms, { omitClusters: OMIT_CLUSTERS }),
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
                        title: (items) => items[0]?.raw?.query ?? '',
                        label: () => '',
                    },
                },
            },
            scales: {
                x: {
                    type: 'linear',
                    beginAtZero: true,
                    max: 100,
                    grid: { color: '#2a323c' },
                    ticks: {
                        color: '#a6adbb',
                        font: { family: '"Courier New", monospace', weight: 500 },
                    },
                    title: {
                        display: true,
                        text: 'Max Interest',
                        color: '#a6adbb',
                        font: { size: 13, family: '"Courier New", monospace', weight: 500 },
                    },
                },
                y: {
                    type: 'linear',
                    beginAtZero: true,
                    max: 100,
                    grid: { color: '#2a323c' },
                    ticks: {
                        color: '#a6adbb',
                        font: { family: '"Courier New", monospace', weight: 500 },
                    },
                    title: {
                        display: true,
                        text: 'Average Interest',
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
