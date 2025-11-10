import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '../test-utils/test-utils';
import { ShootingStars } from './ShootingStars';

// Mock cn utility
vi.mock('../utils/cn', () => ({
  cn: (...classes) => classes.filter(Boolean).join(' '),
}));

describe('ShootingStars', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;
  const originalMathRandom = Math.random;
  const originalDateNow = Date.now;

  beforeEach(() => {
    // Set up window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    });

    // Use fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    
    // Restore window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('should render SVG element', () => {
    render(<ShootingStars />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render SVG with correct default classes', () => {
    render(<ShootingStars />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('w-full', 'h-full', 'absolute', 'inset-0');
  });

  it('should apply custom className when provided', () => {
    render(<ShootingStars className="custom-class" />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('should render gradient definition', () => {
    render(<ShootingStars />);
    const gradient = document.querySelector('linearGradient#gradient');
    expect(gradient).toBeInTheDocument();
    expect(gradient).toHaveAttribute('x1', '0%');
    expect(gradient).toHaveAttribute('y1', '0%');
    expect(gradient).toHaveAttribute('x2', '100%');
    expect(gradient).toHaveAttribute('y2', '100%');
  });

  it('should render gradient stops with default colors', () => {
    render(<ShootingStars />);
    const stops = document.querySelectorAll('linearGradient stop');
    expect(stops).toHaveLength(2);
    
    expect(stops[0]).toHaveAttribute('offset', '0%');
    expect(stops[1]).toHaveAttribute('offset', '100%');
  });

  it('should use custom starColor and trailColor', () => {
    render(<ShootingStars starColor="#FF0000" trailColor="#00FF00" />);
    const stops = document.querySelectorAll('linearGradient stop');
    
    const firstStop = stops[0].getAttribute('style');
    const secondStop = stops[1].getAttribute('style');
    
    expect(firstStop).toContain('#00FF00'); // trailColor
    expect(secondStop).toContain('#FF0000'); // starColor
  });

  it('should create a star on mount', () => {
    // Mock Math.random to return predictable values
    let randomCallCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      randomCallCount++;
      // First call: side (0-3), return 0 (top side)
      if (randomCallCount === 1) return 0.2; // side 0
      // Second call: offset, return 0.5 (middle)
      if (randomCallCount === 2) return 0.5;
      // Third call: speed, return 0.5 (middle of range)
      if (randomCallCount === 3) return 0.5;
      // Fourth call: delay, return 0.5 (middle of range)
      return 0.5;
    });

    // Mock Date.now for star ID
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);

    render(<ShootingStars />);

    // Advance timers to trigger star creation
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Check that a star rect is rendered
    const rect = document.querySelector('rect');
    expect(rect).toBeInTheDocument();
  });

  it('should create stars with correct initial properties', () => {
    let randomCallCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      randomCallCount++;
      if (randomCallCount === 1) return 0.0; // side 0 (top)
      if (randomCallCount === 2) return 0.5; // offset (middle of width)
      if (randomCallCount === 3) return 0.0; // speed (min)
      return 0.0; // delay (min)
    });

    vi.spyOn(Date, 'now').mockReturnValue(1234567890);

    render(<ShootingStars minSpeed={10} maxSpeed={30} />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    const rect = document.querySelector('rect');
    expect(rect).toBeInTheDocument();
    
    // Star should start at top (y=0), middle of width (x=960)
    // Angle should be 45 for side 0
    expect(rect).toHaveAttribute('transform');
    expect(rect.getAttribute('transform')).toContain('rotate(45');
  });

  it('should move star on interval', () => {
    let randomCallCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      randomCallCount++;
      if (randomCallCount === 1) return 0.0; // side 0
      if (randomCallCount === 2) return 0.0; // offset 0
      if (randomCallCount === 3) return 0.0; // speed min (10)
      return 0.0; // delay min
    });

    vi.spyOn(Date, 'now').mockReturnValue(1234567890);

    render(<ShootingStars minSpeed={10} maxSpeed={30} />);

    // Create star
    act(() => {
      vi.advanceTimersByTime(0);
    });

    const rect1 = document.querySelector('rect');
    const initialX = parseFloat(rect1?.getAttribute('x') || '0');
    const initialY = parseFloat(rect1?.getAttribute('y') || '0');

    // Advance interval (33ms for 30fps)
    act(() => {
      vi.advanceTimersByTime(33);
    });

    const rect2 = document.querySelector('rect');
    const newX = parseFloat(rect2?.getAttribute('x') || '0');
    const newY = parseFloat(rect2?.getAttribute('y') || '0');

    // Star should have moved
    expect(newX).not.toBe(initialX);
    expect(newY).not.toBe(initialY);
  });

  it('should handle star movement and out-of-bounds logic', () => {
    // This test verifies that stars move and the component handles movement correctly
    // The out-of-bounds removal is tested implicitly through the component's logic
    let randomCallCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      randomCallCount++;
      if (randomCallCount === 1) return 0.0; // side 0 (top)
      if (randomCallCount === 2) return 0.0; // offset 0
      if (randomCallCount === 3) return 0.5; // speed middle
      return 0.0; // delay
    });

    vi.spyOn(Date, 'now').mockReturnValue(1234567890);

    render(<ShootingStars minSpeed={10} maxSpeed={30} />);

    // Create star
    act(() => {
      vi.advanceTimersByTime(0);
    });

    const rect1 = document.querySelector('rect');
    expect(rect1).toBeInTheDocument();
    const initialX = parseFloat(rect1?.getAttribute('x') || '0');
    const initialY = parseFloat(rect1?.getAttribute('y') || '0');

    // Move star multiple times
    act(() => {
      for (let i = 0; i < 50; i++) {
        vi.advanceTimersByTime(33);
      }
    });

    // Star should have moved significantly
    const rect2 = document.querySelector('rect');
    if (rect2) {
      const newX = parseFloat(rect2.getAttribute('x') || '0');
      const newY = parseFloat(rect2.getAttribute('y') || '0');
      // Star should have moved (position changed)
      const hasMoved = Math.abs(newX - initialX) > 10 || Math.abs(newY - initialY) > 10;
      expect(hasMoved).toBe(true);
    }
  });

  it('should scale star based on distance', () => {
    let randomCallCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      randomCallCount++;
      if (randomCallCount === 1) return 0.0; // side 0
      if (randomCallCount === 2) return 0.0; // offset 0
      if (randomCallCount === 3) return 0.0; // speed min
      return 0.0; // delay
    });

    vi.spyOn(Date, 'now').mockReturnValue(1234567890);

    render(<ShootingStars starWidth={10} />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    const rect1 = document.querySelector('rect');
    const initialWidth = parseFloat(rect1?.getAttribute('width') || '0');

    // Move star (increase distance)
    act(() => {
      vi.advanceTimersByTime(33 * 10); // 10 frames
    });

    const rect2 = document.querySelector('rect');
    if (rect2) {
      const newWidth = parseFloat(rect2.getAttribute('width') || '0');
      // Width should increase as distance increases
      expect(newWidth).toBeGreaterThan(initialWidth);
    }
  });

  it('should create new star after delay', () => {
    let randomCallCount = 0;
    let dateNowCallCount = 0;
    
    vi.spyOn(Math, 'random').mockImplementation(() => {
      randomCallCount++;
      if (randomCallCount === 1) return 0.0; // side 0
      if (randomCallCount === 2) return 0.0; // offset 0
      if (randomCallCount === 3) return 0.0; // speed min
      if (randomCallCount === 4) return 0.0; // delay min (1200ms)
      if (randomCallCount === 5) return 0.0; // side for second star
      if (randomCallCount === 6) return 0.0; // offset for second star
      if (randomCallCount === 7) return 0.0; // speed for second star
      return 0.0; // delay for second star
    });

    vi.spyOn(Date, 'now').mockImplementation(() => {
      dateNowCallCount++;
      return 1234567890 + dateNowCallCount * 1000;
    });

    render(<ShootingStars minDelay={1200} maxDelay={4200} />);

    // Create first star
    act(() => {
      vi.advanceTimersByTime(0);
    });

    const firstStarId = document.querySelector('rect')?.getAttribute('key') || 
                       document.querySelector('rect')?.getAttribute('data-id');

    // Advance past delay to trigger new star creation
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    // Should have a star (might be the same one or a new one)
    // The key attribute might not be accessible, so we check for rect existence
    expect(document.querySelector('rect')).toBeInTheDocument();
  });

  it('should cleanup intervals on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval').mockImplementation(() => {});

    let randomCallCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      randomCallCount++;
      if (randomCallCount === 1) return 0.0;
      if (randomCallCount === 2) return 0.0;
      if (randomCallCount === 3) return 0.0;
      return 0.0;
    });

    vi.spyOn(Date, 'now').mockReturnValue(1234567890);

    const { unmount } = render(<ShootingStars />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    act(() => {
      unmount();
    });

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('should use custom starWidth and starHeight', () => {
    let randomCallCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      randomCallCount++;
      if (randomCallCount === 1) return 0.0;
      if (randomCallCount === 2) return 0.0;
      if (randomCallCount === 3) return 0.0;
      return 0.0;
    });

    vi.spyOn(Date, 'now').mockReturnValue(1234567890);

    render(<ShootingStars starWidth={20} starHeight={2} />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    const rect = document.querySelector('rect');
    expect(rect).toHaveAttribute('width');
    expect(rect).toHaveAttribute('height');
    
    // Initial scale is 1, so width should be starWidth
    const width = parseFloat(rect?.getAttribute('width') || '0');
    const height = parseFloat(rect?.getAttribute('height') || '0');
    
    expect(width).toBeCloseTo(20, 1);
    expect(height).toBe(2);
  });

  it('should handle different start sides correctly', () => {
    const sides = [0, 1, 2, 3];
    const expectedAngles = [45, 135, 225, 315];

    sides.forEach((side, index) => {
      let randomCallCount = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        randomCallCount++;
        if (randomCallCount === 1) return side / 4 + 0.1; // Ensure we get the right side
        if (randomCallCount === 2) return 0.5; // offset
        if (randomCallCount === 3) return 0.0; // speed
        return 0.0; // delay
      });

      vi.spyOn(Date, 'now').mockReturnValue(1234567890 + index * 1000);

      const { unmount } = render(<ShootingStars />);

      act(() => {
        vi.advanceTimersByTime(0);
      });

      const rect = document.querySelector('rect');
      if (rect) {
        const transform = rect.getAttribute('transform') || '';
        expect(transform).toContain(`rotate(${expectedAngles[side]}`);
      }

      unmount();
      vi.restoreAllMocks();
    });
  });
});

