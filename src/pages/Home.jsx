import { useState, useRef, useEffect } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { ShootingStars } from "../components/ShootingStars";
import { StarsBackground } from "../components/StarsBackground";

export default function Home() {
    const projectsSectionRef = useRef();
    const [FakeairlinesComponent, setFakeairlinesComponent] = useState(null);
    const [CrayonbrainComponent, setCrayonbrainComponent] = useState(null);
    const [SemanticGraphComponent, setSemanticGraphComponent] = useState(null);
    const [loadingStates, setLoadingStates] = useState({
        fakeairlines: false,
        crayonbrain: false,
        semanticgraph: false
    });

    // Dynamic import 
    const loadFakeairlines = () => import('../components/fakeairlines/Fakeairlines');
    const loadCrayonbrain = () => import('../components/crayonbrain/Crayonbrain');
    const loadSemanticGraph = () => import('../components/semanticgraph/SemanticGraphSection');

    // Intersection observers for progressive loading
    useEffect(() => {
        const observers = [];

        // Fake Airlines observer
        const fakeairlinesObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !FakeairlinesComponent && !loadingStates.fakeairlines) {
                    setLoadingStates(prev => ({ ...prev, fakeairlines: true }));
                    loadFakeairlines().then(module => {
                        setFakeairlinesComponent(() => module.default);
                        setLoadingStates(prev => ({ ...prev, fakeairlines: false }));
                    });
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );

        // Crayonbrain observer
        const crayonbrainObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !CrayonbrainComponent && !loadingStates.crayonbrain) {
                    setLoadingStates(prev => ({ ...prev, crayonbrain: true }));
                    loadCrayonbrain().then(module => {
                        setCrayonbrainComponent(() => module.default);
                        setLoadingStates(prev => ({ ...prev, crayonbrain: false }));
                    });
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );

        // Semantic Graph observer
        const semanticGraphObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !SemanticGraphComponent && !loadingStates.semanticgraph) {
                    setLoadingStates(prev => ({ ...prev, semanticgraph: true }));
                    loadSemanticGraph().then(module => {
                        setSemanticGraphComponent(() => module.default);
                        setLoadingStates(prev => ({ ...prev, semanticgraph: false }));
                    });
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );

        observers.push(fakeairlinesObserver, crayonbrainObserver, semanticGraphObserver);

        // Observe sections
        const fakeairlinesSection = document.querySelector('[data-section="fakeairlines"]');
        const crayonbrainSection = document.querySelector('[data-section="crayonbrain"]');
        const semanticgraphSection = document.querySelector('[data-section="semanticgraph"]');

        if (fakeairlinesSection) fakeairlinesObserver.observe(fakeairlinesSection);
        if (crayonbrainSection) crayonbrainObserver.observe(crayonbrainSection);
        if (semanticgraphSection) semanticGraphObserver.observe(semanticgraphSection);

        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, [FakeairlinesComponent, CrayonbrainComponent, SemanticGraphComponent, loadingStates]);

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

            <div className='w-full' ref={projectsSectionRef} data-section="fakeairlines">
                {loadingStates.fakeairlines ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : FakeairlinesComponent ? (
                    <FakeairlinesComponent />
                ) : (
                    <div className="flex items-center justify-center min-h-screen bg-base-300">
                        <div className="flex flex-col items-center gap-4">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    </div>
                )}
            </div>

            <div data-section="crayonbrain">
                {loadingStates.crayonbrain ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : CrayonbrainComponent ? (
                    <CrayonbrainComponent />
                ) : (
                    <div className="flex items-center justify-center min-h-screen bg-base-300">
                        <div className="flex flex-col items-center gap-4">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    </div>
                )}
            </div>

            <div data-section="semanticgraph">
                {loadingStates.semanticgraph ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : SemanticGraphComponent ? (
                    <SemanticGraphComponent />
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