import { cn } from "../../utils/cn";
import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from 'prop-types';

export const StarsBackground = ({
  starDensity = 0.002,
  allStarsTwinkle = true,
  twinkleProbability = 0.9,
  minTwinkleSpeed = 1,
  maxTwinkleSpeed = 2,
  exclusionSize = 320,
  gravityStrength = 0.2, // distortion intensity
  swirlStrength = 0.2, // swirl in radians
  gravityRadiusFactor = 0.9, // outer radius - where effect starts (fraction of smallest dimension)
  innerGravityRadiusFactor = 0.1, // inner radius - where full strength begins
  trailLength = 6, // number of trail points
  swirlRotationSpeed = 0.00007, // rotation speed for animated swirl
  minTrailStrength = 0.7, // minimum norm value to show trails
  className,
}) => {
  const [stars, setStars] = useState([]);
  const canvasRef = useRef(null);
  const starsRef = useRef([]);

  const generateStars = useCallback(
    (width, height) => {
      const area = width * height;
      const numStars = Math.floor(area * starDensity);
      const centerX = width / 2;
      const centerY = height / 2;
      const exclusionRadius = exclusionSize / 2;

      const getDistance = (x, y) =>
        Math.hypot(x - centerX, y - centerY);

      return Array.from({ length: numStars }, () => {
        let x, y, dist;
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
        const shouldTwinkle =
          allStarsTwinkle || Math.random() < twinkleProbability;

        return {
          x,
          y,
          radius: Math.random() * 0.05 + 0.5,
          opacity: adjustedOpacity,
          twinkleSpeed: shouldTwinkle
            ? minTwinkleSpeed +
              Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
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

  // regenerate on resize / config change
  useEffect(() => {
    const updateStars = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const newStars = generateStars(width, height);
      setStars(newStars);
      starsRef.current = newStars; // Update ref whenever stars change
    };
    updateStars();
    const ro = new ResizeObserver(updateStars);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [
    generateStars,
    starDensity,
    allStarsTwinkle,
    twinkleProbability,
    minTwinkleSpeed,
    maxTwinkleSpeed,
    exclusionSize,
  ]);

  // Keep ref in sync with stars state
  useEffect(() => {
    starsRef.current = stars;
  }, [stars]);

  // draw + twinkle + gravitational distortion
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Context not available (e.g., in test environment)
    let af;

    const render = () => {
      // Check if canvas still exists (component might have unmounted)
      const currentCanvas = canvasRef.current;
      if (!currentCanvas || !ctx) {
        if (af) cancelAnimationFrame(af);
        return;
      }

      const { width, height } = currentCanvas;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const minDimension = Math.min(width, height);
      const outerGravityRadius = minDimension * gravityRadiusFactor;
      const innerGravityRadius = minDimension * innerGravityRadiusFactor;
      const time = Date.now();
      const swirlRotation = time * swirlRotationSpeed;

      starsRef.current.forEach((star) => {
        // apply gravitational lensing + swirl
        let { x, y, radius, opacity, twinkleSpeed } = star;
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.hypot(dx, dy);
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
          // radial distortion
          const scale = 1 + gravityStrength * norm;
          const newDist = dist * scale;
          // swirl around center with animated rotation
          const angle = Math.atan2(dy, dx) + swirlStrength * norm + swirlRotation * norm;
          distortedX = centerX + Math.cos(angle) * newDist;
          distortedY = centerY + Math.sin(angle) * newDist;
        }

        // Update trail for stars in gravity zone (only if effect is strong enough)
        if (isInGravityZone && norm >= minTrailStrength) {
          // Initialize trail if it doesn't exist
          if (!star.trail) {
            star.trail = [];
          }
          // Add current position to trail
          star.trail.push({ x: distortedX, y: distortedY });
          // Keep only the last trailLength points
          if (star.trail.length > trailLength) {
            star.trail.shift();
          }
        } else {
          // Clear trail when star leaves gravity zone or effect is too weak
          if (star.trail) {
            star.trail = [];
          }
        }

        // Draw trail before drawing star (scale trail opacity by norm for progressive effect)
        if (star.trail && star.trail.length > 1) {
          for (let i = 0; i < star.trail.length - 1; i++) {
            const current = star.trail[i];
            const next = star.trail[i + 1];
            // Fade opacity from oldest (low) to newest (higher)
            const progress = i / (star.trail.length - 1);
            // Scale trail opacity by norm so trails fade out as effect weakens
            const baseTrailOpacity = (0.1 + progress * 0.3) * opacity;
            const trailOpacity = baseTrailOpacity * norm;
            
            ctx.beginPath();
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = `rgba(255,255,255,${trailOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(distortedX, distortedY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();

        // twinkle
        if (twinkleSpeed !== null) {
          star.opacity =
            0.8 +
            Math.abs(
              Math.sin((time * 0.001) / twinkleSpeed) * 0.5
            );
        }
      });

      af = requestAnimationFrame(render);
    };
    render();
    return () => {
      if (af) cancelAnimationFrame(af);
    };
  }, [
    gravityStrength,
    swirlStrength,
    gravityRadiusFactor,
    innerGravityRadiusFactor,
    trailLength,
    swirlRotationSpeed,
    minTrailStrength,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full absolute inset-0", className)}
    />
  );
};

StarsBackground.propTypes = {
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

StarsBackground.defaultProps = {
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