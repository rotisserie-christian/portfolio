import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('should merge multiple string classes', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('should handle conditional classes with objects', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('should handle conditional classes with mixed inputs', () => {
    expect(cn('foo', { bar: true, baz: false }, 'qux')).toBe('foo bar qux');
  });

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar', 'baz'])).toBe('foo bar baz');
  });

  it('should handle nested arrays', () => {
    expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz');
  });

  it('should handle null, undefined, and false values', () => {
    expect(cn('foo', null, undefined, false, 'bar')).toBe('foo bar');
  });

  it('should handle empty strings', () => {
    expect(cn('foo', '', 'bar')).toBe('foo bar');
  });

  it('should handle no arguments', () => {
    expect(cn()).toBe('');
  });

  it('should deduplicate conflicting Tailwind classes', () => {
    // tailwind-merge should resolve conflicts, keeping the last one
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should preserve non-conflicting Tailwind classes', () => {
    expect(cn('p-4', 'm-8', 'text-red-500')).toBe('p-4 m-8 text-red-500');
  });

  it('should handle responsive variants correctly', () => {
    expect(cn('p-4', 'md:p-8')).toBe('p-4 md:p-8');
  });

  it('should handle complex mixed inputs', () => {
    expect(cn(
      'base-class',
      { 'conditional-true': true, 'conditional-false': false },
      ['array-class-1', 'array-class-2'],
      null,
      undefined,
      false,
      'final-class'
    )).toBe('base-class conditional-true array-class-1 array-class-2 final-class');
  });

  it('should handle Tailwind class conflicts in complex scenarios', () => {
    expect(cn('p-4 m-2', 'p-8', 'm-4')).toBe('p-8 m-4');
  });
});

