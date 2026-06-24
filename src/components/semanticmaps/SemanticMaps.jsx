import { FaAngleDoubleRight } from "react-icons/fa";
import WhatItDoes from "./WhatItDoes";
import LazyTrendChart from "./ui/LazyTrendChart";
import { useSemanticMap } from "./hooks/useSemanticMap";
import { getClusterColors } from "./utils/colors";

const ROUTES_COLOR_MAP = getClusterColors(["Genre-Specific Tools", "Visualization"]);

export default function SemanticMaps() {
    const {
        viewMode,
        handleModeToggle
    } = useSemanticMap();

    return (
        <section className="flex items-center justify-center w-full bg-base-300 py-20 px-2">
            <div className="flex flex-col items-center justify-center w-full max-w-7xl">
                <div className="flex flex-col mb-10 lg:mb-16 items-center justify-center w-full">
                    <h2 className="ubuntu-bold text-3xl lg:text-5xl text-neutral-content/85">
                        Semantic Maps
                    </h2>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-md">
                        Market research toolkit
                    </p>

                    <a
                        href='https://github.com/rotisserie-christian/search-profiler'
                        target='_blank' rel='noreferrer'
                        className="btn w-26 rounded-xl mt-4"
                    >
                        GitHub<FaAngleDoubleRight />
                    </a>
                </div>

                <div className="flex flex-col items-center justify-center w-full max-w-4xl">
                    <p className="text-lg lg:text-xl ubuntu-semibold text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                        Search Interest Over Time
                    </p>

                    <LazyTrendChart
                        viewMode={viewMode}
                        onModeToggle={handleModeToggle}
                    />
                </div>

                <WhatItDoes colorMap={ROUTES_COLOR_MAP} />
            </div>
        </section>
    );
}
