import { Suspense, lazy, useState } from "react";
const Visualizer = lazy(() => import('./Visualizer'));
import { FaAngleDoubleRight, FaReact } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import cb from "@/assets/cb.png";
import DemoSequencer from "./DemoSequencer";
import { SequencerProvider } from "@/contexts/SequencerContext.jsx";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import HowItWorks from "./ui/HowItWorks.jsx";
import VisualizerGate from "./ui/VisualizerGate.jsx";

const LazyVisualizer = ({ isDemoLoaded, onLoadDemo }) => {
    const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: "0px" });

    return (
        <div ref={elementRef} className="w-full lg:w-1/2">
            {hasIntersected ? (
                <div className="w-full h-[500px] pt-4 bg-base-300 rounded-xl shadow-sm flex flex-col">
                    {!isDemoLoaded ? (
                        <VisualizerGate onLoadDemo={onLoadDemo} />
                    ) : (
                        <Suspense
                            fallback={
                                <div className="w-full h-full flex flex-col items-center justify-center skeleton opacity-50">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                </div>
                            }
                        >
                            <Visualizer
                                canvasId="demo-visualizer"
                                fillParent={true}
                            />
                        </Suspense>
                    )}
                </div>
            ) : (
                <div className="w-full h-[500px] p-4 flex flex-col bg-base-300 rounded-xl shadow-sm skeleton opacity-30" />
            )}
        </div>
    );
};


export default function Crayonbrain() {
    const [loadDemo, setLoadDemo] = useState(false);

    return (
        <section className="flex items-center justify-center w-full">
            <div className="flex flex-col mt-10 mb-10 lg:mb-16 items-center justify-center w-full">
                <img src={cb} alt="Crayonbrain" className="w-[120px] mt-10" />

                <h2 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                    Crayonbrain
                </h2>

                <div className="flex flex-row items-center justify-center w-full gap-2">
                    <div className="flex flex-row items-center justify-center w-24 h-8 bg-base-300 rounded-lg gap-2 mt-4">
                        <FaReact className="text-xl" />
                        <p className="text-xs">React</p>
                    </div>

                    <div className="flex flex-row items-center justify-center w-24 h-8 bg-base-300 rounded-lg gap-2 mt-4">
                        <RiTailwindCssFill className="text-xl" />
                        <p className="text-xs">Tailwind</p>
                    </div>
                </div>

                <p className="text-lg lg:text-xl mt-4 lg:mb-8 text-neutral-content/85 text-center max-w-xs lg:max-w-lg leading-relaxed">
                    Music composer with reactive visuals
                </p>

                <SequencerProvider>
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full max-w-6xl">
                        <div className="w-full lg:w-1/2">
                            <DemoSequencer isDemoLoaded={loadDemo} />
                        </div>

                        <LazyVisualizer
                            isDemoLoaded={loadDemo}
                            onLoadDemo={() => setLoadDemo(true)}
                        />
                    </div>
                </SequencerProvider>

                <HowItWorks />
            </div>
        </section>
    );
}
