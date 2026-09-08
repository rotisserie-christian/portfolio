import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { SequencerContext } from './SequencerContext';
import { DEFAULT_BPM } from '@/components/crayonbrain/utils/sequencerConstants';

/**
 * Manages sequencer state shared between sequencer and visualizer
 */
export const SequencerProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const sequencerGainRef = useRef(null);

  const value = {
    isPlaying,
    setIsPlaying,
    sequencerGainRef,
    bpm,
    setBpm,
  };

  return (
    <SequencerContext.Provider value={value}>
      {children}
    </SequencerContext.Provider>
  );
};

SequencerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

