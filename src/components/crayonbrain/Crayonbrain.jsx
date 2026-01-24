import { Suspense, lazy } from "react";
const Visualizer = lazy(() => import('./Visualizer'));
import { FaAngleDoubleRight, FaReact } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import cb from "../../assets/cb.png";
import DemoSequencer from "./DemoSequencer";
import { SequencerProvider } from "../../contexts/SequencerContext.jsx";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import HowItWorks from "./ui/HowItWorks.jsx";

const LazyVisualizer = () => {
    const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: "0px" });

    return (
        <div ref={elementRef} className="w-full lg:w-1/2">
            {hasIntersected ? (
                <Suspense
                    fallback={
                        <div className="w-full h-[500px] p-4 bg-base-300 rounded-xl shadow-sm flex flex-col items-center justify-center">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    }
                >
                    <Visualizer
                        canvasId="demo-visualizer"
                    />
                </Suspense>
            ) : (
                <div className="w-full h-[420px] p-4 flex flex-col" />
            )}
        </div>
    );
};


export default function Crayonbrain() {
    return (
        <section className="flex items-center justify-center w-full">
            <div className="flex flex-col mt-10 mb-10 lg:mb-16 items-center justify-center w-full">
                <img src={cb} alt="Crayonbrain" className="w-[120px] mt-10" />

                <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                    Crayonbrain
                </h1>

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

                <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                    Music composer with reactive visuals
                </p>

                <a 
                href='https://crayonbrain.com/create' 
                target='_blank' rel='noreferrer'>
                    <button className="btn w-26 bg-neutral rounded-xl mt-4 mb-8">
                        Visit<FaAngleDoubleRight />
                    </button>
                </a>

                <SequencerProvider>
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full max-w-6xl px-4">
                        <div className="w-full lg:w-1/2">
                            <DemoSequencer />
                        </div>

                        <LazyVisualizer />
                    </div>
                </SequencerProvider>

                <HowItWorks />
            </div>
        </section>
    );
}
