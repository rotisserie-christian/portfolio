import { useEffect, useRef } from 'react';
import { calculateStarMovement } from '../utils/shootingStarMath';
import { ShootingStar } from '../types/types';

/**
 * Hook for animating shooting star movement
 * @param star - Current star object (can be null)
 * @param onStarUpdate - Callback when star position updates (receives updated star or null if done)
 * @param fps - Frames per second for animation (default: 30)
 * @param paused - Whether to pause the interval
 * @returns {void}
 */
export const useShootingStarMovement = (
  star: ShootingStar | null,
  onStarUpdate: (star: ShootingStar | null) => void,
  fps: number = 30,
  paused: boolean = false
): void => {
  const starRef = useRef<ShootingStar | null>(star);
  const onStarUpdateRef = useRef<(star: ShootingStar | null) => void>(onStarUpdate);

  // Keep refs in sync to avoid capturing old props in the interval closure
  useEffect(() => {
    starRef.current = star;
  }, [star]);

  useEffect(() => {
    onStarUpdateRef.current = onStarUpdate;
  }, [onStarUpdate]);

  useEffect(() => {
    if (!star || paused) return;

    const moveStar = () => {
      const currentStar = starRef.current;
      if (!currentStar) return;

      // Note: calculateStarMovement returns a state-synced object or null if out of bounds
      const updatedStar = calculateStarMovement(currentStar) as ShootingStar | null;
      onStarUpdateRef.current(updatedStar);
    };

    const intervalMs = 1000 / fps; // Convert fps to milliseconds
    const intervalId = setInterval(moveStar, intervalMs);

    return () => clearInterval(intervalId);
  }, [star, fps, paused]);
};
