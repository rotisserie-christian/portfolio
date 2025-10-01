import { Suspense, lazy, useState, useRef, useEffect } from "react";
const SemanticGraph = lazy(() => import('../components/SemanticGraph'));
const Earth = lazy(() => import('../components/fakeairlines/Earth'));
const Visualizer = lazy(() => import('../components/crayonbrain/Visualizer'));
import { FaAngleDoubleRight, FaReact, FaSeedling, FaGithub } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import cb from "../assets/cb.png";
import GraphLegend from "../components/GraphLegend";
import { ShootingStars } from "../components/ShootingStars";
import { StarsBackground } from "../components/StarsBackground";
import DemoSequencer from "../components/crayonbrain/DemoSequencer";

export default function Home() {
    const [shouldStartGraph, setShouldStartGraph] = useState(false);
    const [shouldLoadEarth, setShouldLoadEarth] = useState(false);
    const [shouldLoadVisualizer, setShouldLoadVisualizer] = useState(false);
    const [isSequencerPlaying, setIsSequencerPlaying] = useState(false);
    const graphSectionRef = useRef();
    const projectsSectionRef = useRef();
    const earthSectionRef = useRef();
    const visualizerSectionRef = useRef();
    
    // Intersection Observer for SemanticGraph
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !shouldStartGraph) {
                    setShouldStartGraph(true);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        const currentRef = graphSectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [shouldStartGraph]);

    // Intersection Observer for Earth
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !shouldLoadEarth) {
                    setShouldLoadEarth(true);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        const currentRef = earthSectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [shouldLoadEarth]);

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

    const scrollToProjects = () => {
        projectsSectionRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <>
        <div className="flex flex-col items-center justify-center w-full">
            <section className="flex items-center justify-center w-full min-h-screen bg-base-300 min-h-screen">
                <StarsBackground />
                <ShootingStars />

                <div className="flex flex-col items-center justify-center bg-opacity-90 backdrop-blur-sm px-4">
                    <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                        Christian Waters
                    </h1>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                        <span className="text-xl mr-2">{'\u{1F1E8}\u{1F1E6}'}</span>Web Developer 
                    </p>

                    <button 
                        onClick={scrollToProjects}
                        className="btn w-28 lg:w-32 lg:btn-lg bg-neutral text-cyan-200 rounded-xl lg:rounded-2xl mt-10"
                    >
                        Projects<FaAngleDoubleRight />
                    </button>
                </div>
            </section>

            <section ref={projectsSectionRef} className="flex items-center justify-center w-full bg-base-300 min-h-screen relative">
                <StarsBackground />
                
                <div className="flex flex-col my-8 md:my-20 lg:my-32 items-center justify-center w-full relative z-10">
                    <div className="flex flex-col items-center justify-center bg-opacity-90 backdrop-blur-sm px-4">
                        <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                            Fake Airlines
                        </h1>

                        <div className="flex flex-row items-center justify-center w-full gap-2">
                            <div className="flex flex-row items-center justify-center w-24 h-8 bg-base-100 rounded-lg gap-2 mt-4">
                                <FaReact className="text-xl" />
                                <p className="text-xs">React</p>
                            </div>

                            <div className="flex flex-row items-center justify-center w-24 h-8 bg-base-100 rounded-lg gap-2 mt-4">
                                <RiTailwindCssFill className="text-xl" />
                                <p className="text-xs">Tailwind</p>
                            </div>
                        </div>

                        <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                            Business simulation game
                        </p>

                        <a 
                        href='https://fakeairlines.com' 
                        target='_blank' rel='noreferrer'>
                            <button className="btn w-26 bg-neutral text-cyan-200 rounded-xl mt-4 mb-8">
                                Visit<FaAngleDoubleRight />
                            </button>
                        </a>
                    </div>

                    <div ref={earthSectionRef} className="w-full max-w-6xl h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden pointer-events-none">
                        {shouldLoadEarth ? (
                            <Suspense fallback={<div className="flex items-center justify-center h-full"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
                                <Earth />
                            </Suspense>
                        ) : (
                            <div className="flex items-center justify-center h-full bg-base-200 rounded-xl">
                                <div className="flex flex-col items-center gap-4">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

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

            <section ref={graphSectionRef} className="flex items-center justify-center w-full min-h-screen">
                <div className="flex flex-col mb-20 md:mb-32 lg:mb-40 items-center justify-center w-full">                
                    <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                        Semantic Graph
                    </h1>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/80 text-center max-w-xs lg:max-w-lg">
                        A 3D force graph that visualizes semantic similarity
                    </p>

                    <a 
                    href='https://github.com/rotisserie-christian/portfolio/blob/master/src/components/SemanticGraph.jsx' 
                    target='_blank' rel='noreferrer'>
                        <button className="btn w-26 bg-neutral text-neutral-content/85 rounded-xl mt-4">
                            <FaGithub />GitHub
                        </button>
                    </a>

                    <Suspense 
                        fallback={
                            <div className="flex items-center justify-center h-[330px]">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        }>
                            
                        <SemanticGraph shouldStart={shouldStartGraph} />
                    </Suspense>

                    <GraphLegend />
                </div>
            </section>
        </div>
        </>
    );
}