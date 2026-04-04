import RiskMeter from './RiskMeter';

const DisplayCard = ({ logicData }) => {
    const {
        totalValue,
        estimatedLoss,
        lossPercentage,
        riskLevel,
        isSafe,
        isWarning,
        isCritical
    } = logicData;

    // styling based on risk level
    const statusColorClass = isSafe ? "text-success" : isWarning ? "text-warning" : "text-error";
    const statusBgClass = isSafe ? "bg-success/20" : isWarning ? "bg-warning/20" : "bg-error/20";

    // Formatting helpers
    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="flex flex-col w-full h-full justify-between gap-6">

            {/* Top Level Summary container */}
            <div className="flex flex-col gap-4 w-full">
                {/* Total Bin Value */}
                <div className="flex flex-col w-full bg-base-100 p-4 rounded-2xl border border-white/5 shadow-inner">
                    <span className="text-xs uppercase tracking-widest text-neutral-content/40 font-bold">Total Bin Value</span>
                    <span className="text-3xl ubuntu-bold text-neutral-content/85 tracking-tight">{formatCurrency(totalValue)}</span>
                </div>

                {/* The main loss highlight */}
                <div className={`flex flex-row items-center justify-between w-full ${statusBgClass} p-5 rounded-2xl border border-white/10 shadow-lg transition-colors duration-500`}>
                    <div className="flex flex-col">
                        <span className={`text-xs uppercase tracking-widest ${statusColorClass} font-bold mix-blend-screen`}>Estimated Value Loss</span>
                        <span className={`text-4xl lg:text-5xl ubuntu-bold ${statusColorClass} tracking-tighter drop-shadow-sm`}>
                            {formatCurrency(estimatedLoss)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Visual Risk Indicator section */}
            <div className="flex flex-row items-center justify-between px-2 mt-4">
                <div className="flex flex-col">
                    <span className="text-sm uppercase tracking-widest text-neutral-content/40 font-bold mb-1">Status</span>
                    <span className={`text-2xl ubuntu-bold ${statusColorClass} uppercase tracking-wider`}>
                        {riskLevel}
                    </span>
                    <span className="text-xs text-neutral-content/50 mt-1 max-w-[200px]">
                        {isSafe ? "Moisture levels are optimal." : isWarning ? "Monitor closely to prevent further decay." : "Immediate action required. High spoilage rate."}
                    </span>
                </div>

                {/* Visual Dial */}
                <div className="flex items-center justify-center">
                    <RiskMeter lossPercentage={lossPercentage} colorClass={statusColorClass} />
                </div>
            </div>

        </div>
    );
};

export default DisplayCard;
