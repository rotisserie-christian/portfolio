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

export interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

export interface ShootingStarConfig {
  minSpeed: number;
  maxSpeed: number;
  minDelay: number;
  maxDelay: number;
}

export interface AnimationConfig {
  gravityStrength: number;
  swirlStrength: number;
  gravityRadiusFactor: number;
  innerGravityRadiusFactor: number;
  trailLength: number;
  swirlRotationSpeed: number;
  minTrailStrength: number;
}
