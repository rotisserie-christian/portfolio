import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSequencerContext } from './useSequencerContext';
import { SequencerProvider } from '../contexts/SequencerContext.jsx';

// Helper function to wrap hook with provider
const wrapperWithProvider = ({ children }) => (
  <SequencerProvider>{children}</SequencerProvider>
);

describe('useSequencerContext', () => {
  it('should return context value when used within provider', () => {
    const { result } = renderHook(() => useSequencerContext(), {
      wrapper: wrapperWithProvider,
    });

    expect(result.current).toHaveProperty('isPlaying');
    expect(result.current).toHaveProperty('setIsPlaying');
    expect(result.current).toHaveProperty('sequencerGainRef');
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.sequencerGainRef).toBeDefined();
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useSequencerContext());
    }).toThrow('useSequencerContext must be used within SequencerProvider');

    consoleSpy.mockRestore();
  });

  it('should provide access to isPlaying state', () => {
    const { result } = renderHook(() => useSequencerContext(), {
      wrapper: wrapperWithProvider,
    });

    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.setIsPlaying(true);
    });

    expect(result.current.isPlaying).toBe(true);
  });

  it('should provide access to sequencerGainRef', () => {
    const { result } = renderHook(() => useSequencerContext(), {
      wrapper: wrapperWithProvider,
    });

    const mockGainNode = { connect: vi.fn() };

    act(() => {
      result.current.sequencerGainRef.current = mockGainNode;
    });

    expect(result.current.sequencerGainRef.current).toBe(mockGainNode);
  });
});

