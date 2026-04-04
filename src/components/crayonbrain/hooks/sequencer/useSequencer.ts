import { useState, useEffect, useRef, useMemo } from 'react';
import * as Tone from 'tone';
import { DEFAULT_BPM } from '../../utils/sequencerConstants';
import { useTonePlayers } from './useTonePlayers';
import { useTempo } from './useTempo';
import { useToneSequence } from './useToneSequence';
import { useTransport } from './useTransport';
import { DrumSound, DrumSequenceTrack, SequencerState } from '../../types/sequencer';

/**
 * Builds and renders musical sequence, and callbacks to change the sequence during playback
 * 
 * @param drumSequence - Array of drum tracks with step patterns
 * @param drumSounds - Array of sound objects { id, name, src }
 * @param tempoBpm - Tempo in BPM (default: 170)
 * @param shouldInitialize - Whether to initialize audio players (for lazy loading)
 * @returns Sequencer state and controls
 */
export const useSequencer = (
  drumSequence: DrumSequenceTrack[], 
  drumSounds: DrumSound[], 
  tempoBpm: number = DEFAULT_BPM, 
  shouldInitialize: boolean = true
): SequencerState => {
    const [isPlaying, setIsPlaying] = useState(false);
    const currentStepRef = useRef<number>(0);
    const [isInitializing, setIsInitializing] = useState(true);
    
    const playersRef = useRef<Record<string, Tone.Player>>({});
    const sequenceRef = useRef<Tone.Sequence | null>(null);
    const drumSequenceRef = useRef<DrumSequenceTrack[]>(drumSequence);
    const sequencerGainRef = useRef<Tone.Gain | null>(null);
    const isInitializingRef = useRef<boolean>(false);
    const tempoBpmRef = useRef<number>(tempoBpm);
    
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
        setIsInitializing,
        shouldInitialize
    );

    // Setup Tone.Sequence
    useToneSequence(
        stableDrumSounds,
        playersRef,
        drumSequenceRef,
        sequenceRef,
        currentStepRef
    );

    // Manage Transport play/stop 
    const handlePlay = useTransport(
        isPlaying,
        setIsPlaying,
        currentStepRef,
        sequenceRef,
        tempoBpmRef
    );

    return {
        isPlaying,
        currentStepRef, 
        handlePlay,
        playersRef,
        sequencerGainRef,
        isInitializing
    };
};
