import { describe, it, expect } from 'vitest';
import { formatCount } from './formatCount.js';

describe('formatCount', () => {
  it('formats sub-thousand numbers without suffix', () => {
    expect(formatCount(0)).toBe('0');
    expect(formatCount(7)).toBe('7');
    expect(formatCount(413)).toBe('413');
  });

  it('formats low thousands with 1 decimal k (rounded up)', () => {
    expect(formatCount(1000)).toBe('1.0k');
    expect(formatCount(1001)).toBe('1.1k');
    expect(formatCount(1499)).toBe('1.5k');
    expect(formatCount(1999)).toBe('2.0k');
    expect(formatCount(8270)).toBe('8.3k');
    expect(formatCount(9999)).toBe('10.0k');
  });

  it('formats 10k-999,999 as integer k (rounded up)', () => {
    expect(formatCount(10000)).toBe('10k');
    expect(formatCount(12001)).toBe('13k');
    expect(formatCount(999999)).toBe('1000k');
  });

  it('formats low millions with 1 decimal m (rounded up)', () => {
    expect(formatCount(1000000)).toBe('1.0m');
    expect(formatCount(1100000)).toBe('1.1m');
    expect(formatCount(1499999)).toBe('1.5m');
    expect(formatCount(1999999)).toBe('2.0m');
  });

  it('formats 10m+ as integer m (rounded up)', () => {
    expect(formatCount(10000000)).toBe('10m');
    expect(formatCount(12300001)).toBe('13m');
  });

  it('handles negatives by preserving sign', () => {
    expect(formatCount(-8270)).toBe('-8.3k');
    expect(formatCount(-413)).toBe('-413');
  });

  it('handles null/NaN gracefully', () => {
    expect(formatCount(null)).toBe('0');
    expect(formatCount(NaN)).toBe('0');
  });
});

