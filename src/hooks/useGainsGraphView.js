import { useState, useCallback } from 'react';

export function useGainsGraphView() {
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const showMainView = useCallback(() => {
    setShowAddWorkout(false);
    setShowLog(false);
  }, []);

  const showWorkoutForm = useCallback(() => {
    setShowAddWorkout(true);
    setShowLog(false);
  }, []);

  const showTrainingLog = useCallback(() => {
    setShowAddWorkout(false);
    setShowLog(true);
  }, []);

  const resetToMainView = useCallback(() => {
    setShowAddWorkout(false);
    setShowLog(false);
    setCurrentPage(1);
  }, []);

  return {
    showAddWorkout,
    showLog,
    currentPage,
    showMainView,
    showWorkoutForm,
    showTrainingLog,
    resetToMainView,
    setCurrentPage
  };
}
