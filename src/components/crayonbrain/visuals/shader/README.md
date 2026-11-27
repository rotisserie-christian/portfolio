### /shader
- **`/hooks`** - Animation loop, canvas resizing, and WebGL recovery
- **`/presets`** - Pattern definitions and the shader code that draws them
- **`ShaderVisualizer.jsx`** - Canvas orchestrator
- **`shaderRenderCore.js`** - Turns time, color, and audio into the numbers the shader reads
- **`shaderConstants.js`** - How quickly audio and motion respond
- **`latticePath.js`** - Camera path that flies straight, then turns down another hall

### How it works
- Split the audio into 8 frequency bands, low to high
- In Ripples, distance from the center picks a band, and that band lights the rings there
- Read the waveform and draw those rings on a matching figure: sine = circle, triangle = diamond, square = square, and saw = triangle
- A sudden rise pushes the rings outward; a held note keeps them bright
- Move the rings with time, faster when the mix is loud, and slowly when playback stops
