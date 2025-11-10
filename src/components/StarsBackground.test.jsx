import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act } from '../test-utils/test-utils';
import { StarsBackground } from './StarsBackground';

// Mock cn utility
vi.mock('../utils/cn', () => ({
  cn: (...classes) => classes.filter(Boolean).join(' '),
}));

/* global global */
describe('StarsBackground', () => {
  let mockResizeObserver;
  let cancelAnimationFrameSpy;

  beforeEach(() => {
    vi.useFakeTimers();

    // Mock ResizeObserver
    mockResizeObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    };

    global.ResizeObserver = vi.fn(() => mockResizeObserver);

    // Mock requestAnimationFrame
    global.requestAnimationFrame = vi.fn((cb) => {
      setTimeout(cb, 0);
      return 1;
    });

    cancelAnimationFrameSpy = vi.spyOn(global, 'cancelAnimationFrame').mockImplementation(() => {});

    // Mock Date.now for twinkling
    vi.spyOn(Date, 'now').mockReturnValue(1000000);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('should render canvas element', () => {
    const { container } = render(<StarsBackground />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should render canvas with correct default classes', () => {
    const { container } = render(<StarsBackground />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('h-full', 'w-full', 'absolute', 'inset-0');
  });

  it('should apply custom className when provided', () => {
    const { container } = render(<StarsBackground className="custom-class" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('custom-class');
  });

  it('should create ResizeObserver on mount', () => {
    render(<StarsBackground />);
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(global.ResizeObserver).toHaveBeenCalled();
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(<StarsBackground />);
    
    act(() => {
      vi.advanceTimersByTime(0);
    });

    act(() => {
      unmount();
    });

    expect(mockResizeObserver.disconnect).toHaveBeenCalled();
    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });
});
