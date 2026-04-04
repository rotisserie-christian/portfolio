import { grainData } from '../data/grainData';

/**
 * Atomic updates when toggling the commodity
 * 
 * @param {string} id - The ID of the grain
 * @param {number} capacity - The capacity of the grain
 * @returns {object} - The initial state of the grain
 */
export const getInitialGrainState = (id, capacity = 5000) => {
    const grain = grainData[id];
    if (!grain) return null;

    return {
        id: id,
        moisture: grain.safeMoisture,
        price: grain.defaultPrice,
        capacity: capacity
    };
};
