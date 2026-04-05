import { ShootingStar } from '../types';

export interface StarStartPoint {
  x: number;
  y: number;
  angle: number;
}

/**
 * Get a random starting point on one of the four screen edges
 * @returns Starting position and angle
 */
export const getRandomStartPoint = (): StarStartPoint => {
  const side = Math.floor(Math.random() * 4);
  const offset = Math.random() * window.innerWidth;

  switch (side) {
    case 0:
      return { x: offset, y: 0, angle: 45 };
    case 1:
      return { x: window.innerWidth, y: offset, angle: 135 };
    case 2:
      return { x: offset, y: window.innerHeight, angle: 225 };
    case 3:
      return { x: 0, y: offset, angle: 315 };
    default:
      return { x: 0, y: 0, angle: 45 };
  }
};

/**
 * Calculate the next position of a shooting star
 * @param star - Current star object
 * @returns New star object or null if out of bounds
 */
export const calculateStarMovement = (star: ShootingStar | null): ShootingStar | null => {
  if (!star) return null;

  const angleInRadians = (star.angle * Math.PI) / 180;
  const newX = star.x + star.speed * Math.cos(angleInRadians);
  const newY = star.y + star.speed * Math.sin(angleInRadians);
  const newDistance = star.distance + star.speed;
  const newScale = 1 + newDistance / 100;

  // Check if star is out of bounds
  if (
    newX < -20 ||
    newX > window.innerWidth + 20 ||
    newY < -20 ||
    newY > window.innerHeight + 20
  ) {
    return null;
  }

  return {
    ...star,
    x: newX,
    y: newY,
    distance: newDistance,
    scale: newScale,
  };
};

/**
 * Generate a random delay between min and max
 * @param minDelay - Minimum delay in milliseconds
 * @param maxDelay - Maximum delay in milliseconds
 * @returns Random delay value
 */
export const getRandomDelay = (minDelay: number, maxDelay: number): number => {
  return Math.random() * (maxDelay - minDelay) + minDelay;
};

/**
 * Generate a random speed between min and max
 * @param minSpeed - Minimum speed
 * @param maxSpeed - Maximum speed
 * @returns Random speed value
 */
export const getRandomSpeed = (minSpeed: number, maxSpeed: number): number => {
  return Math.random() * (maxSpeed - minSpeed) + minSpeed;
};
