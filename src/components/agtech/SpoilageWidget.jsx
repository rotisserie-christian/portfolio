import { useState, useEffect } from "react";
import { grainData } from "./data/grainData";
import { useSpoilageLogic } from "./hooks/useSpoilageLogic";

const SpoilageWidget = () => {
    // Top-level state driving the widget
    const [grainId, setGrainId] = useState("canola");
    const [capacity, setCapacity] = useState(5000); // Default 5000 Bushels
    const [currentMoisture, setCurrentMoisture] = useState(grainData["canola"].safeMoisture);
    const [marketPrice, setMarketPrice] = useState(grainData["canola"].defaultPrice);

    // If the user changes the grain type, we reset the defaults for them
    useEffect(() => {
        setCurrentMoisture(grainData[grainId].safeMoisture);
        setMarketPrice(grainData[grainId].defaultPrice);
    }, [grainId]);

    // Feed state into our logic engine
    const logicData = useSpoilageLogic(grainId, currentMoisture, capacity, marketPrice);

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 w-full max-w-6xl items-start justify-center">

                {/* Inputs */}
                <div className="flex flex-col items-center justify-start w-full lg:w-[50%] p-6 bg-base-300 rounded-[2rem] shadow-xl border border-white/5">
                    <h3 className="text-xl ubuntu-semibold text-neutral-content/85 mb-4">Storage</h3>
                    <div className="w-full h-40 border-2 border-dashed border-base-content/20 rounded-xl flex items-center justify-center text-base-content/40">
                        [Placeholder]
                    </div>
                </div>

                {/* Display & Logic Output */}
                <div className="flex flex-col items-center justify-start w-full lg:w-[50%] p-6 bg-base-300 rounded-[2rem] shadow-xl border border-white/5">
                    <h3 className="text-xl ubuntu-semibold text-neutral-content/85 mb-4">Spoilage Risk</h3>
                    <div className="w-full h-40 border-2 border-dashed border-base-content/20 rounded-xl flex items-center justify-center text-base-content/40">
                        [Placeholder]
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SpoilageWidget;
