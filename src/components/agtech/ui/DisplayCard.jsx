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
                {/* Visual Dial */}
                <div className="flex items-center justify-center">
                    <RiskMeter lossPercentage={lossPercentage} colorClass={statusColorClass} />
                </div>

                {/* Total Bin Value */}
                <div className="flex flex-col w-full bg-base-100 p-4 rounded-2xl shadow-inner">
                    <span className="text-base mb-1 ubuntu-bold tracking-wide text-neutral-content/40">Total Bin Value</span>
                    <span className="text-3xl ubuntu-bold text-neutral-content/85 tracking-tight">{formatCurrency(totalValue)}</span>
                </div>

                {/* The main loss highlight */}
                <div className='flex flex-row bg-base-100 items-center justify-between w-full p-5 rounded-2xl shadow-lg transition-colors duration-500'>
                    <div className="flex flex-col">
                        <span className={`text-base mb-1 ubuntu-bold tracking-wide text-neutral-content/40 ${statusColorClass}`}>Estimated Value Loss</span>
                        <span className={`text-3xl ubuntu-bold ${statusColorClass} tracking-tight`}>
                            {formatCurrency(estimatedLoss)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayCard;
