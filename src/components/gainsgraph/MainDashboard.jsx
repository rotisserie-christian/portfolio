import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { HiMenuAlt2 } from 'react-icons/hi';

export default function MainDashboard({ 
  exerciseName, 
  estimatedMax, 
  onShowLog, 
  onShowAddWorkout 
}) {
  return (
    <div className='flex flex-col items-center justify-center w-full gap-4'>
      <div className='flex flex-row items-center justify-between w-full mb-6'>      
        <div className='flex flex-row items-start justify-start'>
          <h1 className="text-3xl font-bold text-left">{exerciseName}</h1>
        </div>

        <button 
          className='btn rounded-2xl'
          onClick={onShowLog}
        >
          <HiMenuAlt2 className='text-semibold text-xl' />Training log
        </button>
      </div>

      <div className='flex flex-row items-center justify-between w-full gap-4'>
        <div className='flex flex-col items-start'>
          <h1 className='text-3xl font-bold'>{estimatedMax}lb</h1>
          <p className='text-sm'>Estimated max</p>
        </div>

        <button 
          className='btn text-teal-300 rounded-2xl'
          onClick={onShowAddWorkout}
        >
          <FaPlus />Add workout
        </button>
      </div>
    </div>
  );
}
