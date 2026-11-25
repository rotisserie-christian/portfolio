/**
 * A single triangle that over-covers the [-1, 1] clip-space square. Used
 * instead of a two-triangle quad because it's one less vertex and has no
 * diagonal seam — the standard trick for fullscreen fragment-shader passes.
 */
export const createFullscreenTriangle = (gl) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );

  return {
    buffer,
    dispose: () => gl.deleteBuffer(buffer),
  };
};

/**
 * Binds the triangle's position attribute and issues the draw call. Takes
 * the attribute location explicitly because it's resolved per-program (a
 * fresh program is built whenever the active preset's shader changes).
 */
export const drawFullscreenTriangle = (gl, buffer, positionLocation) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
