import { useMemo, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import reviewData from '../data/review_scatter5.json';
import { buildReviewsScatterData } from '../utils/reviews';

const PAGE_SIZE = 10;

export default function ReviewsTable() {
    const [page, setPage] = useState(0);
    const { points, colorMap } = useMemo(
        () => buildReviewsScatterData(reviewData),
        []
    );

    const pageCount = Math.max(1, Math.ceil(points.length / PAGE_SIZE));
    const pagePoints = points.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    return (
        <div className="w-full flex flex-col">
            <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                    <thead>
                        <tr className="ubuntu-medium text-neutral-content/70">
                            <th className="bg-base-300">cluster</th>
                            <th className="bg-base-300 text-right">score</th>
                            <th className="bg-base-300 text-right">prev.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagePoints.map((p) => (
                            <tr key={`${p.type}-${p.id}`} className="border-white/5">
                                <td className="ubuntu-regular text-neutral-content/85">
                                    <span className="inline-flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-full shrink-0"
                                            style={{ backgroundColor: colorMap[p.type] }}
                                        />
                                        <span>{p.label}</span>
                                    </span>
                                </td>
                                <td className="courier-new text-neutral-content/75 text-right whitespace-nowrap">
                                    {p.score}
                                </td>
                                <td className="courier-new text-neutral-content/75 text-right whitespace-nowrap">
                                    {p.prevalence}
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
