import { useCallback } from 'react';
import { Star, StarGenerationConfig, StarGenerationHook } from '../types/types';

/**
 * Hook for generating and initializing a field of stars
 * @param config - Star generation configuration parameters
 * @returns An object containing the generateStars function
 */
export const useStarGeneration = ({
  starDensity,
  allStarsTwinkle,
  twinkleProbability,
  minTwinkleSpeed,
  maxTwinkleSpeed,
  exclusionSize,
}: StarGenerationConfig): StarGenerationHook => {

  const generateStars = useCallback(
    (width: number, height: number): Star[] => {
      const area = width * height;
      const numStars = Math.floor(area * starDensity);
      const centerX = width / 2;
      const centerY = height / 2;
      const exclusionRadius = exclusionSize / 2;

      const getDistance = (x: number, y: number): number =>
        Math.hypot(x - centerX, y - centerY);

      return Array.from({ length: numStars }, (): Star => {
        let x: number, y: number, dist: number;
        do {
          x = Math.random() * width;
          y = Math.random() * height;
          dist = getDistance(x, y);
        } while (dist < exclusionRadius);

        const fadeDist = exclusionRadius * 1.5;
        const dFactor = Math.min(
          (dist - exclusionRadius) / (fadeDist - exclusionRadius),
          1
        );
        const baseOpacity = Math.random() * 0.5 + 0.5;
        const adjustedOpacity = baseOpacity * dFactor;
        const shouldTwinkle = allStarsTwinkle || Math.random() < twinkleProbability;

        return {
          x,
          y,
          radius: Math.random() * 0.05 + 0.5,
          opacity: adjustedOpacity,
          twinkleSpeed: shouldTwinkle
            ? minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
            : null,
          trail: [], // Initialize empty trail array
        };
      });
    },
    [
      starDensity,
      allStarsTwinkle,
      twinkleProbability,
      minTwinkleSpeed,
      maxTwinkleSpeed,
      exclusionSize,
    ]
  );

  return { generateStars };
};
