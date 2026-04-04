const RiskMeter = ({ lossPercentage, colorClass }) => {
    // Math for a 180-degree SVG Arc
    const radius = 40;
    const arcLength = Math.PI * radius; // Approx 125.66

    // Convert 0-1 percentage to path offset
    const progressOffset = arcLength - (arcLength * lossPercentage);

    // For the display number
    const displayValue = Math.min(100, Math.max(0, lossPercentage * 100));

    return (
        <div className="relative flex flex-col items-center justify-end w-64 h-28">
            {/* The SVG Gauge */}
            <svg
                viewBox="0 0 100 55"
                className={`absolute top-0 w-full h-full overflow-visible ${colorClass}`}
            >
                {/* Thick background track */}
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="opacity-20"
                />

                {/* Dynamic colored progress arc */}
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={arcLength}
                    strokeDashoffset={progressOffset}
                    className="transition-all duration-1000 ease-in-out"
                />
            </svg>

            {/* The inner text using Courier New style */}
            <div className="absolute bottom-0 flex flex-col items-center leading-none">
                <span className={`text-3xl font-bold courier-new ${colorClass} drop-shadow-sm`}>
                    {displayValue.toFixed(0)}<span className="ubuntu-bold text-lg ml-1">%</span>
                </span>
                <span className="courier-new tracking-widest text-neutral-content/40 uppercase font-bold mt-1">
                    Loss
                </span>
            </div>
        </div>
    );
};

export default RiskMeter;
