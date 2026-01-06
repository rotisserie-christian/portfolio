import { lazy, Suspense } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { ShootingStars } from "../components/ShootingStars";
import { StarsBackground } from "../components/StarsBackground";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const Crayonbrain = lazy(() => import("../components/crayonbrain/Crayonbrain"));
const Flowchart = lazy(() => import("../components/flowchart/Flowchart"));

// Wrapper for lazy-loaded Crayonbrain
const LazyCrayonbrain = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: '200px' });

  return (
    <div ref={elementRef} data-section="crayonbrain">
      {hasIntersected ? (
        <Suspense fallback={
          <div className="flex items-center justify-center w-full h-96">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        }>
          <Crayonbrain />
        </Suspense>
      ) : (
        <div className="h-96" /> // Placeholder to maintain layout
      )}
    </div>
  );
};

// Wrapper for lazy-loaded Flowchart
const LazyFlowchart = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: '200px' });

  return (
    <div ref={elementRef} className="w-full">
      {hasIntersected ? (
        <Suspense fallback={
          <div className="mx-auto w-[350px] lg:w-[421px] h-[750px] flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        }>
          <Flowchart />
        </Suspense>
      ) : (
        <div className="mx-auto w-[350px] lg:w-[421px] h-[750px]" /> // Placeholder
      )}
    </div>
  );
};

export default function Home() {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

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

                <div className="flex flex-col items-center justify-center bg-opacity-90 backdrop-blur-sm px-4">
                    <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                        Christian Waters
                    </h1>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                        {!isChrome && <span className="text-xl mr-2">🇨🇦</span>}Web Developer 
                    </p>

                    <button 
                        onClick={scrollToProjects}
                        className="btn w-28 lg:w-32 lg:btn-lg bg-neutral text-cyan-200 rounded-xl lg:rounded-2xl mt-10"
                    >
                        Projects<FaAngleDoubleRight />
                    </button>
                </div>
            </section>

            <LazyCrayonbrain />

            <div className="flex flex-col lg:flex-row mt-10 mb-20 gap-10 lg:gap-20 items-center justify-center max-w-5xl mx-auto w-full">
                <div className="flex flex-col items-center lg:items-end justify-center w-full px-2">
                    <h1 className="text-3xl lg:text-5xl lg:text-right text-neutral-content/85 ubuntu-bold mb-6 lg:mb-8">
                        How it works
                    </h1>

                    <p className="lg:text-lg lg:text-right text-neutral-content/85 text-left w-full max-w-sm lg:max-w-xl lg:text-left">
                        The main feature is converting music clips into abstract visuals that can be downloaded as a video file.<br /><br />
                        Audio can be uploaded or piped in from a microphone.<br /><br />
                        The visuals are made with Butterchurn, a web port of the famous MilkDrop visualizer featured in Winamp.<br /><br />
                        Crayonbrain is an attempt to extend this project by building audio systems around it, and making it easier to share the results.<br /><br />
                    </p>
                </div>

                <LazyFlowchart />
            </div>
        </div>
        </>
    );
}