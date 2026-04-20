import { useState, useMemo } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import Table from "./ui/Table";
import ScrollBar from "./ui/ScrollBar";
import searchData from "./data/searchterms.json";
import reviewData from "./data/reviews1.json";
import WhatItDoes from "./WhatItDoes";
import { getClusterColors } from './utils/colors';
import ToggleSwitch from "../ui/ToggleSwitch";
import LazyChart from "./ui/LazyChart";

export default function SemanticMaps() {
    const [viewMode, setViewMode] = useState('keywords'); // 'keywords' or 'reviews'
    const [activeCluster, setActiveCluster] = useState('all');

    const activeData = useMemo(() => {
        return viewMode === 'keywords' ? searchData : reviewData;
    }, [viewMode]);

    const clusterKey = viewMode === 'keywords' ? 'cluster' : 'type';

    const clusters = useMemo(() => {
        const unique = [...new Set(activeData.map(item => item[clusterKey]))].sort();
        return unique;
    }, [activeData, clusterKey]);

    const filteredData = useMemo(() => {
        if (activeCluster === 'all') return activeData;
        return activeData.filter(item => item[clusterKey] === activeCluster);
    }, [activeData, activeCluster, clusterKey]);

    const colorMap = useMemo(() => {
        if (viewMode === 'reviews') {
            return {
                Strength: {
                    bg: 'hsla(142, 70%, 45%, 0.7)',
                    border: 'hsla(142, 70%, 45%, 1)',
                    indicator: 'hsla(142, 70%, 45%, 1)'
                },
                Weakness: {
                    bg: 'hsla(0, 70%, 50%, 0.7)',
                    border: 'hsla(0, 70%, 50%, 1)',
                    indicator: 'hsla(0, 70%, 50%, 1)'
                }
            };
        }
        return getClusterColors(clusters);
    }, [clusters, viewMode]);

    const handleModeToggle = (checked) => {
        setViewMode(checked ? 'reviews' : 'keywords');
        setActiveCluster('all');
    };

    return (
        <section className="flex items-center justify-center w-full bg-base-300 py-20 px-2">
            <div className="flex flex-col items-center justify-center w-full max-w-7xl">
                <div className="flex flex-col mb-10 lg:mb-16 items-center justify-center w-full">
                    <h2 className="ubuntu-bold text-3xl lg:text-5xl text-neutral-content/85">
                        Semantic Maps
                    </h2>

                    <p className="text-lg lg:text-xl mt-4 lg:mb-4 text-neutral-content/85 text-center max-w-xs lg:max-w-md">
                        Market research toolkit
                    </p>

                    <a
                        href='https://github.com/rotisserie-christian/search-profiler'
                        target='_blank' rel='noreferrer'
                        className="btn w-26 rounded-xl mt-4 mb-8"
                    >
                        GitHub<FaAngleDoubleRight />
                    </a>

                    <ToggleSwitch
                        leftLabel="Keywords"
                        rightLabel="Reviews"
                        isChecked={viewMode === 'reviews'}
                        onChange={handleModeToggle}
                    />
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
                            {viewMode === 'keywords' ? 'Search Interest Levels (3-month)' : 'Review Score vs. Prevalence'}
                        </p>

                        <p className="text-sm mt-5 mb-4 ubuntu-medium text-neutral-content/75 text-center max-w-xs lg:max-w-lg">
                            {viewMode === 'keywords' ? "Anchored to 'Free Music Maker'" : "Topic = DJ Services in Saskatoon"}
                        </p>

                        <LazyChart filteredData={filteredData} colorMap={colorMap} mode={viewMode} />
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
                            clusterKey={clusterKey}
                            labelKey={viewMode === 'keywords' ? 'query' : 'feedback'}
                            columns={viewMode === 'keywords' ? [
                                { key: 'query', label: 'Query', type: 'text' },
                                { key: 'avg_interest', label: 'Avg', type: 'number', precision: 2 },
                                { key: 'max_interest', label: 'Max', type: 'number', precision: 0 }
                            ] : [
                                { key: 'feedback', label: 'Feedback', type: 'text' },
                                { key: 'impact_score', label: 'Review Score', type: 'number', precision: 1 },
                                { key: 'prevalence', label: 'Mentions', type: 'number', precision: 0 }
                            ]}
                        />
                    </div>
                </div>

                {viewMode === 'keywords' && <WhatItDoes colorMap={colorMap} />}
            </div>
        </section>
    );
}