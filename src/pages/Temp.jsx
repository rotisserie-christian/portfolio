import { Suspense, lazy } from "react";
import Table from "../components/searchprofiler/ui/Table";
import reviewData from "../components/searchprofiler/data/reviews1.json";

const Chart = lazy(() => import("../components/searchprofiler/ui/Chart"));

export default function Temp() {
    return (
        <section className="flex items-center justify-center w-full bg-base-300 py-20 px-2 min-h-screen">
            <div className="flex flex-col items-center justify-center w-full max-w-7xl">
                <div className="flex flex-col mb-10 lg:mb-16 items-center justify-center w-full text-center">
                    <h2 className="ubuntu-bold text-3xl lg:text-5xl text-neutral-content/85">
                        Reviews Analysis
                    </h2>
                    <p className="text-lg lg:text-xl mt-4 text-neutral-content/85 max-w-lg">
                        feedback impact vs prevalence
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 w-full items-start justify-center">
                    <div className="flex flex-col items-center justify-center w-full lg:w-[50%]">
                        <p className="text-xl lg:text-2xl mt-4 ubuntu-semibold text-neutral-content/85 text-center">
                            Impact vs. Prevalence
                        </p>
                        <div className="w-full mt-8">
                            <Suspense fallback={<div className="h-[450px] flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
                                <Chart
                                    dataOverride={reviewData}
                                    xKey="prevalence"
                                    yKey="impact_score"
                                    labelKey="feedback"
                                    clusterKey="type"
                                    xAxisLabel="Prevalence (Mentions)"
                                    yAxisLabel="Impact Score (1-5)"
                                    maxRangeX={40} // Based on data (max is 34)
                                    maxRangeY={5}
                                />
                            </Suspense>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-start w-full lg:w-[50%]">
                        <p className="text-xl lg:text-2xl mt-4 mb-8 ubuntu-semibold text-neutral-content/85 text-center">
                            Feedback Details
                        </p>
                        <Table
                            data={reviewData}
                            clusterKey="type"
                            labelKey="feedback"
                            columns={[
                                { key: 'feedback', label: 'Feedback', type: 'text' },
                                { key: 'impact_score', label: 'Impact', type: 'number', precision: 1 },
                                { key: 'prevalence', label: 'Mentions', type: 'number', precision: 0 }
                            ]}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}