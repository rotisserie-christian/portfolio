import { lazy, Suspense, useState } from "react";
import { SequencerProvider } from "@/contexts/SequencerContext.jsx";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const DemoSequencer = lazy(() => import("@/components/crayonbrain/DemoSequencer"));
const StocksVisualizer = lazy(() => import("@/components/crayonbrain/StocksVisualizer"));

function DemoFallback() {
    return (
        <div className="w-full h-[500px] flex flex-col items-center justify-center bg-base-300 rounded-xl shadow-sm skeleton opacity-50">
            <LoadingSpinner className="text-primary" label="Loading stocks visualizer demo" />
        </div>
    );
}

export default function StocksVisualizerDemo() {
    const [demoOpen, setDemoOpen] = useState(false);
    const buttonClass = "btn btn-outline border-cyan-200/25 border-2 text-cyan-100";

    return (
        <>
            <div className="flex flex-row flex-wrap items-center gap-3 mt-4">
                <button
                    type="button"
                    className={buttonClass}
                    aria-expanded={demoOpen}
                    onClick={() => setDemoOpen((open) => !open)}
                >
                    {demoOpen ? "Close demo" : "Load demo"}
                </button>
            </div>

            {demoOpen && (
                <SequencerProvider>
                    <div className="flex flex-col lg:flex-row items-stretch justify-center gap-4 w-full mt-4">
                        <div className="w-full lg:w-1/2">
                            <Suspense fallback={<DemoFallback />}>
                                <DemoSequencer />
                            </Suspense>
                        </div>
                        <div className="w-full lg:w-1/2 h-[500px]">
                            <Suspense fallback={<DemoFallback />}>
                                <StocksVisualizer canvasId="stocks-demo-visualizer" fillParent />
                            </Suspense>
                        </div>
                    </div>
                </SequencerProvider>
            )}
        </>
    );
}
