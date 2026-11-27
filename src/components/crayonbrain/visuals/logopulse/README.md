### /logopulse
- **`/hooks`** - Animation loop, canvas resizing, and image loading
- **`logoPulseRenderCore.js`** - Draws the logo and the ring around it
- **`logoPulseSpectrum.js`** - Turns the frequency data into bar heights
- **`logoPulseConstants.js`** - Colors, sizes, and image limits

### How it works
- Place the logo in a circle at the center
- Split the audio into frequency bands from bass to treble
- Draw them in a ring around the logo, bass at the bottom and treble at the top, mirrored on both sides
