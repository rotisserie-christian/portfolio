import { useState, useEffect, useRef } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import { generateLinks, getNodeColor } from '../utils/graphUtils.js';
import { useGraphData } from '../hooks/useGraphData.js';

export default function SemanticGraph({ shouldStart = false }) {
    const [visibleData, setVisibleData] = useState({ nodes: [], links: [] });
    const [nodeIndex, setNodeIndex] = useState(0);
    const { graphData, loading, error } = useGraphData();

    const fgRef = useRef();

    // Camera setup and rotation
    useEffect(() => {
        if (!shouldStart || !fgRef.current || !visibleData.nodes.length) return;
        
        // Set initial camera position
        fgRef.current.camera().position.z = 800;
        
        let angle = 0;
        const distance = 600;
        
        const animate = () => {
            if (!fgRef.current) return;
            
            angle += 0.005;
            const camera = fgRef.current.camera();
            camera.position.x = distance * Math.sin(angle);
            camera.position.z = distance * Math.cos(angle);
            camera.lookAt(0, 0, 0);
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }, [shouldStart, visibleData.nodes.length]);

    // Start graph growth animation
    useEffect(() => {
        if (!shouldStart || !graphData) return;
        
        setNodeIndex(0);
        setVisibleData({ nodes: [], links: [] });
    }, [shouldStart, graphData]);

    // Graph growth animation
    useEffect(() => {
        if (!shouldStart || !graphData) return;

        const allLinks = generateLinks(graphData.nodes);
        
        const growthInterval = setInterval(() => {
            if (nodeIndex >= graphData.nodes.length) {
                clearInterval(growthInterval);
                return;
            }

            const newNode = graphData.nodes[nodeIndex];
            const currentNodeIds = [...visibleData.nodes.map(n => n.id), newNode.id];
            const relevantLinks = allLinks.filter(link => 
                currentNodeIds.includes(link.source) && currentNodeIds.includes(link.target)
            );
            
            setVisibleData({
                nodes: [...visibleData.nodes, newNode],
                links: relevantLinks
            });
            
            setNodeIndex(prev => prev + 1);
        }, 50);

        return () => clearInterval(growthInterval);
    }, [nodeIndex, visibleData, shouldStart, graphData]);

    if (loading) return <div className="text-center text-neutral-content/85">Loading graph...</div>;
    if (error) return <div className="text-center text-red-400">Error: {error}</div>;
    if (!graphData) return <div className="text-center text-neutral-content/85">No graph data available</div>;

    return (
        <div className='touch-auto pointer-events-none'>
            <div className='flex items-center justify-center bg-transparent'>
                <ForceGraph3D
                    ref={fgRef}
                    width={370}
                    height={330}
                    graphData={visibleData}
                    nodeVal={node => node.size || 1}
                    nodeColor={node => getNodeColor(node)}
                    nodeOpacity={1}
                    nodeSize={20}
                    nodeResolution={8}
                    linkWidth={1}
                    linkColor={'rgba(255,255,255,0.5)'}
                    linkOpacity={0.2}
                    linkCurvature={0.2}
                    enableNodeDrag={false}
                    enableNavigationControls={false}
                    showNavInfo={false}
                    backgroundColor="rgba(0,0,0,0)"
                    className="touch-auto pointer-events-none"
                    controlType="orbit"

                    d3Force={(force) => {
                        force.charge().strength(-50).distanceMax(50);
                        force.center().strength(1);
                        force.center([0, 0, 0]);
                        force.link().distance(10);
                    }}
                />
            </div>
        </div>
    );
};