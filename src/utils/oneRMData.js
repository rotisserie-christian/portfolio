import { v4 as uuidv4 } from 'uuid';

// Generate sets to populate the demo chart
const generateRealisticSets = (targetOneRM, variationFactor) => {
  const workoutTypes = [
    // Heavy singles/doubles (testing days)
    () => [
      { weight: Math.round(targetOneRM * 0.9), reps: 2 },
      { weight: Math.round(targetOneRM * 0.95), reps: 1 },
      { weight: targetOneRM, reps: 1 }
    ],
    // Classic 5x5 style
    () => [
      { weight: Math.round(targetOneRM * 0.8), reps: 5 },
      { weight: Math.round(targetOneRM * 0.82), reps: 5 },
      { weight: Math.round(targetOneRM * 0.85), reps: 5 }
    ],
    // Volume day (hypertrophy)
    () => [
      { weight: Math.round(targetOneRM * 0.65), reps: 8 },
      { weight: Math.round(targetOneRM * 0.7), reps: 8 },
      { weight: Math.round(targetOneRM * 0.7), reps: 6 },
      { weight: Math.round(targetOneRM * 0.72), reps: 5 }
    ],
    // Pyramid up
    () => [
      { weight: Math.round(targetOneRM * 0.7), reps: 6 },
      { weight: Math.round(targetOneRM * 0.8), reps: 4 },
      { weight: Math.round(targetOneRM * 0.9), reps: 2 },
      { weight: Math.round(targetOneRM * 0.95), reps: 1 }
    ],
    // Medium intensity work
    () => [
      { weight: Math.round(targetOneRM * 0.75), reps: 6 },
      { weight: Math.round(targetOneRM * 0.78), reps: 5 },
      { weight: Math.round(targetOneRM * 0.82), reps: 3 }
    ]
  ];

  // Choose workout type based on variation factor
  let workoutIndex;
  if (variationFactor >= 1.05) {
    // Good day - more likely to test heavy
    workoutIndex = Math.random() < 0.4 ? 0 : Math.floor(Math.random() * workoutTypes.length);
  } else if (variationFactor < 0.9) {
    // Bad day - more likely to do volume work
    workoutIndex = Math.random() < 0.5 ? 2 : Math.floor(Math.random() * workoutTypes.length);
  } else {
    // Normal day - any workout type
    workoutIndex = Math.floor(Math.random() * workoutTypes.length);
  }

  return workoutTypes[workoutIndex]();
};

const generateMockData = () => {
  const currentDate = new Date(); // Get the current date
  const data = [];
  const startMax = 145;
  const endMax = 334;
  const totalEntries = 65; // More entries for realistic progression
  let daysSinceStart = 0;

  for (let i = 0; i < totalEntries; i++) {
    // interval between workouts (1-7 days, weighted towards 2-4 days)
    const intervalDays = Math.random() < 0.1 ? 
      Math.floor(Math.random() * 3) + 5 : // 5-7 days (rest weeks, travel, etc.)
      Math.floor(Math.random() * 3) + 2;   // 2-4 days (normal training)
    
    daysSinceStart += intervalDays;
    const entryDate = new Date(currentDate.getTime() - (totalEntries * 4 * 24 * 60 * 60 * 1000) + (daysSinceStart * 24 * 60 * 60 * 1000));

    // Base progression with realistic strength curve (slower gains over time)
    const progress = i / (totalEntries - 1);
    const strengthCurve = Math.pow(progress, 0.7); // Diminishing returns
    const baseValue = startMax + (endMax - startMax) * strengthCurve;
    
    let variationFactor = 1;
    
    // 15% chance of bad day 
    if (Math.random() < 0.15) {
      variationFactor = 0.85 + Math.random() * 0.1; // 85-95% of expected
    }
    // 8% chance of exceptional day
    else if (Math.random() < 0.08) {
      variationFactor = 1.05 + Math.random() * 0.08; // 105-113% of expected
    }
    // Normal variation
    else {
      variationFactor = 0.96 + Math.random() * 0.08; // 96-104% of expected
    }
    
    let currentMax = Math.round(baseValue * variationFactor);
    
    // Ensure no massive jumps backwards, except for outliers
    if (i > 0) {
      const previousMax = data[i - 1].oneRepMax.max;
      const maxDecrease = Math.max(15, previousMax * 0.08); // Max 8% decrease or 15lbs
      const minValue = previousMax - maxDecrease;
      
      // Don't let it drop too much unless it's a bad day
      if (currentMax < minValue && variationFactor >= 0.9) {
        currentMax = Math.max(minValue, previousMax - 5);
      }
    }
    
    // Final bounds check
    currentMax = Math.max(currentMax, startMax);
    if (i === totalEntries - 1) {
      currentMax = endMax; // Ensure we hit target
    }

    const sets = generateRealisticSets(currentMax, variationFactor);

    const weekChange = i >= 7 ? currentMax - data[i - 7].oneRepMax.max : 0;
    const monthChange = i >= 30 ? currentMax - data[i - 30].oneRepMax.max : 0;
    const threeMonthChange = i >= 90 ? currentMax - data[i - 90].oneRepMax.max : 0;
    const sixMonthChange = i >= 180 ? currentMax - data[i - 180].oneRepMax.max : 0;
    const yearChange = i >= 365 ? currentMax - data[i - 365].oneRepMax.max : 0;
    const allChange = i > 0 ? currentMax - data[0].oneRepMax.max : 0;

    data.push({
      id: uuidv4(),
      oneRepMax: {
        max: currentMax,
        weekChange,
        monthChange,
        threeMonthChange,
        sixMonthChange,
        yearChange,
        allChange,
        sessionChange: i > 0 ? currentMax - data[i - 1].oneRepMax.max : 0
      },
      date: {
        day: entryDate.getDate(),
        month: entryDate.getMonth() + 1,
        year: entryDate.getFullYear()
      },
      sets
    });
  }

  return data; 
};

const calculateChanges = (data) => {
  return data.map((entry, index) => {
    if (index === 0) return entry;

    const weekChange = entry.oneRepMax.max - data[Math.max(0, index - 1)].oneRepMax.max;
    const monthChange = entry.oneRepMax.max - data[Math.max(0, index - 4)].oneRepMax.max;
    const threeMonthChange = entry.oneRepMax.max - data[Math.max(0, index - 12)].oneRepMax.max;
    const sixMonthChange = entry.oneRepMax.max - data[Math.max(0, index - 24)].oneRepMax.max;
    const yearChange = entry.oneRepMax.max - data[Math.max(0, index - 48)].oneRepMax.max;
    const allChange = entry.oneRepMax.max - data[0].oneRepMax.max;

    return {
      ...entry,
      oneRepMax: {
        ...entry.oneRepMax,
        weekChange,
        monthChange,
        threeMonthChange,
        sixMonthChange,
        yearChange,
        allChange
      }
    };
  });
};

const oneRMData = calculateChanges(generateMockData());

export default oneRMData;