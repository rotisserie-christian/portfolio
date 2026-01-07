/**
 * Get props for shooting star rect element
 * @param {Object} star - Star object with position and scale
 * @param {number} starWidth - Base width of the star
 * @param {number} starHeight - Height of the star
 * @returns {Object|null} Props for the star rect or null if no star
 */
export const getStarRectProps = (star, starWidth, starHeight) => {
  if (!star) return null;

  return {
    key: star.id,
    x: star.x,
    y: star.y,
    width: starWidth * star.scale,
    height: starHeight,
    fill: "url(#gradient)",
    transform: `rotate(${star.angle}, ${
      star.x + (starWidth * star.scale) / 2
    }, ${star.y + starHeight / 2})`,
  };
};

