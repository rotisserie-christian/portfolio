import React from 'react';
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import LogTable from './LogTable';

export default function TrainingLogView({ 
  data, 
  currentPage, 
  itemsPerPage, 
  onBack, 
  onPageChange 
}) {
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className='flex flex-col items-start justify-center p-2'>
      <div className='flex flex-row items-center justify-between w-full mb-4'>
        <button 
          className='btn rounded-2xl'
          onClick={onBack}
        >
          <FaAngleDoubleLeft />Back
        </button>

        <div className='flex flex-col items-left justify-start lg:justify-end'>
          <h2 className='text-3xl font-bold text-left lg:text-right'>Training log</h2>
          <p className='text-sm text-base-content ml-1 text-left lg:text-right'>View your history</p>
        </div>
      </div>

      <LogTable data={data} currentPage={currentPage} itemsPerPage={itemsPerPage} />

      <div className='flex justify-center items-center mt-4 w-full'>
        <button
          className='btn btn-circle mr-2'
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <FaAngleLeft />
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className='btn btn-circle ml-2'
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
}
