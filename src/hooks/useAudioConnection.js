import { useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';

/**
 * Manages audio analyser connection to the source with polling fallback
 * 
 * @param {Object} audioSourceRef - Reference to the audio source gain node
 * @param {Object} analyserRef - Reference to the Web Audio analyser node
 * @param {Object} audioCtxRef - Reference to the Web Audio context
 * @param {Object} connectedGainRef - Reference to track the currently connected gain node
 * @returns {Function} connectAnalyser - Function to manually trigger connection
 */
export const useAudioConnection = (audioSourceRef, analyserRef, audioCtxRef, connectedGainRef) => {
  const pollingIntervalRef = useRef(null);

  const connectAnalyser = useCallback(() => {
    if (!analyserRef.current || !audioCtxRef.current) return;
    
    const analyser = analyserRef.current;
    const audioCtx = audioCtxRef.current;
    const audioSource = audioSourceRef?.current;
    
    // Disconnect from previous source if any
    try {
      if (connectedGainRef.current) {
        connectedGainRef.current.disconnect(analyser);
        connectedGainRef.current = null;
      }
    } catch {
      // Ignore disconnect errors
    }
    
    try {
      if (audioSource) {
        audioSource.connect(analyser);
        connectedGainRef.current = audioSource;
      } else {
        // Fallback: gain node connected to master output
        const fallbackGain = audioCtx.createGain();
        fallbackGain.connect(analyser);
        connectedGainRef.current = fallbackGain;
        
        const masterGain = Tone.getDestination().input;
        if (masterGain && masterGain.connect) {
          masterGain.connect(fallbackGain);
        } else {
          // Fallback: create a silent node
          const source = audioCtx.createMediaStreamDestination();
          source.connect(fallbackGain);
          console.warn('Using alternative audio routing fallback');
        }
      }
    } catch (err) {
      console.warn('failed to connect analyser to audio source', err);
    }
  }, [audioSourceRef, analyserRef, audioCtxRef, connectedGainRef]);

  // Reconnect when audioSourceRef becomes available
  // Polling approach since refs don't trigger re-renders
  useEffect(() => {
    let isCleanedUp = false;
    
    const checkConnection = () => {
      if (isCleanedUp) return;
      
      const audioSource = audioSourceRef?.current;
      const currentConnection = connectedGainRef.current;
      
      // If we have an audio source and it's different from what we're connected to, reconnect
      if (audioSource && analyserRef.current) {
        if (currentConnection !== audioSource) {
          connectAnalyser();
          // Stop polling once connected to audio source
          if (pollingIntervalRef.current && connectedGainRef.current === audioSource) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }
      }
    };
    
    checkConnection();
    
    // Poll periodically to catch when audioSourceRef becomes available
    // Stop polling once we're connected to the audio source
    pollingIntervalRef.current = setInterval(() => {
      if (!connectedGainRef.current || connectedGainRef.current !== audioSourceRef?.current) {
        checkConnection();
      } else if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }, 100);
    
    return () => {
      isCleanedUp = true;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [audioSourceRef, analyserRef, connectAnalyser, connectedGainRef]);

  return connectAnalyser;
};

