import { useMemo, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import validatedTerms from '../data/validatedterms8.json';
import { buildScatterData, OMIT_CLUSTERS } from '../utils/scatter';

const PAGE_SIZE = 10;

export default function TrendTable() {
    const [page, setPage] = useState(0);
    const { terms, colorMap } = useMemo(
        () => buildScatterData(validatedTerms, { omitClusters: OMIT_CLUSTERS }),
        []
    );

    const pageCount = Math.max(1, Math.ceil(terms.length / PAGE_SIZE));
    const pageTerms = terms.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    return (
        <div className="w-full flex flex-col">
            <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                    <thead>
                        <tr className="ubuntu-medium text-neutral-content/70">
                            <th className="bg-base-300">term</th>
                            <th className="bg-base-300 text-right">avg</th>
                            <th className="bg-base-300 text-right">max</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageTerms.map((t) => (
                            <tr key={t.query} className="border-white/5">
                                <td className="ubuntu-regular text-neutral-content/85">
                                    <span className="inline-flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-full shrink-0"
                                            style={{ backgroundColor: colorMap[t.cluster] }}
                                        />
                                        <span>{t.query}</span>
                                    </span>
                                </td>
                                <td className="courier-new text-neutral-content/75 text-right whitespace-nowrap">
                                    {t.metrics.avg_interest}
                                </td>
                                <td className="courier-new text-neutral-content/75 text-right whitespace-nowrap">
                                    {t.metrics.max_interest}
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
