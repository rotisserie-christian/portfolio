import { screen, waitFor } from '@testing-library/react';
import { expect } from 'vitest';

// timeout constants for integration tests
export const INTEGRATION_TIMEOUTS = {
  SHORT: 2000,
  MEDIUM: 5000,
  LONG: 10000,
};

/**
 * Waits for sequencer initialization to complete
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 */
export const waitForSequencerReady = async (timeout = INTEGRATION_TIMEOUTS.MEDIUM) => {
  await waitFor(() => {
    const isInitializing = screen.getByTestId('is-initializing');
    expect(isInitializing).toHaveTextContent('ready');
  }, { timeout });
};

