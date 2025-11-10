import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

// Helper function to set up hook with element attached
const setupHookWithElement = (options = {}) => {
  const element = document.createElement('div');
  document.body.appendChild(element);
  
  const { result, rerender, unmount } = renderHook(
    ({ opts }) => useIntersectionObserver(opts),
    { initialProps: { opts: {} } }
  );
  
  act(() => {
    result.current.elementRef.current = element;
    rerender({ opts: { rootMargin: '100px', ...options } });
  });
  
  return { result, element, rerender, unmount };
};

describe('useIntersectionObserver', () => {
  let mockObserver;
  let observeSpy;
  let disconnectSpy;
  let IntersectionObserverConstructor;

  beforeEach(() => {
    // Create a mock observer instance
    mockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      callback: null,
    };

    // Mock IntersectionObserver constructor
    IntersectionObserverConstructor = vi.fn((callback, options) => {
      mockObserver.callback = callback;
      mockObserver.options = options;
      return mockObserver;
    });

    // eslint-disable-next-line no-undef
    global.IntersectionObserver = IntersectionObserverConstructor;
    observeSpy = vi.spyOn(mockObserver, 'observe');
    disconnectSpy = vi.spyOn(mockObserver, 'disconnect');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return elementRef, isIntersecting, and hasIntersected', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.elementRef).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.hasIntersected).toBe(false);
  });

  it('should create IntersectionObserver with default rootMargin', async () => {
    setupHookWithElement();

    await waitFor(() => {
      expect(IntersectionObserverConstructor).toHaveBeenCalledWith(
        expect.any(Function),
        { rootMargin: '100px' }
      );
    });
  });

  it('should accept custom options', async () => {
    setupHookWithElement({ rootMargin: '200px', threshold: 0.5 });

    await waitFor(() => {
      expect(IntersectionObserverConstructor).toHaveBeenCalledWith(
        expect.any(Function),
        { rootMargin: '200px', threshold: 0.5 }
      );
    });
  });

  it('should observe element when ref is attached', async () => {
    const { element } = setupHookWithElement();

    // Wait for useEffect to run
    await waitFor(() => {
      expect(observeSpy).toHaveBeenCalledWith(element);
    });
  });

  it('should update isIntersecting when element intersects', async () => {
    const { result, element } = setupHookWithElement();

    await waitFor(() => {
      expect(observeSpy).toHaveBeenCalled();
    });

    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
      target: element,
    };

    act(() => {
      mockObserver.callback([mockEntry]);
    });

    await waitFor(() => {
      expect(result.current.isIntersecting).toBe(true);
    });
  });

  it('should update hasIntersected when element first intersects', async () => {
    const { result, element } = setupHookWithElement();

    await waitFor(() => {
      expect(observeSpy).toHaveBeenCalled();
    });

    // Simulate first intersection
    const mockEntry = {
      isIntersecting: true,
      target: element,
    };

    act(() => {
      mockObserver.callback([mockEntry]);
    });

    await waitFor(() => {
      expect(result.current.hasIntersected).toBe(true);
      expect(result.current.isIntersecting).toBe(true);
    });
  });

  it('should not update hasIntersected on subsequent intersections', async () => {
    const { result, element } = setupHookWithElement();

    await waitFor(() => {
      expect(observeSpy).toHaveBeenCalled();
    });

    // First intersection
    act(() => {
      mockObserver.callback([{
        isIntersecting: true,
        target: element,
      }]);
    });

    await waitFor(() => {
      expect(result.current.hasIntersected).toBe(true);
    });

    // Second intersection (leaving viewport)
    act(() => {
      mockObserver.callback([{
        isIntersecting: false,
        target: element,
      }]);
    });

    await waitFor(() => {
      expect(result.current.isIntersecting).toBe(false);
      expect(result.current.hasIntersected).toBe(true); // Should remain true
    });
  });

  it('should disconnect observer on unmount', async () => {
    const { unmount } = setupHookWithElement();

    await waitFor(() => {
      expect(observeSpy).toHaveBeenCalled();
    });

    act(() => {
      unmount();
    });

    await waitFor(() => {
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  it('should not observe if element ref is null', () => {
    renderHook(() => useIntersectionObserver());

    // Should not call observe if ref is null
    expect(observeSpy).not.toHaveBeenCalled();
  });
});

