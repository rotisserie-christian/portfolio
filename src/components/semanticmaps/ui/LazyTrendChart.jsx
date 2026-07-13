import { Suspense, lazy } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const TrendChart = lazy(() => import("./TrendChart"));

const CHART_OBSERVER_OPTIONS = { rootMargin: "0px" };

export default function LazyTrendChart({
    viewMode,
    onModeToggle,
    showModeToggle = true,
    queries,
}) {
    const { elementRef, hasIntersected } = useIntersectionObserver(CHART_OBSERVER_OPTIONS);

    return (
        <div ref={elementRef} className="w-full flex items-center justify-center min-h-[350px]">
            {hasIntersected ? (
                <Suspense
                    fallback={
                        <div className="flex flex-col items-center justify-center w-full h-[350px]">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    }
                >
                    <TrendChart
                        viewMode={viewMode}
                        onModeToggle={onModeToggle}
                        showModeToggle={showModeToggle}
                        queries={queries}
                    />
                </Suspense>
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-[350px]" />
            )}
        </div>
    );
}
