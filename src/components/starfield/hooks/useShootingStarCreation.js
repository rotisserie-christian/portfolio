import { useEffect } from 'react';
import { getRandomStartPoint, getRandomSpeed, getRandomDelay } from '../utils/shootingStarMath';

/**
 * Hook for creating and scheduling shooting stars
 * @param {Function} onCreateStar - Callback when a new star should be created
 * @param {Object} config - Configuration object
 * @returns {void}
 */
export const useShootingStarCreation = (onCreateStar, config, paused = false) => {
  const { minSpeed, maxSpeed, minDelay, maxDelay } = config;

  useEffect(() => {
    if (paused) return;

    let timeoutId;

    const createStar = () => {
      const { x, y, angle } = getRandomStartPoint();
      const newStar = {
        id: Date.now(),
        x,
        y,
        angle,
        scale: 1,
        speed: getRandomSpeed(minSpeed, maxSpeed),
        distance: 0,
      };
      
      onCreateStar(newStar);

      const randomDelay = getRandomDelay(minDelay, maxDelay);
      timeoutId = setTimeout(createStar, randomDelay);
    };

    createStar();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onCreateStar, minSpeed, maxSpeed, minDelay, maxDelay, paused]);
};

