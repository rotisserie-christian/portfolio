import { useMemo, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import censusData from '../data/census.json';
import { buildCensusScatterData } from '../utils/census';

const PAGE_SIZE = 10;

const incomeFmt = (value) =>
    `$${Math.round(value).toLocaleString('en-US')}`;

const countFmt = (value) => Math.round(value).toLocaleString('en-US');

export default function CensusTable() {
    const [page, setPage] = useState(0);
    const { points, colorMap } = useMemo(
        () => buildCensusScatterData(censusData),
        []
    );

    const rows = useMemo(
        () => [...points].sort((a, b) => b.y - a.y || b.x - a.x),
        [points]
    );

    const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const pageRows = rows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    return (
        <div className="w-full flex flex-col">
            <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                    <thead>
                        <tr className="ubuntu-medium text-neutral-content/70">
                            <th className="bg-base-300">area</th>
                            <th className="bg-base-300 text-right"># detached</th>
                            <th className="bg-base-300 text-right">median income</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.map((row) => (
                            <tr key={`${row.name}-${row.state}`} className="border-white/5">
                                <td className="ubuntu-regular text-neutral-content/85">
                                    <span className="inline-flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-full shrink-0"
                                            style={{ backgroundColor: colorMap[row.state] }}
                                        />
                                        <span>{row.name}</span>
                                    </span>
                                </td>
                                <td className="courier-new text-neutral-content/75 text-right whitespace-nowrap">
                                    {countFmt(row.y)}
                                </td>
                                <td className="courier-new text-neutral-content/75 text-right whitespace-nowrap">
                                    {incomeFmt(row.x)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
                <button
                    type="button"
                    className="btn btn-ghost btn-sm px-2 disabled:opacity-30"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    aria-label="Previous page"
                >
                    <FaAngleLeft className="w-5 h-5 text-neutral-content/85" />
                </button>
                <span className="ubuntu-medium text-sm text-neutral-content/70">
                    {page + 1} of {pageCount}
                </span>
                <button
                    type="button"
                    className="btn btn-ghost btn-sm px-2 disabled:opacity-30"
                    disabled={page >= pageCount - 1}
                    onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                    aria-label="Next page"
                >
                    <FaAngleRight className="w-5 h-5 text-neutral-content/85" />
                </button>
            </div>
        </div>
    );
}
