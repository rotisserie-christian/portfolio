import { useEffect, useRef } from 'react';
import { calculateStarMovement } from '../utils/shootingStarMath';

/**
 * Hook for animating shooting star movement
 * @param {Object} star - Current star object (can be null)
 * @param {Function} onStarUpdate - Callback when star position updates
 * @param {number} fps - Frames per second for animation (default: 30)
 * @returns {void}
 */
export const useShootingStarMovement = (star, onStarUpdate, fps = 30) => {
  const starRef = useRef(star);
  const onStarUpdateRef = useRef(onStarUpdate);

  // Keep refs in sync
  useEffect(() => {
    starRef.current = star;
  }, [star]);

  useEffect(() => {
    onStarUpdateRef.current = onStarUpdate;
  }, [onStarUpdate]);

  useEffect(() => {
    if (!star) return;

    const moveStar = () => {
      const currentStar = starRef.current;
      if (!currentStar) return;
      
      const updatedStar = calculateStarMovement(currentStar);
      onStarUpdateRef.current(updatedStar);
    };

    const intervalMs = 1000 / fps; // Convert fps to milliseconds
    const intervalId = setInterval(moveStar, intervalMs);
    
    return () => clearInterval(intervalId);
  }, [star, fps]); // Only re-run when star changes or fps changes
};

