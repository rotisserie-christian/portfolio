const RiskMeter = ({ lossPercentage, colorClass }) => {
    // DaisyUI radial progress expects a value from 0 to 100
    const progressValue = Math.min(100, Math.max(0, lossPercentage * 100));

    return (
        <div className="relative flex items-center justify-center">
            {/* Background track */}
            <div
                className="radial-progress text-base-100 absolute opacity-50"
                style={{ "--value": 100, "--size": "6rem", "--thickness": "0.5rem" }}
            ></div>

            {/* progress ring */}
            <div
                className={`radial-progress ${colorClass} transition-all duration-700 ease-in-out`}
                style={{ "--value": progressValue, "--size": "6rem", "--thickness": "0.5rem" }}
                role="progressbar"
                aria-valuenow={progressValue}
                aria-valuemin="0"
                aria-valuemax="100"
            >
                {/* inner text) */}
                <span className="text-xl ubuntu-bold text-neutral-content/85">
                    {progressValue.toFixed(0)}%
                </span>
            </div>

            <div className="absolute top-[80%] uppercase text-[10px] tracking-widest text-neutral-content/40 font-bold">
                Loss
            </div>
        </div>
    );
};

export default RiskMeter;
