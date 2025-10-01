import { Suspense, lazy, useState, useRef, useEffect } from "react";
const SemanticGraph = lazy(() => import('./SemanticGraph'));
import { FaAngleDoubleRight, FaGithub } from "react-icons/fa";
import GraphLegend from "./GraphLegend";

export default function SemanticGraphSection() {
    const [shouldStartGraph, setShouldStartGraph] = useState(false);
    const graphSectionRef = useRef();

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
    );
}
