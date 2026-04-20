import { Suspense, lazy } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const Chart = lazy(() => import("./Chart"));

export default function LazyChart({ filteredData, colorMap, mode }) {
    const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: "0px" });

    const config = mode === 'keywords' ? {
        xKey: "max_interest",
        yKey: "avg_interest",
        labelKey: "query",
        clusterKey: "cluster",
        xAxisLabel: "Max Interest",
        yAxisLabel: "Average Interest"
    } : {
        xKey: "prevalence",
        yKey: "impact_score",
        labelKey: "feedback",
        clusterKey: "type",
        xAxisLabel: "Prevalence (Mentions)",
        yAxisLabel: "Review Score (1-5)",
        maxRangeX: 40,
        maxRangeY: 5
    };

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
                        {...config}
                    />
                </Suspense>
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-[450px]" />
            )}
        </div>
    );
}
