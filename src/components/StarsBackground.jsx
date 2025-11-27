import { cn } from "../utils/cn";
import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from 'prop-types';

export const StarsBackground = ({
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.9,
  minTwinkleSpeed = 1,
  maxTwinkleSpeed = 2,
  exclusionSize = 220,
  gravityStrength = 0.3,        // distortion intensity
  swirlStrength = 0.5,          // swirl in radians
  gravityRadiusFactor = 0.3,    // fraction of smallest dimension
  className,
}) => {
  const [stars, setStars] = useState([]);
  const canvasRef = useRef(null);

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
      setStars(generateStars(width, height));
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

  // draw + twinkle + gravitational distortion
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Context not available (e.g., in test environment)
    let af;
    let frameCount = 0; // Add frame counter for throttling

    const render = () => {
      // Check if canvas still exists (component might have unmounted)
      const currentCanvas = canvasRef.current;
      if (!currentCanvas || !ctx) {
        if (af) cancelAnimationFrame(af);
        return;
      }

      frameCount++;
      
      // Render at 25fps (skip 2 out of 3 frames)
      if (frameCount % 3 !== 0) {
        af = requestAnimationFrame(render);
        return;
      }

      const { width, height } = currentCanvas;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const gravityRadius =
        Math.min(width, height) * gravityRadiusFactor;

      stars.forEach((star) => {
        // apply gravitational lensing + swirl
        let { x, y, radius, opacity, twinkleSpeed } = star;
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist < gravityRadius) {
          const norm = (gravityRadius - dist) / gravityRadius;
          // radial distortion
          const scale = 1 + gravityStrength * norm;
          const newDist = dist * scale;
          // swirl around center
          const angle = Math.atan2(dy, dx) + swirlStrength * norm;
          x = centerX + Math.cos(angle) * newDist;
          y = centerY + Math.sin(angle) * newDist;
        }

        // draw star
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();

        // twinkle
        if (twinkleSpeed !== null) {
          star.opacity =
            0.8 +
            Math.abs(
              Math.sin((Date.now() * 0.001) / twinkleSpeed) * 0.5
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
    stars,
    gravityStrength,
    swirlStrength,
    gravityRadiusFactor,
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
  gravityRadiusFactor: 0.3,
  className: "",
};