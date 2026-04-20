import { Suspense, lazy, useState, useMemo } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Table from "./ui/Table";
import ScrollBar from "./ui/ScrollBar";
import searchData from "./data/searchterms.json";
import WhatItDoes from "./WhatItDoes";
import { getClusterColors } from './utils/colors';

const Chart = lazy(() => import("./ui/Chart"));

const LazyChart = ({ filteredData, colorMap }) => {
    const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: "0px" });

    return (
        <div ref={elementRef} className="w-full flex items-center justify-center min-h-[450px]">
            {hasIntersected ? (
                <Suspense
                    fallback={
                        <div className="flex flex-col items-center justify-center w-full h-[450px]">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    }
                >
                    <Chart
                        dataOverride={filteredData}
                        colorMap={colorMap}
                        xKey="max_interest"
                        yKey="avg_interest"
                        labelKey="query"
                        clusterKey="cluster"
                        xAxisLabel="Max Interest"
                        yAxisLabel="Average Interest"
                    />
                </Suspense>
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-[450px]" />
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

    const colorMap = useMemo(() => getClusterColors(clusters), [clusters]);

    return (
        <section className="flex items-center justify-center w-full bg-base-300 py-20 px-2">
            <div className="flex flex-col items-center justify-center w-full max-w-7xl">
                <div className="flex flex-col mb-10 lg:mb-16 items-center justify-center w-full">
                    <h2 className="ubuntu-bold text-3xl lg:text-5xl text-neutral-content/85">
                        Semantic Maps
                    </h2>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-md">
                        Toolkit for transforming qualitative data into actionable insights
                    </p>

                    <a
                        href='https://github.com/rotisserie-christian/search-profiler'
                        target='_blank' rel='noreferrer'
                        className="btn w-26 bg-neutral rounded-xl mt-4 mb-8"
                    >
                        GitHub<FaAngleDoubleRight />
                    </a>
                </div>

                <div className="w-full mb-8 hidden lg:block">
                    <ScrollBar
                        clusters={clusters}
                        activeCluster={activeCluster}
                        onClusterSelect={setActiveCluster}
                        className="rounded-xl shadow-inner bg-base-200/50"
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 w-full items-start justify-center">
                    <div className="flex flex-col items-center justify-center w-full lg:w-[50%]">
                        <p className="text-xl lg:text-2xl mt-4 ubuntu-semibold text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                            Search Interest Levels (3-month)
                        </p>

                        <p className="text-sm mt-5 mb-4 ubuntu-medium text-neutral-content/75 text-center max-w-xs lg:max-w-lg">
                            Anchored to 'Free Music Maker'
                        </p>

                        <LazyChart filteredData={filteredData} colorMap={colorMap} />
                    </div>

                    <div className="flex flex-col items-center justify-start w-full lg:w-[50%]">
                        <div className="w-full mb-6 lg:hidden">
                            <ScrollBar
                                clusters={clusters}
                                activeCluster={activeCluster}
                                onClusterSelect={setActiveCluster}
                                className="rounded-xl shadow-inner bg-base-200/50"
                            />
                        </div>
                        <Table
                            data={filteredData}
                            colorMap={colorMap}
                            clusterKey="cluster"
                            labelKey="query"
                            columns={[
                                { key: 'query', label: 'Query', type: 'text' },
                                { key: 'avg_interest', label: 'Avg', type: 'number', precision: 2 },
                                { key: 'max_interest', label: 'Max', type: 'number', precision: 0 }
                            ]}
                        />
                    </div>
                </div>

                <WhatItDoes colorMap={colorMap} />
            </div>
        </section>
    );
}