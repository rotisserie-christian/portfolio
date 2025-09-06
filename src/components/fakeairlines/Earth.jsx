import React, { useMemo, useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import { routesData } from './routesData.js';

const Earth = () => {
    const globeRef = useRef();
    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
    
    // Create data for react-globe based on routesData
    const arcsData = useMemo(() => {
    return routesData.map((route, index) => ({
        startLat: route.startLat,
        startLng: route.startLng,
        endLat: route.endLat,
        endLng: route.endLng,
        color: [
        // link colors
        `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
        `hsl(${((index + 10) * 137.5) % 360}, 70%, 50%)`
        ],
        name: route.name,
        id: route.id
    }));
    }, []);

    // Responsive sizing
    useEffect(() => {
    const updateDimensions = () => {
        if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const size = Math.min(clientWidth, clientHeight, 600); // Cap at 600px max
        setDimensions({ width: size, height: size });
        }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Small delay to ensure the globe is fully loaded before trying to set the controls
    useEffect(() => {
    if (!globeRef.current) return;

    setTimeout(() => {
        const controls = globeRef.current.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableRotate = false;
        
        controls.update();
    }, 100);
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
        arcsData={arcsData}
        arcColor={'color'}
        arcDashLength={0.5}
        arcDashGap={1}
        arcDashAnimateTime={1500}
        arcStroke={0.5}
        arcAltitude={0.2}
        globeRadius={dimensions.width * 0.167}
        backgroundColor="rgba(0,0,0,0)"
        enablePointerInteraction={false}
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
