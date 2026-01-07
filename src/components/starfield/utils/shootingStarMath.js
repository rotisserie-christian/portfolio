/**
 * Get a random starting point on one of the four screen edges
 * @returns {Object} {x, y, angle} - Starting position and angle
 */
export const getRandomStartPoint = () => {
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
 * @param {Object} star - Current star object
 * @returns {Object|null} New star object or null if out of bounds
 */
export const calculateStarMovement = (star) => {
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
 * @param {number} minDelay - Minimum delay in milliseconds
 * @param {number} maxDelay - Maximum delay in milliseconds
 * @returns {number} Random delay value
 */
export const getRandomDelay = (minDelay, maxDelay) => {
  return Math.random() * (maxDelay - minDelay) + minDelay;
};

/**
 * Generate a random speed between min and max
 * @param {number} minSpeed - Minimum speed
 * @param {number} maxSpeed - Maximum speed
 * @returns {number} Random speed value
 */
export const getRandomSpeed = (minSpeed, maxSpeed) => {
  return Math.random() * (maxSpeed - minSpeed) + minSpeed;
};

