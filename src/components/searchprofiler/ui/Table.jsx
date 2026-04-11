import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { getClusterColors } from '../utils/colors';

export default function Table({ data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const colorMap = useMemo(() => getClusterColors(), []);

    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div className="w-full flex justify-center py-10 text-neutral-content/40 italic">
                No queries found
            </div>
        );
    }

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="w-full overflow-hidden rounded-xl border border-base-content/10 bg-base-200/50 backdrop-blur-sm">
                <div className="overflow-x-auto h-[410px] lg:h-[520px] scrollbar-thin scrollbar-thumb-base-content/10">
                    <table className="table table-sm lg:table-md table-pin-rows">
                        <thead className="bg-base-300 text-neutral-content/85">
                            <tr>
                                <th className="bg-base-300">Query</th>
                                <th className="bg-base-300 text-right">Avg</th>
                                <th className="bg-base-300 text-right">Max</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item, index) => (
                                <tr key={index} className="hover:bg-base-300/50 transition-colors border-base-content/5">
                                    <td className="font-medium text-neutral-content/90 max-w-[150px] lg:max-w-xs" title={item.query}>
                                        <div className="flex items-center min-w-0">
                                            <div
                                                className="w-2 h-2 rounded-full mr-2 shrink-0"
                                                style={{ backgroundColor: colorMap[item.cluster]?.indicator || '#888' }}
                                                title={item.cluster}
                                            />
                                            <span className="truncate">{item.query}</span>
                                        </div>
                                    </td>
                                    <td className="text-right font-mono text-xs">{item.avg_interest.toFixed(2)}</td>
                                    <td className="text-right font-mono text-xs">{item.max_interest.toFixed(0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 text-neutral-content/70">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="btn btn-ghost btn-sm btn-circle disabled:bg-transparent disabled:text-neutral-content/20 hover:bg-base-content/10 transition-colors"
                    >
                        <FaAngleLeft size={18} />
                    </button>

                    <span className="font-mono text-sm tracking-widest opacity-80 select-none">
                        {currentPage} / {totalPages}
                    </span>

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="btn btn-ghost btn-sm btn-circle disabled:bg-transparent disabled:text-neutral-content/20 hover:bg-base-content/10 transition-colors"
                    >
                        <FaAngleRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}

Table.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        query: PropTypes.string,
        cluster: PropTypes.string,
        avg_interest: PropTypes.number,
        max_interest: PropTypes.number
    })).isRequired
};