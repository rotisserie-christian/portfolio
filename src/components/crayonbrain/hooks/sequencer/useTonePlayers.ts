import { useEffect, RefObject } from 'react';
import * as Tone from 'tone';
import { AudioInitializationError } from '@/components/crayonbrain/utils/errors';
import { DrumSound } from '@/components/crayonbrain/types/sequencer';

/**
 * Initializes and manages Tone.Player instances
 * 
 * @param drumSounds - Array of sound objects { id, name, src }
 * @param playersRef - React ref to store player instances
 * @param sequencerGainRef - React ref to store sequencer gain node
 * @param isInitializingRef - React ref to track initialization state
 * @param setIsInitializing - Function to update initialization state
 * @param shouldInitialize - Whether to initialize players (for lazy loading)
 */
export const useTonePlayers = (
  drumSounds: DrumSound[],
  playersRef: RefObject<Record<string, Tone.Player>>,
  sequencerGainRef: RefObject<Tone.Gain | null>,
  isInitializingRef: RefObject<boolean>,
  setIsInitializing: (isInitializing: boolean) => void,
  shouldInitialize: boolean = true
): void => {
  useEffect(() => {
    if (!shouldInitialize) return;

    const initializePlayers = async () => {
      try {
        (isInitializingRef as any).current = true;
        setIsInitializing(true);
        
        // gain node for the sequencer
        const sequencerGain = new Tone.Gain(1);
        sequencerGain.toDestination();
        (sequencerGainRef as any).current = sequencerGain;

        const players: Record<string, Tone.Player> = {};
        for (const sound of drumSounds) {
          players[sound.id] = new Tone.Player(sound.src).connect(sequencerGain);
        }
        await Tone.loaded();
        (playersRef as any).current = players;
        
        (isInitializingRef as any).current = false;
        setIsInitializing(false);
      } catch (error) {
        (isInitializingRef as any).current = false;
        setIsInitializing(false);
        const audioError = new AudioInitializationError('Error initializing audio', error as Error);
        if (import.meta.env?.MODE === 'development') {
          console.error(audioError.message, audioError.cause);
        }
      }
    };

    initializePlayers();

    return () => {
      // Only remove nodes if not currently initializing, to prevent race conditions
      if (!isInitializingRef.current) {
        if (playersRef.current) {
          Object.values(playersRef.current).forEach(player => {
            if (player && player.dispose) {
              player.dispose();
            }
          });
        }
        if (sequencerGainRef.current) {
          sequencerGainRef.current.dispose();
        }
      }
    };
  }, [drumSounds, playersRef, sequencerGainRef, isInitializingRef, setIsInitializing, shouldInitialize]);
};
