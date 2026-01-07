### /starfield
- **`hooks/`** - Animation and canvas resizing logic 
- **`utils/`** - Default configs and math functions 
- **`StarsBackground.jsx`** - Background orchestrator
- **`ShootingStars.jsx`** - Shooting stars orchestrator 

### How it works
- Draw stars to the canvas at random x,y coordinates
- Exclude stars from the space surrounding the center of the canvas
- Determine x and y axis distance from the center to each star 
- Compute the distance (hypotenuse) and angle from the center
- Rotate its angle over time, with stronger rotation closer to the center
- Draw each star at its new position each frame 
