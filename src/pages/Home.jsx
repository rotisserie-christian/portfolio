import { lazy, Suspense } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { ShootingStars } from "../components/ShootingStars";
import { StarsBackground } from "../components/StarsBackground";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const Crayonbrain = lazy(() => import("../components/crayonbrain/Crayonbrain"));
const Flowchart = lazy(() => import("../components/flowchart/Flowchart"));

const LazyCrayonbrain = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: '0px' });

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
              <StarsBackground />
              <ShootingStars />

                <div className="flex flex-col items-center justify-center bg-base-300/60 mb-20 lg:mb-0 z-40 lg:px-16 rounded-3xl">
                    <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                        Christian Waters
                    </h1>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                        {!isChrome && <span className="text-xl mr-2">🇨🇦</span>}Web Developer 
                    </p>

                    <button 
                        onClick={scrollToProjects}
                        className="btn w-28 lg:w-32 lg:btn-lg btn-neutral text-cyan-200 rounded-xl lg:rounded-2xl mt-10"
                    >
                        Projects<FaAngleDoubleRight />
                    </button>
                </div>
            </section>

            <LazyCrayonbrain />

            <div className="flex justify-center w-full mt-2">
              <div className="border-l-[10px] border-dotted border-white/20 h-[120px]"></div>
            </div>

            <h1 className="text-3xl lg:text-5xl lg:text-right text-neutral-content/85 ubuntu-bold mt-8 lg:mt-10">
              How it works
            </h1>

            <div className="flex flex-col lg:flex-row mt-5 mb-10 gap-10 items-center justify-center max-w-5xl mx-auto w-full">
              <LazyFlowchart />
              
              <div className="flex flex-col items-center lg:items-start justify-center w-full px-4">
                <p className="lg:text-lg lg:text-left text-neutral-content/85 text-left w-full max-w-sm lg:max-w-xl lg:text-left">
                  The main feature is converting audio into abstract visuals that can be downloaded as a video file.<br /><br />
                  
                  It&apos;s modular, allowing for audio to be uploaded, composed on the site, or piped in from a microphone.<br /><br />

                  The composer includes an optional sharing feature, and both microphone input and file uploads are sandboxed in the browser.
                  It runs with very few backend services and collects minimal user data.<br /><br />

                  The visuals are made with 
                  <a href="https://github.com/jberg/butterchurn" target="_blank" rel="noreferrer" className="underline ml-1">Butterchurn</a>,
                  a web port of the famous 
                  <a href="https://www.geisswerks.com/milkdrop/" target="_blank" rel="noreferrer" className="underline mx-1">MilkDrop</a>
                  visualizer featured in Winamp.<br /><br />

                  Crayonbrain is an attempt to build new audio systems around it, and make it easier to share the results.
                </p>
              </div>
          </div>
        </div>
        </>
    );
}