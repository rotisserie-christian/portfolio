import PropTypes from 'prop-types';

// PropTypes for StarsBackground
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

// Default props for StarsBackground
export const StarBackgroundDefaultProps = {
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

// PropTypes for ShootingStars
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

// Default props for ShootingStars
export const ShootingStarsDefaultProps = {
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

