import { cn } from "../../utils/cn";
import { useState, useEffect, useRef, useCallback } from "react";
import { useStarGeneration } from "./hooks/useStarGeneration";
import { useCanvasResize } from "./hooks/useCanvasResize";
import { useStarfieldAnimation } from "./hooks/useStarfieldAnimation";
import { StarBackgroundPropTypes, StarBackgroundDefaultProps } from "./utils/starTypes";

export const StarsBackground = ({
  starDensity = 0.002,
  allStarsTwinkle = true,
  twinkleProbability = 0.9,
  minTwinkleSpeed = 1,
  maxTwinkleSpeed = 2,
  exclusionSize = 320,
  gravityStrength = 0.2,
  swirlStrength = 0.2,
  gravityRadiusFactor = 0.9,
  innerGravityRadiusFactor = 0.1,
  trailLength = 6,
  swirlRotationSpeed = 0.00007,
  minTrailStrength = 0.7,
  className,
}) => {
  const [stars, setStars] = useState([]);
  const canvasRef = useRef(null);
  const starsRef = useRef([]);

  // Generate stars hook
  const { generateStars } = useStarGeneration({
    starDensity,
    allStarsTwinkle,
    twinkleProbability,
    minTwinkleSpeed,
    maxTwinkleSpeed,
    exclusionSize,
  });

  // Handle canvas resize and star regeneration
  const handleResize = useCallback((width, height) => {
    const newStars = generateStars(width, height);
    setStars(newStars);
    starsRef.current = newStars;
  }, [generateStars]);

  useCanvasResize(canvasRef, handleResize);

  // Keep ref in sync with stars state
  useEffect(() => {
    starsRef.current = stars;
  }, [stars]);

  // Animation loop
  useStarfieldAnimation(canvasRef, starsRef, {
    gravityStrength,
    swirlStrength,
    gravityRadiusFactor,
    innerGravityRadiusFactor,
    trailLength,
    swirlRotationSpeed,
    minTrailStrength,
  });

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full absolute inset-0", className)}
    />
  );
};

StarsBackground.propTypes = StarBackgroundPropTypes;
StarsBackground.defaultProps = StarBackgroundDefaultProps;