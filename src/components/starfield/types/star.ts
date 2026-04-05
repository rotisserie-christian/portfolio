export interface StarGenerationConfig {
  starDensity: number;
  allStarsTwinkle: boolean;
  twinkleProbability: number;
  minTwinkleSpeed: number;
  maxTwinkleSpeed: number;
  exclusionSize: number;
}

export interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number | null;
  trail: { x: number; y: number }[];
}

export interface StarGenerationHook {
  generateStars: (width: number, height: number) => Star[];
}
