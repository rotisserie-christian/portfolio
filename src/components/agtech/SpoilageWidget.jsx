import { useState } from "react";
import { useSpoilageLogic } from "./hooks/useSpoilageLogic";
import { getInitialGrainState } from "./utils/grainUtils";
import InputCard from "./ui/InputCard";
import DisplayCard from "./ui/DisplayCard";

const SpoilageWidget = () => {
    const [state, setState] = useState(getInitialGrainState("canola"));

    const onGrainToggle = (newId) => {
        setState(getInitialGrainState(newId, state.capacity));
    };

    const updateField = (field, val) => {
        setState(prev => ({ ...prev, [field]: val }));
    };

    const logicData = useSpoilageLogic(state.id, state.moisture, state.capacity, state.price);

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 w-full max-w-6xl items-start justify-stretch">

                {/* Inputs */}
                <div className="flex flex-col items-center justify-start w-full lg:w-[50%] p-6 bg-base-300 rounded-2xl shadow-lg h-[410px]">
                    <InputCard
                        grainId={state.id}
                        setGrainId={onGrainToggle}
                        capacity={state.capacity}
                        setCapacity={(val) => updateField('capacity', val)}
                        currentMoisture={state.moisture}
                        setCurrentMoisture={(val) => updateField('moisture', val)}
                        marketPrice={state.price}
                        setMarketPrice={(val) => updateField('price', val)}
                    />
                </div>

                {/* Display & Logic Output */}
                <div className="flex flex-col items-center justify-start w-full lg:w-[50%] p-6 bg-base-300 rounded-2xl shadow-lg h-[410px]">
                    <DisplayCard logicData={logicData} />
                </div>

            </div>
        </div>
    );
};

export default SpoilageWidget;
