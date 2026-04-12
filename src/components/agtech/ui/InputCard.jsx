import ToggleSwitch from '@/components/ui/ToggleSwitch';
import InputControls from './InputControls';

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
        <div className="flex flex-col w-full gap-2">
            {/* Grain Selection Toggle */}
            <div className="flex flex-col gap-2 mb-6">
                <div className="flex w-full items-center justify-center p-1">
                    <ToggleSwitch
                        leftLabel="Canola"
                        rightLabel="Wheat"
                        isChecked={grainId === 'wheat'}
                        onChange={(checked) => setGrainId(checked ? 'wheat' : 'canola')}
                    />
                </div>
            </div>

            <InputControls
                label="Bin Capacity"
                value={capacity}
                formattedValue={`${capacity.toLocaleString()} BU`}
                min={1000}
                max={50000}
                step={500}
                onChange={setCapacity}
                onMinus={() => setCapacity(Math.max(1000, capacity - 1000))}
                onPlus={() => setCapacity(Math.min(50000, capacity + 1000))}
            />

            <InputControls
                label="Current Moisture"
                value={currentMoisture}
                formattedValue={`${currentMoisture.toFixed(1)}%`}
                min={5}
                max={25}
                step={0.1}
                onChange={setCurrentMoisture}
                onMinus={() => setCurrentMoisture(Math.max(5, Number((currentMoisture - 1).toFixed(1))))}
                onPlus={() => setCurrentMoisture(Math.min(25, Number((currentMoisture + 1).toFixed(1))))}
            />

            <InputControls
                label="Market Price"
                value={marketPrice}
                formattedValue={`$${marketPrice.toFixed(2)}/BU`}
                min={2}
                max={30}
                step={0.25}
                onChange={setMarketPrice}
                onMinus={() => setMarketPrice(Math.max(2, marketPrice - 1))}
                onPlus={() => setMarketPrice(Math.min(30, marketPrice + 1))}
            />
        </div>
    );
};

export default InputCard;
