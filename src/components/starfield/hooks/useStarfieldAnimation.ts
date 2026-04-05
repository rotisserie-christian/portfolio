import { useEffect, RefObject } from 'react';
import { calculateSwirlEffect, calculateTwinkleOpacity } from '../utils/starMath';
import { drawStarTrail, drawStar } from '../utils/starRendering';
import { Star, AnimationConfig } from '../types/types';

/**
 * Starfield animation loop
 * @param canvasRef - Reference to canvas element
 * @param starsRef - Reference to stars array
 * @param config - Animation configuration (gravity, swirl, trail settings)
 * @param paused - Whether to pause the animation loop
 */
export const useStarfieldAnimation = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  starsRef: RefObject<Star[]>,
  config: AnimationConfig,
  paused: boolean = false
): void => {
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
    if (paused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;

    const render = () => {
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

      starsRef.current?.forEach((star) => {
        // gravitational lensing + swirl effect
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
        ) as { distortedX: number; distortedY: number; norm: number; isInGravityZone: boolean };

        // trail for stars in gravity zone
        if (isInGravityZone && norm >= minTrailStrength) {
          if (!star.trail) {
            star.trail = [];
          }
          star.trail.push({ x: distortedX, y: distortedY });
          if (star.trail.length > trailLength) {
            star.trail.shift();
          }
        } else {
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
        if (star.twinkleSpeed !== null) {
          const twinkleOpacity = calculateTwinkleOpacity(star.twinkleSpeed, time) as number | null;
          if (twinkleOpacity !== null) {
            star.opacity = twinkleOpacity;
          }
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
    paused,
  ]);
};
