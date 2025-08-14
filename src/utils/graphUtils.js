import { cosineSimilarity } from './cosineSimilarity.js';

/**
 * Generate links between nodes based on cosine similarity
 * @param {Array} nodes - Array of node objects with id and embedding properties
 * @param {number} maxLinksPerNode - Maximum number of links per node (default: 7)
 * @returns {Array} Array of link objects with source, target, and value properties
 */
export const generateLinks = (nodes, maxLinksPerNode = 8) => {
    const links = [];
    const numNodes = nodes.length;
    const nodeConnections = {}; // Track connections per node
    const allSimilarities = [];

    // Initialize connection counter for each node
    nodes.forEach(node => {
        nodeConnections[node.id] = 0;
    });

    // Calculate all similarities first
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            const similarity = cosineSimilarity(nodes[i].embedding, nodes[j].embedding);
            allSimilarities.push({
                source: nodes[i].id,
                target: nodes[j].id,
                value: similarity
            });
        }
    }

    // Sort by similarity descending
    allSimilarities.sort((a, b) => b.value - a.value);

    // Add links while respecting the per-node limit
    for (const link of allSimilarities) {
        if (nodeConnections[link.source] < maxLinksPerNode && 
            nodeConnections[link.target] < maxLinksPerNode) {
            links.push(link);
            nodeConnections[link.source]++;
            nodeConnections[link.target]++;
        }
    }

    return links;
};

/**
 * Get color for a node based on its group
 * @param {Object} node - Node object with group property
 * @returns {string} Color string for the node
 */
export const getNodeColor = (node) => {
    switch (node.group) {
        case 1: return 'cyan';
        case 2: return 'violet';
        case 3: return 'orange';
        default: return 'gray';
    }
};