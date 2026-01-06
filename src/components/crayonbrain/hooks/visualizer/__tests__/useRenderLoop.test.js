import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRenderLoop } from '../useRenderLoop';
import {
  setupRequestAnimationFrame,
  stubEnvironmentMode,
} from './__test-utils__';

describe('useRenderLoop', () => {
  let renderCallback;
  let rafSetup;
  let cancelAnimationFrameSpy;

  beforeEach(() => {
    renderCallback = vi.fn();

    // Mock requestAnimationFrame
    rafSetup = setupRequestAnimationFrame();
    cancelAnimationFrameSpy = rafSetup.cancelAnimationFrameSpy;

    // Mock import.meta.env.MODE
    stubEnvironmentMode('development');
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  // Helper function to set up hook with optional isActive
  const setupHook = (callback = renderCallback, isActive = true) => {
    return renderHook(({ cb, active }) => useRenderLoop(cb, active), {
      initialProps: { cb: callback, active: isActive },
    });
  };

  it('should start render loop when isActive is true', () => {
    setupHook();

    expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
  });

  it('should not start render loop when isActive is false', () => {
    setupHook(renderCallback, false);

    expect(globalThis.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('should call renderCallback on each frame', () => {
    setupHook();

    // Simulate first frame
    act(() => {
      rafSetup.triggerFrame();
    });

    expect(renderCallback).toHaveBeenCalledTimes(1);

    // Simulate second frame
    act(() => {
      rafSetup.triggerFrame();
    });

    expect(renderCallback).toHaveBeenCalledTimes(2);
  });

  it('should continue loop by calling requestAnimationFrame recursively', () => {
    setupHook();

    // Initial call
    expect(globalThis.requestAnimationFrame).toHaveBeenCalledTimes(1);

    // Simulate frame - should schedule next frame
    act(() => {
      rafSetup.triggerFrame();
    });

    expect(globalThis.requestAnimationFrame).toHaveBeenCalledTimes(2);
  });

  it('should handle errors in renderCallback gracefully and continue loop', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorCallback = vi.fn(() => {
      throw new Error('Render error');
    });

    setupHook(errorCallback);

    act(() => {
      rafSetup.triggerFrame();
    });

    // Error should be caught and loop should continue
    expect(globalThis.requestAnimationFrame).toHaveBeenCalledTimes(2);
    // May or may not log depending on environment, but loop should continue
    consoleSpy.mockRestore();
  });

  it('should not log errors in production mode', () => {
    vi.unstubAllGlobals();
    stubEnvironmentMode('production');

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorCallback = vi.fn(() => {
      throw new Error('Render error');
    });

    setupHook(errorCallback);

    act(() => {
      rafSetup.triggerFrame();
    });

    expect(consoleSpy).not.toHaveBeenCalled();
    expect(globalThis.requestAnimationFrame).toHaveBeenCalledTimes(2); // Should continue loop
    consoleSpy.mockRestore();
  });

  it('should cleanup by canceling animation frame on unmount', () => {
    const { unmount } = setupHook();

    act(() => {
      unmount();
    });

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });

  it('should cleanup when isActive changes to false', () => {
    const { rerender } = setupHook(renderCallback, true);

    expect(globalThis.requestAnimationFrame).toHaveBeenCalled();

    act(() => {
      rerender({ cb: renderCallback, active: false });
    });

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });

  it('should restart loop when isActive changes from false to true', () => {
    const { rerender } = setupHook(renderCallback, false);

    expect(globalThis.requestAnimationFrame).not.toHaveBeenCalled();

    act(() => {
      rerender({ cb: renderCallback, active: true });
    });

    expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
  });

  it('should restart loop when renderCallback changes', () => {
    const newCallback = vi.fn();
    const { rerender } = setupHook(renderCallback);

    const initialCallCount = globalThis.requestAnimationFrame.mock.calls.length;

    act(() => {
      rerender({ cb: newCallback, active: true });
    });

    // Should have cleaned up old loop and started new one
    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    expect(globalThis.requestAnimationFrame.mock.calls.length).toBeGreaterThan(initialCallCount);
  });

  it('should use default isActive value of true', () => {
    renderHook(() => useRenderLoop(renderCallback));

    expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
  });

  it('should handle multiple rapid isActive changes', () => {
    const { rerender } = setupHook(renderCallback, true);

    const initialCancelCount = cancelAnimationFrameSpy.mock.calls.length;

    act(() => {
      rerender({ cb: renderCallback, active: false });
    });

    act(() => {
      rerender({ cb: renderCallback, active: true });
    });

    act(() => {
      rerender({ cb: renderCallback, active: false });
    });

    // Should have canceled at least once (when going to false)
    expect(cancelAnimationFrameSpy.mock.calls.length).toBeGreaterThan(initialCancelCount);
  });

  it('should not cancel if rafRef is null', () => {
    cancelAnimationFrameSpy.mockClear();
    const { unmount } = setupHook(renderCallback, false);

    // Should not have started loop, so rafRef should be null
    act(() => {
      unmount();
    });

    // cancelAnimationFrame should not be called if rafRef is null
    expect(cancelAnimationFrameSpy).not.toHaveBeenCalled();
  });
});

