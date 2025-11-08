import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { SequencerContext } from './SequencerContext';

/**
 * Manages sequencer state shared between sequencer and visualizer
 */
export const SequencerProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const sequencerGainRef = useRef(null);

  const value = {
    isPlaying,
    setIsPlaying,
    sequencerGainRef,
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

