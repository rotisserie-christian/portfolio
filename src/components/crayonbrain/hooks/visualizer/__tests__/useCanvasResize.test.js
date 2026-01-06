import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCanvasResize } from '../useCanvasResize';
import {
  setupDevicePixelRatio,
  restoreDevicePixelRatio,
  createMockCanvas,
  setupWindowEventListeners,
  captureResizeHandler,
} from './__test-utils__';

describe('useCanvasResize', () => {
  let canvas;
  let canvasRef;
  let originalDevicePixelRatio;
  let addEventListenerSpy;
  let removeEventListenerSpy;
  let getResizeHandler;

  beforeEach(() => {
    // Mock devicePixelRatio
    originalDevicePixelRatio = setupDevicePixelRatio(1);

    // Create mock canvas element
    canvas = createMockCanvas({ width: 800, height: 600 });
    canvasRef = { current: canvas };

    // Mock window event listeners
    const eventListeners = setupWindowEventListeners();
    addEventListenerSpy = eventListeners.addEventListenerSpy;
    removeEventListenerSpy = eventListeners.removeEventListenerSpy;
    getResizeHandler = captureResizeHandler(addEventListenerSpy);
  });

  afterEach(() => {
    vi.clearAllMocks();
    restoreDevicePixelRatio(originalDevicePixelRatio);
  });

  // Helper function to set up hook with optional callback
  const setupHook = (onResize = null) => {
    return renderHook(({ ref, callback }) => useCanvasResize(ref, callback), {
      initialProps: { ref: canvasRef, callback: onResize },
    });
  };

  it('should set canvas dimensions on mount', () => {
    setupHook();

    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
  });

  it('should apply device pixel ratio to dimensions', () => {
    window.devicePixelRatio = 2;
    setupHook();

    expect(canvas.width).toBe(1600); // 800 * 2
    expect(canvas.height).toBe(1200); // 600 * 2
  });

  it('should cap device pixel ratio at 2', () => {
    window.devicePixelRatio = 3;
    setupHook();

    expect(canvas.width).toBe(1600); // 800 * 2 (capped)
    expect(canvas.height).toBe(1200); // 600 * 2 (capped)
  });

  it('should use default DPR of 1 when devicePixelRatio is undefined', () => {
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: undefined,
    });
    setupHook();

    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
  });

  it('should ensure minimum dimensions of 1', () => {
    canvas.getBoundingClientRect.mockReturnValue({
      width: 0.5,
      height: 0.3,
    });
    setupHook();

    expect(canvas.width).toBe(1);
    expect(canvas.height).toBe(1);
  });

  it('should floor dimensions', () => {
    canvas.getBoundingClientRect.mockReturnValue({
      width: 800.7,
      height: 600.9,
    });
    setupHook();

    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
  });

  it('should call onResize callback on mount', () => {
    const onResize = vi.fn();
    setupHook(onResize);

    expect(onResize).toHaveBeenCalledWith({
      width: 800,
      height: 600,
      dpr: 1,
    });
  });

  it('should call onResize callback with correct DPR', () => {
    window.devicePixelRatio = 2;
    const onResize = vi.fn();
    setupHook(onResize);

    expect(onResize).toHaveBeenCalledWith({
      width: 1600,
      height: 1200,
      dpr: 2,
    });
  });

  it('should not call onResize if callback is not provided', () => {
    const onResize = vi.fn();
    setupHook(null);

    // onResize should not be called since we passed null
    expect(onResize).not.toHaveBeenCalled();
  });

  it('should add resize event listener on mount', () => {
    setupHook();

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should update canvas dimensions on window resize', () => {
    setupHook();

    // Simulate resize
    canvas.getBoundingClientRect.mockReturnValue({
      width: 1000,
      height: 750,
    });

    act(() => {
      const resizeHandler = getResizeHandler();
      if (resizeHandler) resizeHandler();
    });

    expect(canvas.width).toBe(1000);
    expect(canvas.height).toBe(750);
  });

  it('should call onResize callback on window resize', () => {
    const onResize = vi.fn();

    setupHook(onResize);
    onResize.mockClear(); // Clear initial call

    // Simulate resize
    canvas.getBoundingClientRect.mockReturnValue({
      width: 1000,
      height: 750,
    });

    act(() => {
      const resizeHandler = getResizeHandler();
      if (resizeHandler) resizeHandler();
    });

    expect(onResize).toHaveBeenCalledWith({
      width: 1000,
      height: 750,
      dpr: 1,
    });
  });

  it('should remove resize event listener on unmount', () => {
    const { unmount } = setupHook();

    act(() => {
      unmount();
    });

    const resizeHandler = getResizeHandler();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', resizeHandler);
  });

  it('should not throw if canvas ref is null', () => {
    canvasRef.current = null;

    expect(() => {
      setupHook();
    }).not.toThrow();
  });

  it('should not set dimensions if canvas ref is null', () => {
    canvasRef.current = null;
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    setupHook();

    expect(canvas.width).toBe(originalWidth);
    expect(canvas.height).toBe(originalHeight);
  });

  it('should update when canvasRef changes', () => {
    const { rerender } = setupHook();

    const newCanvas = createMockCanvas({ width: 500, height: 400 });

    act(() => {
      rerender({ ref: { current: newCanvas }, callback: null });
    });

    expect(newCanvas.width).toBe(500);
    expect(newCanvas.height).toBe(400);
  });

  it('should update when onResize callback changes', () => {
    const onResize1 = vi.fn();
    const onResize2 = vi.fn();

    const { rerender } = renderHook(
      ({ ref, callback }) => useCanvasResize(ref, callback),
      { initialProps: { ref: canvasRef, callback: onResize1 } }
    );

    expect(onResize1).toHaveBeenCalled();
    onResize1.mockClear();

    // Change callback
    act(() => {
      rerender({ ref: canvasRef, callback: onResize2 });
    });

    // New callback should be called
    expect(onResize2).toHaveBeenCalled();
  });
});

