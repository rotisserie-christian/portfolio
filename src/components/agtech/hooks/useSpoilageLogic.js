import { useMemo } from 'react';
import { grainData } from '../data/grainData';

export const useSpoilageLogic = (grainId, currentMoisture, capacity, pricePerBu) => {
    return useMemo(() => {
        const grain = grainData[grainId];

        // Total bin value in perfect condition
        const totalValue = capacity * pricePerBu;

        // Calculate how much over the safe threshold the current moisture is
        const moistureExcess = Math.max(0, currentMoisture - grain.safeMoisture);

        // Determine risk level based on the excess moisture
        let riskLevel = "Safe";
        let lossPercentage = 0;

        if (moistureExcess > 0 && moistureExcess <= 1.5) {
            riskLevel = "Warning";
            // Demo model: lose 10% value per 1% excess
            lossPercentage = moistureExcess * 0.10;
        } else if (moistureExcess > 1.5) {
            riskLevel = "Critical";
            // Beyond 1.5% excess, spoilage accelerates rapidly (exponential penalty)
            lossPercentage = (moistureExcess * 0.15) + (moistureExcess - 1.5) * 0.05;
        }

        // Cap loss at 100%
        lossPercentage = Math.min(lossPercentage, 1);

        // Calculate dollar amount at risk of spoiling
        const estimatedLoss = totalValue * lossPercentage;

        return {
            totalValue,
            estimatedLoss,
            lossPercentage,
            riskLevel,
            moistureExcess,
            isSafe: riskLevel === "Safe",
            isWarning: riskLevel === "Warning",
            isCritical: riskLevel === "Critical"
        };
    }, [grainId, currentMoisture, capacity, pricePerBu]);
};
