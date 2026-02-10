import PropTypes from 'prop-types';

export default function Table({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full flex justify-center py-10 text-neutral-content/40 italic">
                No queries found
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-xl border border-base-content/10 bg-base-200/50 backdrop-blur-sm">
            <div className="overflow-x-auto h-[350px] lg:h-[450px] scrollbar-thin scrollbar-thumb-base-content/10">
                <table className="table table-sm lg:table-md table-pin-rows">
                    <thead className="bg-base-300 text-neutral-content/85">
                        <tr>
                            <th className="bg-base-300">Query</th>
                            <th className="bg-base-300 text-right">Avg</th>
                            <th className="bg-base-300 text-right">Max</th>
                            <th className="bg-base-300 text-right">Slope (3m)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-base-300/50 transition-colors border-base-content/5">
                                <td className="font-medium text-neutral-content/90 truncate max-w-[150px] lg:max-w-xs" title={item.query}>
                                    {item.query}
                                </td>
                                <td className="text-right font-mono text-xs">{item.avg_interest.toFixed(2)}</td>
                                <td className="text-right font-mono text-xs">{item.max_interest.toFixed(0)}</td>
                                <td className={`text-right font-mono text-xs ${item.slope > 0 ? 'text-success' : item.slope < 0 ? 'text-error' : ''}`}>
                                    {item.slope > 0 ? `+${item.slope.toFixed(4)}` : item.slope.toFixed(4)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

Table.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        query: PropTypes.string,
        cluster: PropTypes.string,
        slope: PropTypes.number,
        avg_interest: PropTypes.number,
        max_interest: PropTypes.number
    })).isRequired
};