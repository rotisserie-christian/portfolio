import { ShootingStar } from '../types/types';

interface StarRectProps {
  key: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  transform: string;
}

/**
 * Get props for shooting star rect element
 * @param star - Star object with position and scale
 * @param starWidth - Base width of the star
 * @param starHeight - Height of the star
 * @returns Props for the star rect or null if no star
 */
export const getStarRectProps = (
  star: ShootingStar | null, 
  starWidth: number, 
  starHeight: number
): StarRectProps | null => {
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
