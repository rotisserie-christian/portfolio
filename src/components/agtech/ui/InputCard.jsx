import ToggleSwitch from '../../ui/ToggleSwitch';

const InputCard = ({
    grainId,
    setGrainId,
    capacity,
    setCapacity,
    currentMoisture,
    setCurrentMoisture,
    marketPrice,
    setMarketPrice
}) => {
    return (
        <div className="flex flex-col w-full gap-6">
            
            {/* Grain Selection Toggle */}
            <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-neutral-content/40 font-bold ml-1">Commodity</label>
                <div className="flex w-full items-center justify-center p-1">
                    <ToggleSwitch 
                        leftLabel="Canola"
                        rightLabel="Wheat"
                        isChecked={grainId === 'wheat'}
                        onChange={(checked) => setGrainId(checked ? 'wheat' : 'canola')}
                    />
                </div>
            </div>

            {/* Capacity Input */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <label className="text-xs uppercase tracking-widest text-neutral-content/40 font-bold ml-1">Bin Capacity</label>
                    <span className="text-sm ubuntu-bold text-neutral-content/85">{capacity.toLocaleString()} BU</span>
                </div>
                <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="500"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="range range-xs range-primary"
                />
            </div>

            {/* Moisture Level Input */}
            <div className="flex flex-col gap-2">
                 <div className="flex justify-between items-end">
                    <label className="text-xs uppercase tracking-widest text-neutral-content/40 font-bold ml-1">Current Moisture</label>
                    <span className="text-sm ubuntu-bold text-neutral-content/85">{currentMoisture.toFixed(1)}%</span>
                </div>
                <input
                    type="range"
                    min="5"
                    max="25"
                    step="0.1"
                    value={currentMoisture}
                    onChange={(e) => setCurrentMoisture(Number(e.target.value))}
                    className="range range-xs range-accent"
                />
            </div>

            {/* Market Price Input */}
            <div className="flex flex-col gap-2">
                 <div className="flex justify-between items-end">
                    <label className="text-xs uppercase tracking-widest text-neutral-content/40 font-bold ml-1">Market Price</label>
                    <span className="text-sm ubuntu-bold text-neutral-content/85">${marketPrice.toFixed(2)}/BU</span>
                </div>
                <input
                    type="range"
                    min="2"
                    max="30"
                    step="0.25"
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(Number(e.target.value))}
                    className="range range-xs"
                    style={{ "--range-shdw": "var(--fallback-n)" }}
                />
            </div>

        </div>
    );
};

export default InputCard;
