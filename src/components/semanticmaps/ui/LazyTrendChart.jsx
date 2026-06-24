import { Suspense, lazy } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const TrendChart = lazy(() => import("./TrendChart"));

export default function LazyTrendChart({ viewMode, onModeToggle }) {
    const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: "0px" });

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
                    <TrendChart viewMode={viewMode} onModeToggle={onModeToggle} />
                </Suspense>
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-[350px]" />
            )}
        </div>
    );
}
