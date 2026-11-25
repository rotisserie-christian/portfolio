/**
 * Shader compile/link helpers shared by every GL-based Crayonbrain
 * sub-visualizer. Kept dependency-free (raw WebGL API only) so it works
 * identically against a WebGL1 or WebGL2 context.
 */

export const compileShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    const kind = type === gl.VERTEX_SHADER ? 'vertex' : 'fragment';
    throw new Error(`[shader] ${kind} shader compile error:\n${info}`);
  }

  return shader;
};

/**
 * Compiles + links a vertex/fragment pair into a program. Shader objects are
 * deleted after linking (the program retains what it needs internally).
 */
export const createProgram = (gl, vertexSource, fragmentSource) => {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`[shader] program link error:\n${info}`);
  }

  return program;
};

/**
 * Looks up a batch of uniform locations by name. Missing/optimized-out
 * uniforms resolve to `null`, which WebGL silently ignores on `uniformX*`
 * calls — callers don't need to guard each lookup individually.
 */
export const getUniformLocations = (gl, program, names) => {
  const locations = {};
  for (const name of names) {
    locations[name] = gl.getUniformLocation(program, name);
  }
  return locations;
};
