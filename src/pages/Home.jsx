import { Suspense, lazy, useState, useRef, useEffect } from "react";
const SemanticGraph = lazy(() => import('../components/SemanticGraph'));
import { FaAngleDoubleRight } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import Funnel from "../components/Funnel";
import cb from "../assets/cb.png";
import GraphLegend from "../components/GraphLegend";

export default function Home() {
    const [shouldStartGraph, setShouldStartGraph] = useState(false);
    const graphSectionRef = useRef();
    
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

    return (
        <>
        <div className="flex flex-col items-center justify-center w-full">
            <section className="flex items-center justify-center w-full">
                <div className="flex flex-col mt-20 md:mt-32 lg:mt-40 items-center justify-center w-full">
                    <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                        Christian Waters
                    </h1>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                        <span className="text-xl mr-2">{'\u{1F1E8}\u{1F1E6}'}</span>Web Developer 
                    </p>

                    <h3 className="text-xl lg:text-2xl font-semibold mt-20 md:mt-32 lg:mt-40 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                        Check out my work
                    </h3>

                    <div className="flex justify-center w-full mt-5">
                        <div className="border-l-[8px] border-dotted border-gray-600 h-[175px]"></div>
                    </div>
                </div>
            </section>

            <section className="flex items-center justify-center w-full">
                <div className="flex flex-col mt-10 mb-20 md:mb-32 lg:mb-40 items-center justify-center w-full">
                    <img src={cb} alt="Crayonbrain" className="w-[120px]" />

                    <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                        Crayonbrain
                    </h1>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                        A web-based music creation tool with reactive visuals
                    </p>

                    <a 
                    href='https://crayonbrain.com' 
                    target='_blank' rel='noreferrer'>
                        <button className="btn w-26 bg-neutral text-cyan-200 rounded-xl mt-4">
                            Visit<FaAngleDoubleRight />
                        </button>
                    </a>
                </div>
            </section>

            <section className="flex items-center justify-center w-full bg-base-300">
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

            <section ref={graphSectionRef} className="flex items-center justify-center w-full">
                <div className="flex flex-col my-20 md:my-32 lg:my-40 items-center justify-center w-full">                
                    <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                        Semantic Graph
                    </h1>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/80 text-center max-w-xs lg:max-w-lg">
                        A 3D force graphs that visualizes semantic similarity
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