import { useState, useEffect } from "react";
import { grainData } from "./data/grainData";
import { useSpoilageLogic } from "./hooks/useSpoilageLogic";
import InputCard from "./ui/InputCard";
import DisplayCard from "./ui/DisplayCard";

const SpoilageWidget = () => {
    const [grainId, setGrainId] = useState("canola");
    const [capacity, setCapacity] = useState(5000);
    const [currentMoisture, setCurrentMoisture] = useState(grainData["canola"].safeMoisture);
    const [marketPrice, setMarketPrice] = useState(grainData["canola"].defaultPrice);

    // reset the defaults for grain type
    useEffect(() => {
        setCurrentMoisture(grainData[grainId].safeMoisture);
        setMarketPrice(grainData[grainId].defaultPrice);
    }, [grainId]);

    const logicData = useSpoilageLogic(grainId, currentMoisture, capacity, marketPrice);

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 w-full max-w-6xl items-start justify-stretch">

                {/* Inputs */}
                <div className="flex flex-col items-center justify-start w-full lg:w-[50%] p-6 bg-base-300 rounded-[2rem] shadow-xl border border-white/5">
                    <h3 className="text-xl ubuntu-semibold text-neutral-content/85 mb-6 w-full text-left">Storage</h3>
                    <InputCard
                        grainId={grainId}
                        setGrainId={setGrainId}
                        capacity={capacity}
                        setCapacity={setCapacity}
                        currentMoisture={currentMoisture}
                        setCurrentMoisture={setCurrentMoisture}
                        marketPrice={marketPrice}
                        setMarketPrice={setMarketPrice}
                    />
                </div>

                {/* Display & Logic Output */}
                <div className="flex flex-col items-center justify-start w-full lg:w-[50%] p-6 bg-base-300 rounded-[2rem] shadow-xl border border-white/5 h-full">
                    <h3 className="text-xl ubuntu-semibold text-neutral-content/85 mb-6 w-full text-left">Spoilage Risk</h3>
                    <DisplayCard logicData={logicData} />
                </div>

            </div>
        </div>
    );
};

export default SpoilageWidget;
