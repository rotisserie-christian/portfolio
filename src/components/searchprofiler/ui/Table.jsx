import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { getClusterColors } from '../utils/colors';

export default function Table({ 
    data, 
    clusterKey = 'cluster', 
    labelKey = 'query',
    columns = [
        { key: 'query', label: 'Query', type: 'text' },
        { key: 'avg_interest', label: 'Avg', type: 'number', precision: 2 },
        { key: 'max_interest', label: 'Max', type: 'number', precision: 0 }
    ],
    colorMap: providedColorMap
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const colorMap = useMemo(() => {
        if (providedColorMap) return providedColorMap;
        const uniqueClusters = [...new Set(data.map(item => item[clusterKey]))].sort();
        return getClusterColors(uniqueClusters);
    }, [data, clusterKey, providedColorMap]);

    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div className="w-full flex justify-center py-10 text-neutral-content/40 italic">
                No items found
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
                                {columns.map((col, idx) => (
                                    <th key={idx} className={`bg-base-300 ${idx > 0 ? 'text-right' : ''}`}>
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item, index) => (
                                <tr key={index} className="hover:bg-base-300/50 transition-colors border-base-content/5">
                                    {columns.map((col, idx) => {
                                        if (idx === 0) {
                                            return (
                                                <td key={idx} className="font-medium text-neutral-content/90 max-w-[150px] lg:max-w-xs" title={item[labelKey]}>
                                                    <div className="flex items-center min-w-0">
                                                        <div
                                                            className="w-2 h-2 rounded-full mr-2 shrink-0"
                                                            style={{ backgroundColor: colorMap[item[clusterKey]]?.indicator || '#888' }}
                                                            title={item[clusterKey]}
                                                        />
                                                        <span className="truncate">{item[labelKey]}</span>
                                                    </div>
                                                </td>
                                            );
                                        }
                                        const val = item[col.key];
                                        return (
                                            <td key={idx} className="text-right font-mono text-xs">
                                                {col.type === 'number' ? (typeof val === 'number' ? val.toFixed(col.precision ?? 0) : val) : val}
                                            </td>
                                        );
                                    })}
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
    data: PropTypes.array.isRequired,
    clusterKey: PropTypes.string,
    labelKey: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.string,
        precision: PropTypes.number
    }))
};