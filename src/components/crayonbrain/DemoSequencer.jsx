import { Suspense, lazy } from 'react';
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SEQUENCER_OBSERVER_ROOT_MARGIN } from './utils/sequencerConstants';

const SequencerInner = lazy(() => import('./SequencerInner'));

const DemoSequencer = () => {
    const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: SEQUENCER_OBSERVER_ROOT_MARGIN });

    return (
        <div ref={elementRef} className="demo-sequencer w-full h-[500px] w-full p-4 bg-base-300 rounded-xl shadow-sm flex flex-col">
            <Suspense fallback={
                <div className="w-full h-full flex flex-col items-center justify-center skeleton opacity-50">
                    <LoadingSpinner className="text-primary" label="Loading sequencer" />
                </div>
            }>
                <SequencerInner hasIntersected={hasIntersected} />
            </Suspense>
        </div>
    );
};

export default DemoSequencer;