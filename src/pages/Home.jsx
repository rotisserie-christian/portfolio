import { Suspense, lazy, useState, useRef, useEffect } from "react";
const SemanticGraph = lazy(() => import('../components/SemanticGraph'));
import { FaAngleDoubleRight, FaReact, FaSeedling, FaGithub } from "react-icons/fa";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { SiTypescript } from "react-icons/si";
import Funnel from "../components/Funnel";
import cb from "../assets/cb.png";
import GraphLegend from "../components/GraphLegend";
import { ShootingStars } from "../components/ShootingStars";
import { StarsBackground } from "../components/StarsBackground";
import DemoSequencer from "../components/crayonbrain/DemoSequencer";
import Visualizer from "../components/crayonbrain/Visualizer";
import GainsGraph from "../components/gainsgraph/GainsGraph";
import Earth from "../components/fakeairlines/Earth";

export default function Home() {
    const [shouldStartGraph, setShouldStartGraph] = useState(false);
    const [isSequencerPlaying, setIsSequencerPlaying] = useState(false);
    const graphSectionRef = useRef();
    const projectsSectionRef = useRef();
    
    // Funnel data
    const stages = [
        { label: 'Reach', count: 8270, color: 'rgb(50, 50, 50)' },
        { label: 'Visits', count: 413, color: 'rgb(75, 75, 75)' },
        { label: 'Signups', count: 7, color: 'rgb(50, 50, 50)' },
    ];
    
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

                    <div className="w-full max-w-6xl h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden">
                        <Earth />
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

                        <div className="w-full lg:w-1/2">
                            <Visualizer 
                                presetLabel="fractal" 
                                canvasId="demo-visualizer"
                                className="bg-base-300 rounded-xl"
                                isPlaying={isSequencerPlaying}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="flex items-center justify-center w-full">
                <div className="flex flex-col my-20 md:my-32 lg:my-40 items-center justify-center w-full">
                    <FaSeedling className="text-4xl md:text-5xl lg:text-6xl text-teal-400/90 mb-4" />

                    <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                        GainsGraph
                    </h1>

                    <div className="flex flex-row items-center justify-center w-full gap-2">
                        <div className="flex flex-row items-center justify-center w-24 h-8 bg-base-300 rounded-lg gap-2 mt-4">
                            <RiNextjsFill className="text-xl" />
                            <p className="text-xs">Next</p>
                        </div>

                        <div className="flex flex-row items-center justify-center w-24 h-8 bg-base-300 rounded-lg gap-2 mt-4">
                            <SiTypescript className="text-sm" />
                            <p className="text-xs">Typescript</p>
                        </div>

                        <div className="flex flex-row items-center justify-center w-24 h-8 bg-base-300 rounded-lg gap-2 mt-4">
                            <RiTailwindCssFill className="text-xl" />
                            <p className="text-xs">Tailwind</p>
                        </div>
                    </div>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-[300px] lg:max-w-lg">
                        Charting app for strength training
                    </p>

                    <a 
                    href='https://gainsgraph.com' 
                    target='_blank' rel='noreferrer'>
                        <button className="btn w-26 bg-neutral text-cyan-200 rounded-xl mt-4 mb-8">
                            Visit<FaAngleDoubleRight />
                        </button>
                    </a>

                    <GainsGraph />
                </div>
            </section>

            <section className="flex items-center justify-center w-full min-h-screen bg-base-300">
                <div className="flex flex-col my-20 md:my-32 lg:my-40 items-center justify-center w-full">
                    <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                        Visual Funnel
                    </h1>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                        A mirrored histogram where each bar represents the moving average 
                        of a marketing funnel 
                    </p>

                    <a 
                    href='https://github.com/rotisserie-christian/portfolio/blob/master/src/components/Funnel.jsx' 
                    target='_blank' rel='noreferrer'>
                        <button 
                        className="btn w-26 bg-neutral rounded-xl text-neutral-content/85 mt-4 lg:mb-8">
                            <FaGithub />GitHub
                        </button>
                    </a>
                    
                    <div className="w-full max-w-4xl">
                        <Funnel stages={stages} />
                    </div>
                </div>
            </section>

            <section ref={graphSectionRef} className="flex items-center justify-center w-full min-h-screen">
                <div className="flex flex-col my-20 md:my-32 lg:my-40 items-center justify-center w-full">                
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

                    <Suspense fallback={<div>Loading...</div>}>
                        <SemanticGraph shouldStart={shouldStartGraph} />
                    </Suspense>

                    <GraphLegend />
                </div>
            </section>
        </div>
        </>
    );
}