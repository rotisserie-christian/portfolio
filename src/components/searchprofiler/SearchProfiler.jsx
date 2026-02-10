import { Suspense, lazy, useState, useEffect, useMemo } from "react";
import { FaAngleDoubleRight, FaPython } from "react-icons/fa";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import Table from "./Table";
import ScrollBar from "./ScrollBar";
import searchData from "./data/searchterms.json";

const Chart = lazy(() => import("./Chart"));

const LazyChart = ({ filteredData }) => {
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
        <div ref={elementRef} className="w-full lg:w-1/2 flex items-center justify-center min-h-[450px]">
            {shouldLoad ? (
                <Suspense
                    fallback={
                        <div className="flex flex-col items-center justify-center w-full h-[450px]">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    }
                >
                    <Chart dataOverride={filteredData} />
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
    const [activeCluster, setActiveCluster] = useState('all');

    const clusters = useMemo(() => {
        const unique = [...new Set(searchData.map(item => item.cluster))].sort();
        return unique;
    }, []);

    const filteredData = useMemo(() => {
        if (activeCluster === 'all') return searchData;
        return searchData.filter(item => item.cluster === activeCluster);
    }, [activeCluster]);

    return (
        <section className="flex items-center justify-center w-full bg-base-300 py-20 px-4">
            <div className="flex flex-col items-center justify-center w-full max-w-7xl">
                <div className="flex flex-col mb-10 lg:mb-16 items-center justify-center w-full">
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

                <div className="w-full mb-8">
                    <ScrollBar
                        clusters={clusters}
                        activeCluster={activeCluster}
                        onClusterSelect={setActiveCluster}
                        className="rounded-xl shadow-inner bg-base-200/50"
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 w-full items-start">
                    <LazyChart filteredData={filteredData} />
                    <div className="w-full lg:w-1/2">
                        <Table data={filteredData} />
                    </div>
                </div>
            </div>
        </section>
    );
}