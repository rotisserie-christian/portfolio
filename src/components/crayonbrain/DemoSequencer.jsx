import { useState, useCallback, useEffect } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';
import { MdOutlineRemoveCircleOutline } from 'react-icons/md';
import PropTypes from 'prop-types';
import { useSequencer } from '../../hooks/useSequencer';
import TempoSlider from './TempoSlider';
import { DEFAULT_BPM } from './tempoConstants';
import kick from '../../assets/kick.wav';
import snare from '../../assets/snare.wav';
import hat from '../../assets/hat.wav';

const DRUM_SOUNDS = [
    { id: 'kick', name: 'Kick', src: kick },
    { id: 'snare', name: 'Snare', src: snare },
    { id: 'hat', name: 'Hat', src: hat },
];

const TIME_STEPS = 8;

const DemoSequencer = ({ onPlayStateChange, onSequencerGainRef }) => {
    // Default pattern
    const [drumSequence, setDrumSequence] = useState([
        { steps: [true, false, false, false, false, true, false, false] }, // kick
        { steps: [false, false, true, false, false, false, true, false] }, // snare
        { steps: [true, false, false, false, true, false, false, false] }, // hat
    ]);
    
    const [bpm, setBpm] = useState(DEFAULT_BPM);
    
    const onStepChange = useCallback(() => {
        // Optional: handle step changes if needed
    }, []);

    const { isPlaying, currentStep, handlePlay, sequencerGainRef, isInitializing } = useSequencer(
        drumSequence, 
        DRUM_SOUNDS,
        onStepChange,
        bpm
    );

    const handlePlayWithCallback = async () => {
        await handlePlay();
        onPlayStateChange?.(!isPlaying);
    };

    // Pass sequencerGainRef to parent when it's available
    useEffect(() => {
        if (sequencerGainRef && onSequencerGainRef) {
            onSequencerGainRef(sequencerGainRef);
        }
    }, [sequencerGainRef, onSequencerGainRef]);

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
        <div className="demo-sequencer w-full p-4 bg-base-300 rounded-xl shadow-sm flex flex-col">
            <div className="flex flex-row items-center justify-between w-full mb-4 md:mb-6 lg:mb-8 px-2">
                <button
                    onClick={handlePlayWithCallback}
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

            <div className="flex flex-col gap-1 md:gap-2 lg:gap-2 p-1 md:p-2 lg:p-3 bg-base-300 rounded flex-grow">
                {DRUM_SOUNDS.map((sound, soundIndex) => (
                    <div key={sound.id} className="flex items-center gap-1">
                        <div className="w-20 md:w-24 lg:w-28 h-10 md:h-12 lg:h-12 flex items-center justify-center text-xs md:text-sm lg:text-base font-semibold bg-base-100 text-base-content rounded p-1 truncate">
                            {sound.name}
                        </div>

                        <div className="flex-grow grid gap-1 md:gap-1.5 lg:gap-1.5" style={{ gridTemplateColumns: `repeat(${TIME_STEPS}, minmax(0, 1fr))` }}>
                            {drumSequence[soundIndex]?.steps.map((isActive, stepIndex) => (
                                <button
                                    key={`${sound.id}-${stepIndex}`}
                                    onClick={() => handleDrumCellClick(soundIndex, stepIndex)}
                                    className={`
                                        h-10 md:h-12 lg:h-12 w-full min-w-[32px] md:min-w-[36px] lg:min-w-[40px] rounded border border-base-content/30
                                        transition-all duration-100 ease-in-out cursor-pointer
                                        ${isActive ? 'bg-accent scale-95' : (shouldBeDarkerDrum(stepIndex) ? 'bg-base-300 hover:bg-neutral-500' : 'bg-base-100 hover:bg-neutral-focus/30')}
                                        ${currentStep === stepIndex && isPlaying ? 'ring-2 ring-primary ring-offset-1 ring-offset-base-300' : ''}
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

DemoSequencer.propTypes = {
    onPlayStateChange: PropTypes.func,
    onSequencerGainRef: PropTypes.func,
};

export default DemoSequencer;