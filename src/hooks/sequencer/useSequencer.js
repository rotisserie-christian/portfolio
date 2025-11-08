import { useState, useEffect, useRef, useMemo } from 'react';
import { DEFAULT_TEMPO_BPM } from './sequencerConstants';
import { useTonePlayers } from './useTonePlayers';
import { useTempo } from './useTempo';
import { useToneSequence } from './useToneSequence';
import { useTransport } from './useTransport';

/**
 * Builds and renders musical sequence, and callbacks to change the sequence during playback
 * 
 * @param {Array} drumSequence - Array of drum tracks with step patterns
 * @param {Array} drumSounds - Array of sound objects { id, name, src }
 * @param {number} tempoBpm - Tempo in BPM (default: 170)
 * @returns {Object} Sequencer state and controls
 * @returns {boolean} returns.isPlaying - Current playback state
 * @returns {number} returns.currentStep - Current step in sequence
 * @returns {Function} returns.handlePlay - Function to start/stop playback
 * @returns {Object} returns.sequencerGainRef - Audio gain node reference
 * @returns {boolean} returns.isInitializing - Initialization state
 */
export const useSequencer = (drumSequence, drumSounds, tempoBpm = DEFAULT_TEMPO_BPM) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isInitializing, setIsInitializing] = useState(true);
    
    const playersRef = useRef({});
    const sequenceRef = useRef(null);
    const drumSequenceRef = useRef(drumSequence);
    const sequencerGainRef = useRef(null);
    const isInitializingRef = useRef(false);
    const tempoBpmRef = useRef(tempoBpm);
    
    // Stabilize drumSounds to prevent unnecessary reinitializations
    const stableDrumSounds = useMemo(() => drumSounds, [drumSounds]);

    // Ref of the latest sequence, so the scheduler reads fresh data
    useEffect(() => {
        drumSequenceRef.current = drumSequence;
    }, [drumSequence]);

    // Manage tempo synchronization
    useTempo(tempoBpm, tempoBpmRef);

    // Initialize Tone.js players
    useTonePlayers(
        stableDrumSounds,
        playersRef,
        sequencerGainRef,
        isInitializingRef,
        setIsInitializing
    );

    // Setup Tone.Sequence for step-based playback
    useToneSequence(
        stableDrumSounds,
        playersRef,
        drumSequenceRef,
        sequenceRef,
        setCurrentStep
    );

    // Manage Transport play/stop functionality
    const handlePlay = useTransport(
        isPlaying,
        setIsPlaying,
        setCurrentStep,
        sequenceRef,
        tempoBpmRef
    );

    return {
        isPlaying,
        currentStep,
        handlePlay,
        playersRef,
        sequencerGainRef,
        isInitializing
    };
};

