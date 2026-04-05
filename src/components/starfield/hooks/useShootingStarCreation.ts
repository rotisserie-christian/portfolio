import { useEffect } from 'react';
import { getRandomStartPoint, getRandomSpeed, getRandomDelay } from '../utils/shootingStarMath';
import { ShootingStar, ShootingStarConfig } from '../types';

/**
 * Hook for creating and scheduling shooting stars
 * @param onCreateStar - Callback when a new star should be created
 * @param config - Configuration object (minSpeed, maxSpeed, minDelay, maxDelay)
 * @param paused - Whether to pause creation
 * @returns {void}
 */
export const useShootingStarCreation = (
  onCreateStar: (star: ShootingStar) => void,
  config: ShootingStarConfig,
  paused: boolean = false
): void => {
  const { minSpeed, maxSpeed, minDelay, maxDelay } = config;

  useEffect(() => {
    if (paused) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const createStar = () => {
      const { x, y, angle } = getRandomStartPoint() as { x: number, y: number, angle: number };
      const newStar: ShootingStar = {
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
