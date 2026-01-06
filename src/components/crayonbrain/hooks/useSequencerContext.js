import { useContext } from 'react';
import { SequencerContext } from '../../../contexts/SequencerContext.js';

/**
 * Hook to access sequencer context
 * @throws {Error} If used outside SequencerProvider
 * @returns {Object} Sequencer context value with isPlaying, setIsPlaying, and sequencerGainRef
 */
export const useSequencerContext = () => {
  const context = useContext(SequencerContext);
  if (!context) {
    throw new Error('useSequencerContext must be used within SequencerProvider');
  }
  return context;
};

