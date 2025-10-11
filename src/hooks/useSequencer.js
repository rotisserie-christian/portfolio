import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

const TIME_STEPS = 8;
const TEMPO_BPM = 120;

export const useSequencer = (drumSequence, drumSounds, onStepChange) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isInitializing, setIsInitializing] = useState(true);
    
    const playersRef = useRef({});
    const sequenceRef = useRef(null);
    const drumSequenceRef = useRef(drumSequence);
    const sequencerGainRef = useRef(null);

    // Keep a ref of the latest sequence so the scheduler reads fresh data
    useEffect(() => {
        drumSequenceRef.current = drumSequence;
    }, [drumSequence]);

    // Initialize tone.js
    useEffect(() => {
        const initializePlayers = async () => {
            try {
                setIsInitializing(true);
                // Create dedicated gain node for sequencer audio
                const sequencerGain = new Tone.Gain(1);
                sequencerGain.toDestination();
                sequencerGainRef.current = sequencerGain;

                const players = {};
                for (const sound of drumSounds) {
                    players[sound.id] = new Tone.Player(sound.src).connect(sequencerGain);
                }
                await Tone.loaded();
                playersRef.current = players;
                setIsInitializing(false);
            } catch (error) {
                setIsInitializing(false);
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
            if (sequencerGainRef.current) {
                sequencerGainRef.current.dispose();
            }
        };
    }, [drumSounds]);

    // Setup sequence once, read pattern from ref so edits apply next ticks
    useEffect(() => {
        sequenceRef.current = new Tone.Sequence((time, step) => {
            setCurrentStep(step);
            onStepChange?.(step);
            
            drumSounds.forEach((sound, soundIndex) => {
                const track = drumSequenceRef.current[soundIndex];
                if (track?.steps[step]) {
                    const player = playersRef.current[sound.id];
                    if (player) {
                        player.start(time);
                    }
                }
            });
        }, [...Array(TIME_STEPS).keys()], `${TIME_STEPS}n`);

        return () => {
            if (sequenceRef.current) {
                try { sequenceRef.current.stop(); } catch { /* noop */ }
                sequenceRef.current.dispose();
                sequenceRef.current = null;
            }
        };
    }, [drumSounds, onStepChange]);

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
            } else {
                Tone.getTransport().stop();
                sequenceRef.current?.stop();
                setIsPlaying(false);
                setCurrentStep(0);
            }
        } catch (error) {
            console.error('Error controlling playback:', error);
        }
    };

    return {
        isPlaying,
        currentStep,
        handlePlay,
        playersRef,
        sequencerGainRef,
        isInitializing
    };
};
