import { useMemo } from 'react';
import { interpolate, interpolateColor, movingAverage } from '../utils/interpolation.js';
import { formatCount } from '../utils/formatCount.js';
import ProgressBar from './ProgressBar.jsx';

export default function Funnel({ stages }) {

  const interpolatedData = useMemo(() => {
    const result = [];
    const stepsPerStage = 10; // Higher = bigger gaps between stages
  
    for (let i = 0; i < stages.length - 1; i++) {
      const current = stages[i];
      const next = stages[i + 1];
      const interpValues = interpolate(current.count, next.count, stepsPerStage);
  
      interpValues.forEach((value, index) => {
        const colorFactor = index / stepsPerStage;
        result.push({
          value,
          color: interpolateColor(current.color, next.color, colorFactor),
        });
      });
    }
  
    // Add the last stage
    const lastStage = stages[stages.length - 1];
    for (let i = 0; i < stepsPerStage; i++) {
      result.push({ value: lastStage.count, color: lastStage.color });
    }
  
    // Smoothing
    const totalBars = stepsPerStage * stages.length;
    const smoothedValues = movingAverage(result.map(d => d.value), totalBars);
    return result.map((d, i) => ({
      ...d,
      value: smoothedValues[i]
    }));
  }, [stages]);

  const maxValue = Math.max(...interpolatedData.map(d => d.value));

  return (
    <>
      <div className="flex items-center justify-center w-full">
        <div className='flex flex-col items-center justify-center w-full'>
          <div className='flex flex-row w-full mt-10 p-4'>
            {/* Left */}
            <div className='w-1/2 space-y-0.5'>
              {interpolatedData.map((data, index) => (
                <ProgressBar
                  key={index}
                  value={data.value}
                  maxValue={maxValue}
                  color={data.color}
                  isLeft={true}
                />
              ))}
            </div>

            {/* Center */}
            <div className='w-5/6 lg:w-1/2 flex flex-col justify-between p-4'>
              {stages.map((stage, index) => (
                <div 
                key={index} 
                className='flex flex-col items-center justify-center text-center text-base-content'
                >
                  <h1 className='text-5xl lg:text-6xl text-neutral-content/85 ubuntu-bold text-center mb-2 lg:mx-5'>
                    {stage.count ? formatCount(stage.count) : ''}
                  </h1>
                  
                  <p className='text-lg lg:text-xl text-neutral-content/85 ubuntu-medium text-center'>
                    {stage.label || ''}
                  </p>
                </div>
              ))}
            </div>

            {/* Right */}
            <div className='w-1/2 space-y-0.5'>
              {interpolatedData.map((data, index) => (
                <ProgressBar
                  key={index}
                  value={data.value}
                  maxValue={maxValue}
                  color={data.color}
                  isLeft={false}
                />
              ))}
            </div>
          </div> {/* End of row */}
        </div> {/* End of col */}
      </div>
    </>
  );
}