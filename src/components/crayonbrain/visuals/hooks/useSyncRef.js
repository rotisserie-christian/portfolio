import { useRef } from 'react';

/**
 * Keep a ref in sync with a value on every render — for props read inside RAF
 * loops without re-subscribing the animation effect.
 */
export const useSyncRef = (value) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
