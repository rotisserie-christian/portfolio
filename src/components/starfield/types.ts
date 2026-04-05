/**
 * Configuration for star generation and behavior
 */
export interface StarGenerationConfig {
  starDensity: number;
  allStarsTwinkle: boolean;
  twinkleProbability: number;
  minTwinkleSpeed: number;
  maxTwinkleSpeed: number;
  exclusionSize: number;
}

/**
 * Representation of a single star in the field
 */
export interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number | null;
  trail: { x: number; y: number }[];
}

/**
 * Return type for the useStarGeneration hook
 */
export interface StarGenerationHook {
  generateStars: (width: number, height: number) => Star[];
}

/**
 * Representation of a single shooting star
 */
export interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

/**
 * Configuration for shooting star timing and physics
 */
export interface ShootingStarConfig {
  minSpeed: number;
  maxSpeed: number;
  minDelay: number;
  maxDelay: number;
}
