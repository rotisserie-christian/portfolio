import React from 'react';
import { SequencerProvider } from '../contexts/SequencerContext.jsx';

/**
 * Wrapper component for integration tests that need SequencerProvider
 */
export const wrapperWithSequencerProvider = ({ children }) => (
  <SequencerProvider>
    {children}
  </SequencerProvider>
);

