/**
 * Trail point interface (matches Star.trail)
 */
export interface TrailPoint {
  x: number;
  y: number;
}

/**
 * Draw a star trail on the canvas context
 * @param ctx - Canvas rendering context
 * @param trail - Array of points representing the star's trail
 * @param opacity - Current base opacity of the star
 * @param norm - Normalized effect strength (used to scale trail opacity)
 */
export const drawStarTrail = (
  ctx: CanvasRenderingContext2D, 
  trail: TrailPoint[] | undefined, 
  opacity: number, 
  norm: number
): void => {
  if (!trail || trail.length < 2) return;
  
  for (let i = 0; i < trail.length - 1; i++) {
    const current = trail[i];
    const next = trail[i + 1];
    
    // Progress of the trail (0 at oldest point, 1 at newest)
    const progress = i / (trail.length - 1);
    
    // Scale trail opacity: Older points are slimmer and more transparent
    const baseTrailOpacity = (0.1 + progress * 0.3) * opacity;
    const trailOpacity = baseTrailOpacity * norm;
    
    ctx.beginPath();
    ctx.moveTo(current.x, current.y);
    ctx.lineTo(next.x, next.y);
    ctx.strokeStyle = `rgba(255,255,255,${trailOpacity})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
};

/**
 * Draw a single star on the canvas
 * @param ctx - Canvas rendering context
 * @param x - X position
 * @param y - Y position
 * @param radius - Radius of the star
 * @param opacity - Current opacity of the star
 */
export const drawStar = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  radius: number, 
  opacity: number
): void => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,255,255,${opacity})`;
  ctx.fill();
};
