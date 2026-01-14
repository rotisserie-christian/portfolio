import { useState, useEffect } from 'react';
import { useSequencer } from './hooks/sequencer/useSequencer';
import { useSequencerContext } from './hooks/useSequencerContext';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import TempoSlider from './TempoSlider';
import SequencerControls from './ui/SequencerControls';
import DrumPad from './ui/DrumPad';
import { 
    DEFAULT_BPM, 
    SEQUENCER_OBSERVER_ROOT_MARGIN,
} from './utils/sequencerConstants';
import {
    createDefaultSequence,
    createEmptySequence,
    toggleStep
} from './utils/sequencerUtils';
import kick from '../../assets/kick.wav';
import snare from '../../assets/snare.wav';
import snare2 from '../../assets/snare2.wav';
import hat from '../../assets/hat.wav';
import kick808 from '../../assets/808kick.wav';
import hat2 from '../../assets/hat2.wav';

const DRUM_SOUNDS = [
    { id: 'kick', name: 'Kick', src: kick },
    { id: 'snare', name: 'Snare', src: snare },
    { id: 'snare2', name: 'Snare2', src: snare2 },
    { id: 'hat', name: 'Hat', src: hat },
    { id: '808kick', name: '808 Kick', src: kick808 },
    { id: 'hat2', name: 'Hat2', src: hat2 },
];

const DemoSequencer = () => {
    const { setIsPlaying, sequencerGainRef: contextGainRef } = useSequencerContext();
    const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: SEQUENCER_OBSERVER_ROOT_MARGIN });
    const [drumSequence, setDrumSequence] = useState(() => createDefaultSequence(DRUM_SOUNDS.length));
    const [bpm, setBpm] = useState(DEFAULT_BPM);
    const { isPlaying, currentStep, handlePlay, sequencerGainRef, isInitializing } = useSequencer(
        drumSequence, 
        DRUM_SOUNDS,
        bpm,
        hasIntersected
    );

    // Update context when sequencer state changes
    useEffect(() => {
        setIsPlaying(isPlaying);
    }, [isPlaying, setIsPlaying]);

    // Sync sequencerGainRef to context when it's available
    useEffect(() => {
        if (sequencerGainRef?.current) {
            contextGainRef.current = sequencerGainRef.current;
        }
    }, [sequencerGainRef, contextGainRef]);

    const handleDrumCellClick = (soundIndex, stepIndex) => {
        setDrumSequence(prev => toggleStep(prev, soundIndex, stepIndex));
    };

    const handleClear = () => {
        const clearedSequence = createEmptySequence(DRUM_SOUNDS.length);
        setDrumSequence(clearedSequence);
    };

    return (
        <div ref={elementRef} className="demo-sequencer w-full h-[500px] p-4 bg-base-300 rounded-xl shadow-sm flex flex-col">
            <SequencerControls
                isPlaying={isPlaying}
                isInitializing={isInitializing}
                onPlay={handlePlay}
                onClear={handleClear}
            />

            <TempoSlider bpm={bpm} onBpmChange={setBpm} />

            <DrumPad
                drumSounds={DRUM_SOUNDS}
                drumSequence={drumSequence}
                currentStep={currentStep}
                isPlaying={isPlaying}
                onCellClick={handleDrumCellClick}
            />
        </div>
    );
};


export default DemoSequencer;