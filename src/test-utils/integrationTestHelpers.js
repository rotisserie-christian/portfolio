import { screen, waitFor } from '@testing-library/react';
import { expect } from 'vitest';

/**
 * Common timeout constants for integration tests
 */
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

/**
 * Waits for a specific test ID to have expected text content
 * @param {string} testId - The test ID to wait for
 * @param {string} expectedText - The expected text content
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 */
export const waitForTestIdText = async (testId, expectedText, timeout = INTEGRATION_TIMEOUTS.MEDIUM) => {
  await waitFor(() => {
    const element = screen.getByTestId(testId);
    expect(element).toHaveTextContent(expectedText);
  }, { timeout });
};

/**
 * Waits for a test ID element to be in the document
 * @param {string} testId - The test ID to wait for
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 */
export const waitForTestId = async (testId, timeout = INTEGRATION_TIMEOUTS.MEDIUM) => {
  await waitFor(() => {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  }, { timeout });
};

