import { useState, useEffect, useRef, useMemo } from 'react';
import * as Tone from 'tone';

const TIME_STEPS = 8;
const TEMPO_BPM = 120;

/**
 * Builds and renders musical sequence, and callbacks to change the sequence during playback
 * 
 * @param {Array} drumSequence - Array of drum tracks with step patterns
 * @param {Array} drumSounds - Array of sound objects { id, name, src }
 * @param {Function} onStepChange - Optional callback for step changes
 * @returns {Object} Sequencer state and controls
 * @returns {boolean} returns.isPlaying - Current playback state
 * @returns {number} returns.currentStep - Current step in sequence
 * @returns {Function} returns.handlePlay - Function to start/stop playback
 * @returns {Object} returns.sequencerGainRef - Audio gain node reference
 * @returns {boolean} returns.isInitializing - Initialization state
 */
export const useSequencer = (drumSequence, drumSounds, onStepChange) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isInitializing, setIsInitializing] = useState(true);
    
    const playersRef = useRef({});
    const sequenceRef = useRef(null);
    const drumSequenceRef = useRef(drumSequence);
    const sequencerGainRef = useRef(null);
    const isInitializingRef = useRef(false);
    
    // Stabilize drumSounds to prevent unnecessary reinitializations
    const stableDrumSounds = useMemo(() => drumSounds, [drumSounds]);

    // Ref of the latest sequence, so the scheduler reads fresh data
    useEffect(() => {
        drumSequenceRef.current = drumSequence;
    }, [drumSequence]);

    // Initialize tone.js
    useEffect(() => {
        const initializePlayers = async () => {
            try {
                isInitializingRef.current = true;
                setIsInitializing(true);
                
                // gain node for the sequencer
                const sequencerGain = new Tone.Gain(1);
                sequencerGain.toDestination();
                sequencerGainRef.current = sequencerGain;

                const players = {};
                for (const sound of stableDrumSounds) {
                    players[sound.id] = new Tone.Player(sound.src).connect(sequencerGain);
                }
                await Tone.loaded();
                playersRef.current = players;
                
                isInitializingRef.current = false;
                setIsInitializing(false);
            } catch (error) {
                isInitializingRef.current = false;
                setIsInitializing(false);
                console.error('Error initializing audio:', error);
            }
        };

        initializePlayers();

        return () => {
            // Only remove nodes if not currently initializing, to prevent race conditions
            if (!isInitializingRef.current) {
                Object.values(playersRef.current).forEach(player => {
                    if (player && player.dispose) {
                        player.dispose();
                    }
                });
                if (sequencerGainRef.current) {
                    sequencerGainRef.current.dispose();
                }
            }
        };
    }, [stableDrumSounds]);

    // Setup sequence once, read pattern from ref so edits apply next ticks
    useEffect(() => {
        sequenceRef.current = new Tone.Sequence((time, step) => {
            setCurrentStep(step);
            onStepChange?.(step);
            
            stableDrumSounds.forEach((sound, soundIndex) => {
                const track = drumSequenceRef.current[soundIndex];
                if (track?.steps[step]) {
                    const player = playersRef.current[sound.id];
                    // Add player readiness check to prevent audio glitches
                    if (player && player.loaded) {
                        player.start(time);
                    }
                }
            });
        }, [...Array(TIME_STEPS).keys()], `${TIME_STEPS}n`);

        return () => {
            if (sequenceRef.current) {
                try { 
                    sequenceRef.current.stop(); 
                } catch (error) {
                    console.warn('Error stopping sequence:', error);
                }
                sequenceRef.current.dispose();
                sequenceRef.current = null;
            }
        };
    }, [stableDrumSounds, onStepChange]);

    /**
     * Play/stop functionality 
     * @returns {Promise<void>}
     */
    const handlePlay = async () => {
        try {
            if (Tone.getContext().state !== 'running') {
                await Tone.start();
            }

            if (!isPlaying) {
                if (!sequenceRef.current) {
                    console.warn('Sequence not ready, cannot start playback');
                    return;
                }
                
                Tone.getTransport().bpm.value = TEMPO_BPM;
                sequenceRef.current.start();
                Tone.getTransport().start();
                
                // Update state after confirming transport started
                if (Tone.getTransport().state === 'started') {
                    setIsPlaying(true);
                }
            } else {
                Tone.getTransport().stop();
                sequenceRef.current?.stop();
                setIsPlaying(false);
                setCurrentStep(0);
            }
        } catch (error) {
            console.error('Error controlling playback:', error);
            // Reset state on error
            setIsPlaying(false);
            setCurrentStep(0);
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
