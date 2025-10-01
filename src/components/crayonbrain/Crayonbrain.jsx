import { Suspense, lazy, useState, useRef, useEffect } from "react";
const Visualizer = lazy(() => import('./Visualizer'));
import { FaAngleDoubleRight, FaReact } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import cb from "../../assets/cb.png";
import DemoSequencer from "./DemoSequencer";

export default function Crayonbrain() {
    const [shouldLoadVisualizer, setShouldLoadVisualizer] = useState(false);
    const [isSequencerPlaying, setIsSequencerPlaying] = useState(false);
    const visualizerSectionRef = useRef();

    // Intersection Observer for Visualizer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !shouldLoadVisualizer) {
                    setShouldLoadVisualizer(true);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        const currentRef = visualizerSectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [shouldLoadVisualizer]);

    return (
        <section className="flex items-center justify-center w-full">
            <div className="flex flex-col mt-10 mb-20 md:mb-32 lg:mb-40 items-center justify-center w-full">
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
                href='https://crayonbrain.com' 
                target='_blank' rel='noreferrer'>
                    <button className="btn w-26 bg-neutral text-cyan-200 rounded-xl mt-4 mb-8">
                        Visit<FaAngleDoubleRight />
                    </button>
                </a>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full max-w-6xl px-4">
                    <div className="w-full lg:w-1/2">
                        <DemoSequencer onPlayStateChange={setIsSequencerPlaying} />
                    </div>

                    <div ref={visualizerSectionRef} className="w-full lg:w-1/2">
                        {shouldLoadVisualizer ? (
                            <Suspense fallback={<div className="flex items-center justify-center h-[220px] md:h-[280px] lg:h-[360px]"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
                                <Visualizer 
                                    presetLabel="fractal" 
                                    canvasId="demo-visualizer"
                                    className="bg-base-300 rounded-xl"
                                    isPlaying={isSequencerPlaying}
                                />
                            </Suspense>
                        ) : (
                            <div className="flex items-center justify-center h-[220px] md:h-[280px] lg:h-[360px] bg-base-300 rounded-xl">
                                <div className="flex flex-col items-center gap-4">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
