import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import { routesData } from './routesData.js';

const hubColors = {
    'New York': { start: '#FF6B6B', end: '#FF8E8E' }, // red
    'Los Angeles': { start: '#4ECDC4', end: '#6EDDD6' }, // teal
    'Tokyo': { start: '#45B7D1', end: '#6BC5D8' }, // blue 
    'Istanbul': { start: '#96CEB4', end: '#A8D5BA' }, // green 
    'Abu Dhabi': { start: '#FFEAA7', end: '#FFF0B8' }, // yellow 
    'Lagos': { start: '#DDA0DD', end: '#E6B8E6' }, // purple 
    'Santiago': { start: '#FFB347', end: '#FFC266' }, // orange 
    'fallback': { start: '#95A5A6', end: '#AAB7B8' } // gray fallback
};

const Earth = () => {
    const globeRef = useRef();
    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

    // pick colors based on hub
    const arcColor = (d) => {
        const c = hubColors[d.hub] || hubColors.fallback;
        return [c.start, c.end];
    };

    // responsive sizing
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
            const { clientWidth, clientHeight } = containerRef.current;
            const size = Math.min(clientWidth, clientHeight, 600); // 600px max
            setDimensions({ width: size, height: size });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // small delay to start rotation after controls exist, workaround for globe library not having a rotation prop  
    useEffect(() => {
        if (!globeRef.current) return;
        const tryEnable = () => {
            const controls = globeRef.current && globeRef.current.controls && globeRef.current.controls();
            if (!controls) return false;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 1;
            controls.enableZoom = false;
            controls.enablePan = false;
            controls.enableRotate = false;
            controls.update && controls.update();
            return true;
        };

        if (!tryEnable()) {
            const id = setTimeout(tryEnable, 0);
            return () => clearTimeout(id);
        }
    }, []);

    return (
    <div 
        ref={containerRef}
        style={{ width: '100%', height: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
        <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
        arcsData={routesData}
        arcColor={arcColor}
        arcDashLength={0.7}
        arcDashGap={1}
        arcDashAnimateTime={1500}
        arcStroke={0.5}
        arcAltitude={0.2}
        globeRadius={dimensions.width * 0.167}
        backgroundColor="rgba(0,0,0,0)"
        enablePointerInteraction={false}
        pointerEvents="none"
        labelsData={[]}
        labelLat="lat"
        labelLng="lng"
        labelText="name"
        labelSize={1.5}
        labelDotRadius={0.4}
        labelColor={() => '#ffffaa'}
        labelResolution={2}
        />
    </div>
  );
};

export default Earth;
