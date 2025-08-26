import React from 'react';

// range: string - '1m' | '3m' | '6m' | '1y' | 'all'
// activeRange: string - current active range
// onClick: function - callback when range is clicked

export default function TimeRangeButton({ range, activeRange, onClick }) {
  const isActive = range === activeRange;
  const label = {
    '1m': '1M',
    '3m': '3M',
    '6m': '6M',
    '1y': '1Y',
    'all': 'All'
  }[range];

  return (
    <button
      className={`rounded-2xl py-1 bg-base-300 w-16 h-8 text-sm text-center border-2 ${
        isActive ? 'border-teal-300 text-teal-300' : 'border-base-content text-base-content'
      }`}
      onClick={() => onClick(range)}
    >
      {label}
    </button>
  );
}
