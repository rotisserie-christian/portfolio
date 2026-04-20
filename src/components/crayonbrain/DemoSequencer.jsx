import { Suspense, lazy } from 'react';
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import SequencerFeatures from './ui/SequencerFeatures';
import { SEQUENCER_OBSERVER_ROOT_MARGIN } from './utils/sequencerConstants';

const SequencerInner = lazy(() => import('./SequencerInner'));

const DemoSequencer = ({ isDemoLoaded }) => {
    const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: SEQUENCER_OBSERVER_ROOT_MARGIN });

    return (
        <div ref={elementRef} className="demo-sequencer w-full h-[500px] w-full p-4 bg-base-300 rounded-xl shadow-sm flex flex-col">
            {!isDemoLoaded ? (
                <SequencerFeatures />
            ) : (
                <Suspense fallback={
                    <div className="w-full h-full flex flex-col items-center justify-center skeleton opacity-50">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                }>
                    <SequencerInner hasIntersected={hasIntersected} />
                </Suspense>
            )}
        </div>
    );
};

export default DemoSequencer;