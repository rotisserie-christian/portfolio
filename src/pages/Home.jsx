import { useState } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { ShootingStars } from "../components/ShootingStars";
import { StarsBackground } from "../components/StarsBackground";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import Crayonbrain from "../components/crayonbrain/Crayonbrain";

export default function Home() {
    const [SemanticGraphComponent, setSemanticGraphComponent] = useState(null);
    const [shouldStartSemanticGraph, setShouldStartSemanticGraph] = useState(false);
    const [loadingStates, setLoadingStates] = useState({
        semanticgraph: false
    });

    // Dynamic import
    const loadSemanticGraph = () => import('../components/semanticgraph/SemanticGraphSection');

    // Start semantic graph animation when section is in view
    const semanticGraphObserver = useIntersectionObserver({
        onIntersect: () => {
            if (!SemanticGraphComponent && !loadingStates.semanticgraph) {
                setLoadingStates(prev => ({ ...prev, semanticgraph: true }));
                loadSemanticGraph().then(module => {
                    setSemanticGraphComponent(() => module.default);
                    setLoadingStates(prev => ({ ...prev, semanticgraph: false }));
                });
            }

            setShouldStartSemanticGraph(true);
        }
    });

    const scrollToProjects = () => {
        document.querySelector('[data-section="crayonbrain"]')?.scrollIntoView({ 
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

            <div data-section="crayonbrain">
                <Crayonbrain />
            </div>

            <div ref={semanticGraphObserver.ref} data-section="semanticgraph">
                {loadingStates.semanticgraph ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : SemanticGraphComponent ? (
                    <SemanticGraphComponent shouldStart={shouldStartSemanticGraph} />
                ) : (
                    <div className="flex items-center justify-center min-h-screen bg-base-300">
                        <div className="flex flex-col items-center gap-4">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}