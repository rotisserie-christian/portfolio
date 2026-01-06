import { useState, useEffect } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';
import { MdOutlineRemoveCircleOutline } from 'react-icons/md';
import { useSequencer } from './hooks/sequencer/useSequencer';
import { useSequencerContext } from './hooks/useSequencerContext';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import TempoSlider from './TempoSlider';
import { DEFAULT_BPM } from './utils/sequencerConstants';
import kick from '../../assets/kick.wav';
import snare from '../../assets/snare.wav';
import snare2 from '../../assets/snare2.wav';
import hat from '../../assets/hat.wav';

const DRUM_SOUNDS = [
    { id: 'kick', name: 'Kick', src: kick },
    { id: 'snare', name: 'Snare', src: snare },
    { id: 'snare2', name: 'Snare2', src: snare2 },
    { id: 'hat', name: 'Hat', src: hat },
];

const TIME_STEPS = 8;

const DemoSequencer = () => {
    const { setIsPlaying, sequencerGainRef: contextGainRef } = useSequencerContext();
    const { elementRef, hasIntersected } = useIntersectionObserver({ rootMargin: '100px' });
    
    // Default pattern
    const [drumSequence, setDrumSequence] = useState([
        { steps: [true, false, false, false, false, true, false, false] }, // kick
        { steps: [false, false, true, false, false, false, true, false] }, // snare
        { steps: [false, false, false, false, false, false, false, false] }, // snare2
        { steps: [true, false, false, false, true, false, false, false] }, // hat
    ]);
    
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
        setDrumSequence(prev => prev.map((track, currentSoundIndex) => {
            if (currentSoundIndex === soundIndex) {
                const newSteps = [...track.steps];
                newSteps[stepIndex] = !newSteps[stepIndex];
                return { ...track, steps: newSteps };
            }
            return track;
        }));
    };

    const handleClear = () => {
        const clearedSequence = drumSequence.map(track => ({
            ...track,
            steps: Array(TIME_STEPS).fill(false)
        }));
        setDrumSequence(clearedSequence);
    };

    // alternating shades to highlight 1/4 notes 
    const shouldBeDarkerDrum = (timeStep) => {
        return (timeStep === 2 || timeStep === 3) || (timeStep === 6 || timeStep === 7);
    };

    return (
        <div ref={elementRef} className="demo-sequencer w-full h-[420px] p-4 bg-base-300 rounded-xl shadow-sm flex flex-col">
            <div className="flex flex-row items-center justify-between w-full mb-4 md:mb-6 lg:mb-8 px-2">
                <button
                    onClick={handlePlay}
                    className={`btn btn-neutral rounded-xl ${isPlaying ? 'text-red-300' : 'text-cyan-200'} w-24 md:w-28 lg:w-32`}
                    disabled={isInitializing}
                    aria-label={isPlaying ? "Stop drum loop" : "Play drum loop"}
                >
                    {isInitializing ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        <>
                            {isPlaying ? <FaStop className="mr-1" /> : <FaPlay className="mr-1" />}
                            {isPlaying ? 'Stop' : 'Play'}
                        </>
                    )}
                </button>

                <button
                    onClick={handleClear}
                    className="btn btn-neutral rounded-xl w-24 md:w-28 lg:w-32"
                    aria-label="Clear drum pattern"
                >
                    <MdOutlineRemoveCircleOutline className="mr-1" />
                    Clear
                </button>
            </div>

            <TempoSlider bpm={bpm} onBpmChange={setBpm} />

            <div className="flex flex-col gap-1 p-1 md:p-2 lg:p-3 bg-base-300 rounded">
                {DRUM_SOUNDS.map((sound, soundIndex) => (
                    <div key={sound.id} className="flex items-center gap-1">
                        <div className="w-20 md:w-24 lg:w-28 h-10 flex items-center justify-center text-xs md:text-sm lg:text-base font-semibold bg-base-100 text-base-content rounded p-1 truncate">
                            {sound.name}
                        </div>

                        <div className="flex-grow grid gap-2 md:gap-1.5 lg:gap-1" style={{ gridTemplateColumns: `repeat(${TIME_STEPS}, minmax(0, 1fr))` }}>
                            {drumSequence[soundIndex]?.steps.map((isActive, stepIndex) => (
                                <button
                                    key={`${sound.id}-${stepIndex}`}
                                    onClick={() => handleDrumCellClick(soundIndex, stepIndex)}
                                    className={`
                                        h-10 w-full min-w-[32px] md:min-w-[34px] lg:min-w-[34px] rounded border border-base-content/30
                                        transition-all duration-100 ease-in-out cursor-pointer
                                        ${isActive ? 'bg-accent scale-95' : (shouldBeDarkerDrum(stepIndex) ? 'bg-base-300 hover:bg-neutral-500' : 'bg-base-100 hover:bg-neutral-focus/30')}
                                        ${currentStep === stepIndex && isPlaying ? 'border-2 border-primary md:border-base-content/30 md:ring-2 md:ring-primary md:ring-offset-1 md:ring-offset-base-300' : ''}
                                    `}
                                    aria-label={`Toggle ${sound.name} at step ${stepIndex + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default DemoSequencer;