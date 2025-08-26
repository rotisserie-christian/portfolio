import React from 'react';
import { format } from 'date-fns';

// data: array - Array of workout entries
// currentPage: number - Current page number for pagination
// itemsPerPage: number - Number of items to show per page

export default function LogTable({ data, currentPage, itemsPerPage }) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <table className="table w-[300px] lg:w-full">
      <thead>
        <tr>
          <th>Date</th>
          <th>1RM</th>
          <th>Sets</th>
        </tr>
      </thead>
      <tbody>
        {currentData.map((entry) => (
          <tr key={entry.id}>
            <td>{format(new Date(entry.date.year, entry.date.month - 1, entry.date.day), 'MMM d, yyyy')}</td>
            <td>{entry.oneRepMax.max} lbs</td>
            <td>
              {entry.sets.map((set, index) => (
                <span key={index} className="mr-2">
                  {set.weight}x{set.reps}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}