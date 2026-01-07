/**
 * Calculate distance between two points
 */
export const calculateDistance = (x1, y1, x2, y2) => {
  return Math.hypot(x2 - x1, y2 - y1);
};

/**
 * Calculate the gravitational distortion and swirl effect for a star
 * @param {Object} star - Star object with x, y properties
 * @param {Object} center - Center point {x, y}
 * @param {Object} config - Configuration object
 * @param {number} time - Current time in milliseconds
 * @returns {Object} {distortedX, distortedY, norm, isInGravityZone}
 */
export const calculateSwirlEffect = (star, center, config, time) => {
  const { x, y } = star;
  const { 
    gravityStrength, 
    swirlStrength, 
    gravityRadiusFactor, 
    innerGravityRadiusFactor,
    swirlRotationSpeed 
  } = config;
  
  const dx = x - center.x;
  const dy = y - center.y;
  const dist = Math.hypot(dx, dy);
  
  const minDimension = Math.min(center.width, center.height);
  const outerGravityRadius = minDimension * gravityRadiusFactor;
  const innerGravityRadius = minDimension * innerGravityRadiusFactor;
  
  let isInGravityZone = false;
  let distortedX = x;
  let distortedY = y;
  let norm = 0;
  
  if (dist < outerGravityRadius) {
    isInGravityZone = true;
    
    if (dist < innerGravityRadius) {
      // Inside inner radius: full strength
      norm = 1.0;
    } else {
      // Between inner and outer: progressive falloff
      // norm goes from 1.0 at innerRadius to 0.0 at outerRadius
      norm = (outerGravityRadius - dist) / (outerGravityRadius - innerGravityRadius);
    }
    
    // Apply effect scaled by norm (0 = no effect, 1 = full effect)
    // Radial distortion
    const scale = 1 + gravityStrength * norm;
    const newDist = dist * scale;
    
    // Swirl around center with animated rotation
    const swirlRotation = time * swirlRotationSpeed;
    const angle = Math.atan2(dy, dx) + swirlStrength * norm + swirlRotation * norm;
    
    distortedX = center.x + Math.cos(angle) * newDist;
    distortedY = center.y + Math.sin(angle) * newDist;
  }
  
  return { distortedX, distortedY, norm, isInGravityZone };
};

/**
 * Calculate twinkling opacity for a star
 * @param {number} twinkleSpeed - Speed of twinkling
 * @param {number} time - Current time in milliseconds
 * @returns {number} Opacity value between 0.8 and 1.3
 */
export const calculateTwinkleOpacity = (twinkleSpeed, time) => {
  if (twinkleSpeed === null) return null;
  return 0.8 + Math.abs(Math.sin((time * 0.001) / twinkleSpeed) * 0.5);
};

