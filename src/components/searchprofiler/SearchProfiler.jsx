import { Suspense, lazy, useState, useEffect } from "react";
import { FaAngleDoubleRight, FaPython } from "react-icons/fa";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const Chart = lazy(() => import("./Chart"));

const LazyChart = () => {
    const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: "0px" });
    const [isButterchurnLoaded, setIsButterchurnLoaded] = useState(!!window.butterchurnLoaded);

    useEffect(() => {
        if (isButterchurnLoaded) return;

        const handleLoaded = () => setIsButterchurnLoaded(true);
        window.addEventListener('butterchurn-loaded', handleLoaded);
        return () => window.removeEventListener('butterchurn-loaded', handleLoaded);
    }, [isButterchurnLoaded]);

    const shouldLoad = hasIntersected && isButterchurnLoaded;

    return (
        <div ref={elementRef} className="w-full flex items-center justify-center min-h-[450px]">
            {shouldLoad ? (
                <Suspense
                    fallback={
                        <div className="flex flex-col items-center justify-center w-full h-[450px]">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    }
                >
                    <Chart />
                </Suspense>
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-[450px]">
                    {!isButterchurnLoaded && hasIntersected && (
                        <div className="flex flex-col items-center gap-2">
                            <span className="loading loading-spinner loading-md text-neutral-content/40"></span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function SearchProfiler() {
    return (
        <section className="flex items-center justify-center w-full bg-base-300">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-col mt-20 mb-10 lg:mb-16 items-center justify-center w-full">
                    <h1 className="ubuntu-bold text-3xl lg:text-5xl text-neutral-content/85">
                        Search Profiler
                    </h1>

                    <div className="flex flex-row items-center justify-center w-24 h-8 bg-base-100 rounded-lg gap-2 mt-4">
                        <FaPython className="text-xl text-neutral-content/85" />
                        <p className="text-xs text-neutral-content/85">Python</p>
                    </div>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                        Toolkit for researching search terms specific to the behaviour of a given user profile
                    </p>

                    <a
                        href='https://github.com/rotisserie-christian/search-profiler'
                        target='_blank' rel='noreferrer'>
                        <button className="btn w-26 bg-neutral rounded-xl mt-4 mb-8">
                            GitHub<FaAngleDoubleRight />
                        </button>
                    </a>
                </div>

                <LazyChart />
            </div>
        </section>
    );
}