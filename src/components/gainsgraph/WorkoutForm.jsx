import React from 'react';
import { FaAngleDoubleLeft, FaCheck, FaPlus } from 'react-icons/fa';

export default function WorkoutForm({ 
  sets, 
  workoutDate, 
  onUpdateSet, 
  onAddSet, 
  onSaveWorkout, 
  onCancel 
}) {
  return (
    <div className='flex flex-col items-center justify-center p-4 w-full max-w-md mx-auto'>
      {/* Date Picker */}
      <div className='flex flex-col items-start justify-center w-full mb-6'>
        <label className='text-lg font-semibold text-left mb-2'>
          Workout Date
        </label>
        <input 
          type='date' 
          className='input input-bordered w-full'
          value={workoutDate}
          onChange={(e) => onUpdateSet('date', e.target.value)}
        />
      </div>

      {sets.map((set, index) => (
        <div key={index} className='flex flex-row items-center justify-between w-full mb-5'>
          <div className='flex flex-col items-start justify-center'>
            <p className='text-lg font-semibold text-left mb-2 ml-1'>
              Weight
            </p>
            <input 
              type='number' 
              className='input input-bordered w-32'
              value={set.weight}
              onChange={(e) => onUpdateSet(index, 'weight', e.target.value)}
            />
          </div>
          
          <div className='flex flex-col items-start justify-center'>
            <p className='text-lg font-semibold text-left mb-2 ml-1'>
              Reps
            </p>
            <input 
              type='number' 
              className='input input-bordered w-32'
              value={set.reps}
              onChange={(e) => onUpdateSet(index, 'reps', e.target.value)}
            />
          </div>
        </div>
      ))}

      {sets.length < 5 && (
        <div 
          className='flex flex-row items-center justify-center text-content cursor-pointer underline gap-2 mb-5'
          onClick={onAddSet}
        >
          <FaPlus className='w-4 h-4 mb-2' />
          <p className='text-lg font-semibold'>Add another set</p>
        </div>
      )}

      <div className='flex flex-row items-center justify-center gap-2 mt-5'>
        <button 
          className='btn rounded-2xl w-32'
          onClick={onCancel}
        >
          <FaAngleDoubleLeft />Back
        </button>

        <button 
          className='btn text-teal-300 rounded-2xl w-32'
          onClick={onSaveWorkout}
        >
          <FaCheck />Save
        </button>
      </div>
    </div>
  );
}
