import { Suspense, lazy, useRef } from "react";
const SemanticGraphSection = lazy(() => import('../components/semanticgraph/SemanticGraphSection'));
const Fakeairlines = lazy(() => import('../components/fakeairlines/Fakeairlines'));
const Crayonbrain = lazy(() => import('../components/crayonbrain/Crayonbrain'));
import { FaAngleDoubleRight } from "react-icons/fa";
import { ShootingStars } from "../components/ShootingStars";
import { StarsBackground } from "../components/StarsBackground";

export default function Home() {
    const projectsSectionRef = useRef();

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

            <div className='w-full' ref={projectsSectionRef}>
                <Suspense fallback={<div className="flex items-center justify-center w-full min-h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
                    <Fakeairlines />
                </Suspense>
            </div>

            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
                <Crayonbrain />
            </Suspense>

            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
                <SemanticGraphSection />
            </Suspense>
        </div>
        </>
    );
}