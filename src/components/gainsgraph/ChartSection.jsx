import React from 'react';
import { Line } from 'react-chartjs-2';
import TimeRangeButton from './TimeRangeButton';

export default function ChartSection({ 
  chartData, 
  options, 
  activeTimeRange, 
  availableTimeRanges, 
  onTimeRangeChange 
}) {
  return (
    <div className="flex flex-col h-[300px] lg:h-[400px] w-full items-center justify-center py-4">
      <Line key={activeTimeRange} options={options} data={chartData} />

      <div className='flex flex-row items-center justify-center gap-2 mt-2'>        
        {availableTimeRanges.map((range) => (
          <TimeRangeButton
            key={range}
            range={range}
            activeRange={activeTimeRange}
            onClick={onTimeRangeChange}
          />
        ))}
      </div>
    </div>
  );
}
