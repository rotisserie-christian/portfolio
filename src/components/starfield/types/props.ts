import PropTypes from 'prop-types';
import { StarGenerationConfig } from './star';
import { AnimationConfig } from './animation';
import { ShootingStarConfig } from './shootingStar';

export interface StarBackgroundProps extends StarGenerationConfig, AnimationConfig {
  className?: string;
}

export const StarBackgroundPropTypes = {
  starDensity: PropTypes.number,
  allStarsTwinkle: PropTypes.bool,
  twinkleProbability: PropTypes.number,
  minTwinkleSpeed: PropTypes.number,
  maxTwinkleSpeed: PropTypes.number,
  exclusionSize: PropTypes.number,
  gravityStrength: PropTypes.number,
  swirlStrength: PropTypes.number,
  gravityRadiusFactor: PropTypes.number,
  innerGravityRadiusFactor: PropTypes.number,
  trailLength: PropTypes.number,
  swirlRotationSpeed: PropTypes.number,
  minTrailStrength: PropTypes.number,
  className: PropTypes.string,
};

/** Matches default parameter values in `StarsBackground.jsx`. */
export const StarBackgroundDefaultProps: Partial<StarBackgroundProps> = {
  starDensity: 0.002,
  allStarsTwinkle: true,
  twinkleProbability: 0.9,
  minTwinkleSpeed: 1,
  maxTwinkleSpeed: 2,
  exclusionSize: 320,
  gravityStrength: 0.1,
  swirlStrength: 0.2,
  gravityRadiusFactor: 0.9,
  innerGravityRadiusFactor: 0.01,
  trailLength: 6,
  swirlRotationSpeed: 0.00007,
  minTrailStrength: 0.7,
  className: '',
};

export interface ShootingStarsProps extends ShootingStarConfig {
  className?: string;
}

export const ShootingStarsPropTypes = {
  minSpeed: PropTypes.number,
  maxSpeed: PropTypes.number,
  minDelay: PropTypes.number,
  maxDelay: PropTypes.number,
  starColor: PropTypes.string,
  trailColor: PropTypes.string,
  starWidth: PropTypes.number,
  starHeight: PropTypes.number,
  className: PropTypes.string,
};

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