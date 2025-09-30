import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';
import { MdOutlineRemoveCircleOutline } from 'react-icons/md';
import PropTypes from 'prop-types';
import * as Tone from 'tone';
import kick from '../../assets/kick.wav';
import snare from '../../assets/snare.wav';
import hat from '../../assets/hat.wav';

const DRUM_SOUNDS = [
    { id: 'kick', name: 'Kick', src: kick },
    { id: 'snare', name: 'Snare', src: snare },
    { id: 'hat', name: 'Hat', src: hat },
];

const TIME_STEPS = 8;
const TEMPO_BPM = 120;

const DemoSequencer = ({ onPlayStateChange }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    
    // default pattern
    const [drumSequence, setDrumSequence] = useState([
        { steps: [true, false, false, false, true, true, false, false] }, // kick
        { steps: [false, false, true, false, false, false, true, false] }, // snare
        { steps: [true, true, false, true, false, true, false, true] }, // hat
    ]);
    
    const playersRef = useRef({});
    const sequenceRef = useRef(null);

    // initialize tone.js 
    useEffect(() => {
        const initializePlayers = async () => {
            try {
                const players = {};
                for (const sound of DRUM_SOUNDS) {
                    players[sound.id] = new Tone.Player(sound.src).toDestination();
                }
                await Tone.loaded();
                playersRef.current = players;
            } catch (error) {
                console.error('Error initializing audio:', error);
            }
        };

        initializePlayers();

        return () => {
            Object.values(playersRef.current).forEach(player => {
                if (player.dispose) {
                    player.dispose();
                }
            });
        };
    }, []);

    // setup sequence
    useEffect(() => {
        if (sequenceRef.current) {
            sequenceRef.current.dispose();
        }

        sequenceRef.current = new Tone.Sequence((time, step) => {
            setCurrentStep(step);
            
            DRUM_SOUNDS.forEach((sound, soundIndex) => {
                if (drumSequence[soundIndex]?.steps[step]) {
                    const player = playersRef.current[sound.id];
                    if (player) {
                        player.start(time);
                    }
                }
            });
        }, [...Array(TIME_STEPS).keys()], `${TIME_STEPS}n`);

        return () => {
            if (sequenceRef.current) {
                sequenceRef.current.dispose();
            }
        };
    }, [drumSequence]);

    const handlePlay = async () => {
        try {
            if (Tone.getContext().state !== 'running') {
                await Tone.start();
            }

            if (!isPlaying) {
                Tone.getTransport().bpm.value = TEMPO_BPM;
                sequenceRef.current?.start();
                Tone.getTransport().start();
                setIsPlaying(true);
                onPlayStateChange?.(true);
            } else {
                Tone.getTransport().stop();
                sequenceRef.current?.stop();
                setIsPlaying(false);
                setCurrentStep(0);
                onPlayStateChange?.(false);
            }
        } catch (error) {
            console.error('Error controlling playback:', error);
        }
    };

    const handleDrumCellClick = (soundIndex, stepIndex) => {
        const newSequence = drumSequence.map((track, currentSoundIndex) => {
            if (currentSoundIndex === soundIndex) {
                const newSteps = [...track.steps];
                newSteps[stepIndex] = !newSteps[stepIndex];
                return { ...track, steps: newSteps };
            }
            return track;
        });
        setDrumSequence(newSequence);
    };

    const handleClear = () => {
        const clearedSequence = drumSequence.map(track => ({
            ...track,
            steps: Array(TIME_STEPS).fill(false)
        }));
        setDrumSequence(clearedSequence);
    };

    const shouldBeDarkerDrum = (timeStep) => {
        return (timeStep === 2 || timeStep === 3) || (timeStep === 6 || timeStep === 7);
    };

    return (
        <div className="demo-sequencer w-full p-4 md:p-6 lg:p-8 bg-base-300 rounded-xl shadow-md h-[220px] md:h-[280px] lg:h-[360px] flex flex-col">
            <div className="flex flex-row items-center justify-between w-full mb-4 md:mb-6 lg:mb-8 px-2">
                <button
                    onClick={handlePlay}
                    className={`btn btn-sm md:btn-md lg:btn-lg btn-neutral rounded-lg ${isPlaying ? 'text-red-300' : 'text-cyan-200'} w-24 md:w-28 lg:w-32`}
                    aria-label={isPlaying ? "Stop drum loop" : "Play drum loop"}
                >
                    {isPlaying ? <FaStop className="mr-1" /> : <FaPlay className="mr-1" />}
                    {isPlaying ? 'Stop' : 'Play'}
                </button>

                <button
                    onClick={handleClear}
                    className="btn btn-sm md:btn-md lg:btn-lg btn-neutral rounded-lg w-24 md:w-28 lg:w-32"
                    aria-label="Clear drum pattern"
                >
                    <MdOutlineRemoveCircleOutline className="mr-1" />
                    Clear
                </button>
            </div>

            <div className="flex flex-col gap-1 md:gap-2 lg:gap-3 p-1 md:p-2 lg:p-3 bg-base-300 rounded flex-grow">
                {DRUM_SOUNDS.map((sound, soundIndex) => (
                    <div key={sound.id} className="flex items-center gap-1">
                        <div className="w-20 md:w-24 lg:w-28 h-10 md:h-12 lg:h-16 flex items-center justify-center text-xs md:text-sm lg:text-base font-semibold bg-base-100 text-base-content rounded p-1 truncate">
                            {sound.name}
                        </div>

                        <div className="flex-grow grid gap-0.5 md:gap-1 lg:gap-2" style={{ gridTemplateColumns: `repeat(${TIME_STEPS}, minmax(0, 1fr))` }}>
                            {drumSequence[soundIndex]?.steps.map((isActive, stepIndex) => (
                                <button
                                    key={`${sound.id}-${stepIndex}`}
                                    onClick={() => handleDrumCellClick(soundIndex, stepIndex)}
                                    className={`
                                        h-10 md:h-12 lg:h-16 w-full rounded border border-base-content/30
                                        transition-all duration-100 ease-in-out
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
};

export default DemoSequencer;