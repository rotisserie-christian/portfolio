import { cn } from "../../utils/cn";
import { useState, useCallback } from "react";
import { useShootingStarCreation } from "./hooks/useShootingStarCreation";
import { useShootingStarMovement } from "./hooks/useShootingStarMovement";
import { getStarRectProps } from "./utils/shootingStarRendering";
import { ShootingStarsPropTypes, ShootingStarsDefaultProps } from "./utils/starTypes";

export const ShootingStars = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starWidth = 10,
  starHeight = 1,
  className,
}) => {
  const [star, setStar] = useState(null);

  // Handle star creation
  const handleCreateStar = useCallback((newStar) => {
    setStar(newStar);
  }, []);

  // Handle star movement updates
  const handleStarUpdate = useCallback((updatedStar) => {
    setStar(updatedStar);
  }, []);

  // Create and schedule stars
  useShootingStarCreation(handleCreateStar, {
    minSpeed,
    maxSpeed,
    minDelay,
    maxDelay,
  });

  // Animate star movement
  useShootingStarMovement(star, handleStarUpdate, 30);

  const starProps = getStarRectProps(star, starWidth, starHeight);

  return (
    <svg
      className={cn("w-full h-full absolute inset-0", className)}
    >
      {starProps && <rect {...starProps} />}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
};

ShootingStars.propTypes = ShootingStarsPropTypes;
ShootingStars.defaultProps = ShootingStarsDefaultProps;
