/**
 * Draw a star trail
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} trail - Array of trail points [{x, y}, ...]
 * @param {number} opacity - Base opacity of the star
 * @param {number} norm - Normalized effect strength (0-1)
 */
export const drawStarTrail = (ctx, trail, opacity, norm) => {
  if (!trail || trail.length < 2) return;
  
  for (let i = 0; i < trail.length - 1; i++) {
    const current = trail[i];
    const next = trail[i + 1];
    
    // Fade opacity from oldest (low) to newest (higher)
    const progress = i / (trail.length - 1);
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
};

/**
 * Draw a single star
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} radius - Star radius
 * @param {number} opacity - Star opacity
 */
export const drawStar = (ctx, x, y, radius, opacity) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,255,255,${opacity})`;
  ctx.fill();
};

