import { useState, useCallback } from 'react';

export function useWorkoutForm() {
  const [sets, setSets] = useState([{ weight: '', reps: '' }]);
  const [workoutDate, setWorkoutDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });

  const addSet = useCallback(() => {
    if (sets.length < 5) {
      setSets([...sets, { weight: '', reps: '' }]);
    }
  }, [sets]);

  const updateSet = useCallback((index, field, value) => {
    if (field === 'date') {
      setWorkoutDate(value);
      return;
    }
    
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  }, [sets]);

  const resetForm = useCallback(() => {
    setSets([{ weight: '', reps: '' }]);
    const today = new Date();
    setWorkoutDate(today.toISOString().split('T')[0]);
  }, []);

  return {
    sets,
    workoutDate,
    addSet,
    updateSet,
    resetForm
  };
}
