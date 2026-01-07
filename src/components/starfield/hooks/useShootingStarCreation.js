import { useEffect } from 'react';
import { getRandomStartPoint, getRandomSpeed, getRandomDelay } from '../utils/shootingStarMath';

/**
 * Hook for creating and scheduling shooting stars
 * @param {Function} onCreateStar - Callback when a new star should be created
 * @param {Object} config - Configuration object
 * @returns {void}
 */
export const useShootingStarCreation = (onCreateStar, config) => {
  const { minSpeed, maxSpeed, minDelay, maxDelay } = config;

  useEffect(() => {
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
      setTimeout(createStar, randomDelay);
    };

    createStar();
    
    // Cleanup is handled by the timeout, but we return empty function for consistency
    return () => {};
  }, [onCreateStar, minSpeed, maxSpeed, minDelay, maxDelay]);
};

