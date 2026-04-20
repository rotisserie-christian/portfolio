import { Suspense, lazy, useState, useMemo } from "react";
import Table from "../components/searchprofiler/ui/Table";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import reviewData from "../components/searchprofiler/data/reviews1.json";

const Chart = lazy(() => import("../components/searchprofiler/ui/Chart"));

const COLOR_MAP = {
    Strength: {
        bg: 'hsla(142, 70%, 45%, 0.7)', // Green
        border: 'hsla(142, 70%, 45%, 1)',
        indicator: 'hsla(142, 70%, 45%, 1)'
    },
    Weakness: {
        bg: 'hsla(0, 70%, 50%, 0.7)', // Red
        border: 'hsla(0, 70%, 50%, 1)',
        indicator: 'hsla(0, 70%, 50%, 1)'
    }
};

export default function Temp() {
    const [viewType, setViewType] = useState('Strength'); // 'Strength' or 'Weakness'

    const sortedData = useMemo(() => {
        return [...reviewData].sort((a, b) => b.prevalence - a.prevalence);
    }, []);

    const filteredDataSnapshot = useMemo(() => {
        return sortedData.filter(item => item.type === viewType);
    }, [sortedData, viewType]);

    return (
        <section className="flex items-center justify-center w-full bg-base-300 py-20 px-2 min-h-screen font-ubuntu">
            <div className="flex flex-col items-center justify-center w-full max-w-7xl">
                <div className="flex flex-col mb-10 lg:mb-16 items-center justify-center w-full text-center">
                    <h2 className="ubuntu-bold text-3xl lg:text-5xl text-neutral-content/85">
                        Reviews Profiler
                    </h2>
                    <p className="text-lg lg:text-xl mt-4 text-neutral-content/85 max-w-lg">
                        Toolkit for analyzing customer feedback
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 w-full items-start justify-center">
                    <div className="flex flex-col items-center justify-center w-full lg:w-[50%]">
                        <p className="text-xl lg:text-2xl mt-4 ubuntu-semibold text-neutral-content/85 text-center">
                            Review Score vs. Prevalence
                        </p>

                        <p className="text-sm mt-5 ubuntu-medium text-neutral-content/75 text-center max-w-xs lg:max-w-lg">
                            Topic = DJ Services in Saskatoon
                        </p>
                        <div className="w-full mt-4">
                            <Suspense fallback={<div className="h-[450px] flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
                                <Chart
                                    dataOverride={sortedData}
                                    xKey="prevalence"
                                    yKey="impact_score"
                                    labelKey="feedback"
                                    clusterKey="type"
                                    xAxisLabel="Prevalence (Mentions)"
                                    yAxisLabel="Review Score (1-5)"
                                    maxRangeX={40} // hardcoded :( based on data (max is 34)
                                    maxRangeY={5}
                                    colorMap={COLOR_MAP}
                                />
                            </Suspense>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-start w-full lg:w-[50%]">
                        <p className="text-xl lg:text-2xl mt-4 mb-4 ubuntu-semibold text-neutral-content/85 text-center">
                            Feedback Details
                        </p>

                        <ToggleSwitch
                            leftLabel="Strength"
                            rightLabel="Weakness"
                            isChecked={viewType === 'Weakness'}
                            onChange={(checked) => setViewType(checked ? 'Weakness' : 'Strength')}
                            className="mb-8"
                        />

                        <Table
                            data={filteredDataSnapshot}
                            clusterKey="type"
                            labelKey="feedback"
                            columns={[
                                { key: 'feedback', label: 'Feedback', type: 'text' },
                                { key: 'impact_score', label: 'Review Score', type: 'number', precision: 1 },
                                { key: 'prevalence', label: 'Mentions', type: 'number', precision: 0 }
                            ]}
                            colorMap={COLOR_MAP}
                            itemsPerPage={7}
                            heightClass="h-[320px] lg:h-[400px]"
                            shouldTruncate={false}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}