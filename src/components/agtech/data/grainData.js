export const grainData = {
  canola: {
    id: "canola",
    name: "Canola",
    safeMoisture: 8.0, // Percentage
    defaultPrice: 14.50, // Per Bushel
    color: "text-amber-400",
  },
  wheat: {
    id: "wheat",
    name: "Wheat",
    safeMoisture: 14.5,
    defaultPrice: 7.25,
    color: "text-amber-600",
  },
};

export const grainOptions = Object.values(grainData);
