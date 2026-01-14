import { Suspense, lazy } from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const Flowchart = lazy(() => import('../flowchart/Flowchart'));

const LazyFlowchart = () => {
    const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: '200px' });

    return (
        <div ref={elementRef} className="w-full">
            {hasIntersected ? (
                <Suspense fallback={
                    <div className="mx-auto w-[350px] h-[750px] flex items-center justify-center">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                }>
                    <Flowchart />
                </Suspense>
            ) : (
                <div className="mx-auto w-[350px] h-[750px]" /> // Placeholder
            )}
        </div>
    );
};

const HowItWorks = ({ title = "How it works", description, flowchart = <LazyFlowchart /> }) => {
    return (
        <>
            <div className="flex justify-center w-full mt-8 lg:mt-10">
                <div className="border-l-[10px] border-dotted border-white/20 h-[120px]"></div>
            </div>

            <h1 className="text-3xl lg:text-5xl lg:text-right text-neutral-content/85 ubuntu-bold mt-8 lg:mt-10">
                {title}
            </h1>

            <div className="flex flex-col lg:flex-row mt-5 mb-10 gap-10 items-center justify-center max-w-5xl mx-auto w-full">
                {flowchart}
                
                <div className="flex flex-col items-center lg:items-start justify-center w-full px-4">
                    <div className="lg:text-lg lg:text-left text-neutral-content/85 text-left w-full max-w-sm lg:max-w-xl lg:text-left">
                        {description}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HowItWorks;
