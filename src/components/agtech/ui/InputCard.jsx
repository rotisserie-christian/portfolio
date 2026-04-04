import { FaMinus, FaPlus } from 'react-icons/fa';
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
            <div className="flex flex-col gap-2 mb-4">
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
            <div className="flex flex-col items-center w-full justify-center gap-2 mb-4">
                <div className="flex justify-between items-end w-full">
                    <label className="text-base ubuntu-bold tracking-wide text-neutral-content/70 ml-1">Bin Capacity</label>
                    <span className="text-base courier-new font-semibold text-neutral-content/70">{capacity.toLocaleString()} BU</span>
                </div>

                <div className='flex items-center justify-between gap-6 w-full mt-2'>
                    <FaMinus
                        className='text-cyan-200/90 cursor-pointer hover:text-cyan-100 transition-colors'
                        onClick={() => setCapacity(Math.max(1000, capacity - 1000))}
                    />
                    <input
                        type="range"
                        min="1000"
                        max="50000"
                        step="500"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        className="range range-xs w-full text-white/60"
                        style={{ "--range-shdw": "var(--fallback-n)" }}
                    />
                    <FaPlus
                        className='text-cyan-200/90 cursor-pointer hover:text-cyan-100 transition-colors'
                        onClick={() => setCapacity(Math.min(50000, capacity + 1000))}
                    />
                </div>
            </div>

            {/* Moisture Level Input */}
            <div className="flex flex-col items-center w-full justify-center gap-2 mb-4">
                <div className="flex justify-between items-end w-full">
                    <label className="text-base ubuntu-bold tracking-wide text-neutral-content/70 ml-1">Current Moisture</label>
                    <span className="text-base courier-new font-semibold text-neutral-content/70">{currentMoisture.toFixed(1)}%</span>
                </div>
                <div className='flex items-center justify-between gap-6 w-full mt-2'>
                    <FaMinus
                        className='text-cyan-200/90 cursor-pointer hover:text-cyan-100 transition-colors'
                        onClick={() => setCurrentMoisture(Math.max(5, Number((currentMoisture - 1).toFixed(1))))}
                    />
                    <input
                        type="range"
                        min="5"
                        max="25"
                        step="0.1"
                        value={currentMoisture}
                        onChange={(e) => setCurrentMoisture(Number(e.target.value))}
                        className="range range-xs w-full"
                        style={{ "--range-shdw": "var(--fallback-n)" }}
                    />
                    <FaPlus
                        className='text-cyan-200/90 cursor-pointer hover:text-cyan-100 transition-colors'
                        onClick={() => setCurrentMoisture(Math.min(25, Number((currentMoisture + 1).toFixed(1))))}
                    />
                </div>
            </div>

            {/* Market Price Input */}
            <div className="flex flex-col items-center w-full justify-center gap-2 mb-4">
                <div className="flex justify-between items-end w-full">
                    <label className="text-base ubuntu-bold tracking-wide text-neutral-content/70 ml-1">Market Price</label>
                    <span className="text-base courier-new font-semibold text-neutral-content/70">${marketPrice.toFixed(2)}/BU</span>
                </div>
                <div className='flex items-center justify-between gap-6 w-full mt-2'>
                    <FaMinus
                        className='text-cyan-200/90 cursor-pointer hover:text-cyan-100 transition-colors'
                        onClick={() => setMarketPrice(Math.max(2, marketPrice - 1))}
                    />
                    <input
                        type="range"
                        min="2"
                        max="30"
                        step="0.25"
                        value={marketPrice}
                        onChange={(e) => setMarketPrice(Number(e.target.value))}
                        className="range range-xs w-full"
                        style={{ "--range-shdw": "var(--fallback-n)" }}
                    />
                    <FaPlus
                        className='text-cyan-200/90 cursor-pointer hover:text-cyan-100 transition-colors'
                        onClick={() => setMarketPrice(Math.min(30, marketPrice + 1))}
                    />
                </div>
            </div>

        </div>
    );
};

export default InputCard;
