import { StarGenerationConfig } from './star';
import { AnimationConfig } from './animation';
import { ShootingStarConfig } from './shootingStar';

export interface StarBackgroundProps extends StarGenerationConfig, AnimationConfig {
  className?: string;
}

export const StarBackgroundDefaultProps: Partial<StarBackgroundProps> = {
  starDensity: 0.00015,
  allStarsTwinkle: true,
  twinkleProbability: 0.7,
  minTwinkleSpeed: 0.5,
  maxTwinkleSpeed: 1,
  exclusionSize: 250,
  gravityStrength: 0.3,
  swirlStrength: 0.5,
  gravityRadiusFactor: 0.6,
  innerGravityRadiusFactor: 0.3,
  trailLength: 8,
  swirlRotationSpeed: 0.0001,
  minTrailStrength: 0.2,
  className: "",
};

export interface ShootingStarsProps extends ShootingStarConfig {
  className?: string;
}

export const ShootingStarsDefaultProps: Partial<ShootingStarsProps> = {
  minSpeed: 10,
  maxSpeed: 30,
  minDelay: 1200,
  maxDelay: 4200,
  starColor: "#9E00FF",
  trailColor: "#2EB9DF",
  starWidth: 10,
  starHeight: 1,
  className: "",
};