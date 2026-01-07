import { useEffect } from 'react';
import { calculateSwirlEffect, calculateTwinkleOpacity } from '../utils/starMath';
import { drawStarTrail, drawStar } from '../utils/starRendering';

/**
 * Starfield animation loop
 * @param {React.RefObject} canvasRef - Reference to canvas element
 * @param {React.RefObject} starsRef - Reference to stars array
 * @param {Object} config - Animation configuration
 */
export const useStarfieldAnimation = (canvasRef, starsRef, config) => {
  const {
    gravityStrength,
    swirlStrength,
    gravityRadiusFactor,
    innerGravityRadiusFactor,
    trailLength,
    swirlRotationSpeed,
    minTrailStrength,
  } = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Context not available (e.g., in test environment)
    
    let animationFrame;

    const render = () => {
      // Check if canvas still exists (component might have unmounted)
      const currentCanvas = canvasRef.current;
      if (!currentCanvas || !ctx) {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        return;
      }

      const { width, height } = currentCanvas;
      ctx.clearRect(0, 0, width, height);

      const center = {
        x: width / 2,
        y: height / 2,
        width,
        height,
      };
      
      const time = Date.now();

      starsRef.current.forEach((star) => {
        // Calculate gravitational lensing + swirl effect
        const { distortedX, distortedY, norm, isInGravityZone } = calculateSwirlEffect(
          star,
          center,
          {
            gravityStrength,
            swirlStrength,
            gravityRadiusFactor,
            innerGravityRadiusFactor,
            swirlRotationSpeed,
          },
          time
        );

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

        // Draw trail before drawing star
        if (star.trail && star.trail.length > 1) {
          drawStarTrail(ctx, star.trail, star.opacity, norm);
        }

        // Draw star
        drawStar(ctx, distortedX, distortedY, star.radius, star.opacity);

        // Update twinkle opacity
        const twinkleOpacity = calculateTwinkleOpacity(star.twinkleSpeed, time);
        if (twinkleOpacity !== null) {
          star.opacity = twinkleOpacity;
        }
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [
    canvasRef,
    starsRef,
    gravityStrength,
    swirlStrength,
    gravityRadiusFactor,
    innerGravityRadiusFactor,
    trailLength,
    swirlRotationSpeed,
    minTrailStrength,
  ]);
};

