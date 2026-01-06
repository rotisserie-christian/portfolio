import { useEffect } from 'react';
import * as Tone from 'tone';
import { AudioInitializationError } from '../../utils/errors';

/**
 * Initializes and manages Tone.Player instances
 * 
 * @param {Array} drumSounds - Array of sound objects { id, name, src }
 * @param {Object} playersRef - React ref to store player instances
 * @param {Object} sequencerGainRef - React ref to store sequencer gain node
 * @param {Object} isInitializingRef - React ref to track initialization state
 * @param {Function} setIsInitializing - Function to update initialization state
 * @param {boolean} shouldInitialize - Whether to initialize players (for lazy loading)
 * @returns {void}
 */
export const useTonePlayers = (
  drumSounds,
  playersRef,
  sequencerGainRef,
  isInitializingRef,
  setIsInitializing,
  shouldInitialize = true
) => {
  useEffect(() => {
    if (!shouldInitialize) return;

    const initializePlayers = async () => {
      try {
        isInitializingRef.current = true;
        setIsInitializing(true);
        
        // gain node for the sequencer
        const sequencerGain = new Tone.Gain(1);
        sequencerGain.toDestination();
        sequencerGainRef.current = sequencerGain;

        const players = {};
        for (const sound of drumSounds) {
          players[sound.id] = new Tone.Player(sound.src).connect(sequencerGain);
        }
        await Tone.loaded();
        playersRef.current = players;
        
        isInitializingRef.current = false;
        setIsInitializing(false);
      } catch (error) {
        isInitializingRef.current = false;
        setIsInitializing(false);
        const audioError = new AudioInitializationError('Error initializing audio', error);
        if (import.meta?.env?.MODE === 'development') {
          console.error(audioError.message, audioError.cause);
        }
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
  }, [drumSounds, playersRef, sequencerGainRef, isInitializingRef, setIsInitializing, shouldInitialize]);
};

