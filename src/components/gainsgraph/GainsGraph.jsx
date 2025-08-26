import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeScale,
} from 'chart.js';
import { 
  calculateOneRepMax, 
  calculateChanges, 
  getAvailableTimeRanges, 
  filterDataByTimeRange, 
  getEstimatedMax 
} from '../../utils/fitnessUtils';
import 'chartjs-adapter-date-fns';
import { 
  ChartSection, 
  MainDashboard, 
  WorkoutForm, 
  TrainingLogView 
} from './index';
import { v4 as uuidv4 } from 'uuid';
import oneRMData from '../../utils/oneRMData';
import { generateChartData, generateChartOptions } from '../../utils/chartUtils';
import { useWorkoutForm, useGainsGraphView } from '../../hooks';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeScale 
);

export default function GainsGraph({ data: initialData, exerciseName = "Squat", onDataChange }) {
  const [data, setData] = useState(initialData || oneRMData);
  const [isClient, setIsClient] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState('all');
  const itemsPerPage = 5;

  // state management hooks
  const workoutForm = useWorkoutForm();
  const viewState = useGainsGraphView();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update local data when props change
  useEffect(() => {
    setData(initialData || oneRMData);
  }, [initialData]);

  const availableTimeRanges = useMemo(() => {
    return getAvailableTimeRanges(data);
  }, [data]);

  const filteredData = useMemo(() => {
    return filterDataByTimeRange(data, activeTimeRange);
  }, [data, activeTimeRange]);

  const estimatedMax = useMemo(() => {
    return getEstimatedMax(filteredData, activeTimeRange);
  }, [filteredData, activeTimeRange]);

  const maxValues = filteredData.map(entry => entry.oneRepMax.max);

  const chartData = useMemo(() => {
    return generateChartData(filteredData);
  }, [filteredData]);

  const options = useMemo(() => {
    return generateChartOptions(activeTimeRange, maxValues);
  }, [activeTimeRange, maxValues]);

  const handleTimeRangeChange = (range) => {
    setActiveTimeRange(range);
  };

  const saveWorkout = useCallback(async () => {
    const selectedDate = new Date(workoutForm.workoutDate);
    const validSets = workoutForm.sets.filter(set => set.weight !== '' && set.reps !== '');
    if (validSets.length === 0) return;

    const maxOneRM = Math.max(...validSets.map(set => calculateOneRepMax(Number(set.weight), Number(set.reps))));

    const newEntry = {
      id: uuidv4(),
      oneRepMax: {
        max: maxOneRM,
        weekChange: 0,
        monthChange: 0,
        threeMonthChange: 0,
        sixMonthChange: 0,
        yearChange: 0,
        allChange: 0,
        sessionChange: 0
      },
      date: {
        day: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear()
      },
      sets: validSets.map(set => ({ weight: Number(set.weight), reps: Number(set.reps) }))
    };

    const newData = [...data, newEntry].sort((a, b) => {
      const dateA = new Date(a.date.year, a.date.month - 1, a.date.day);
      const dateB = new Date(b.date.year, b.date.month - 1, b.date.day);
      return dateA.getTime() - dateB.getTime();
    });
    
    const updatedData = calculateChanges(newData);
    setData(updatedData);
    
    // Call the parent's onDataChange (which now saves to database)
    if (onDataChange) {
      await onDataChange(updatedData);
    }
    
    viewState.showMainView();
    workoutForm.resetForm();
  }, [data, workoutForm, calculateChanges, onDataChange, viewState]);

  const handleCancelWorkout = () => {
    viewState.showMainView();
    workoutForm.resetForm();
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-base-300 rounded-2xl w-full max-w-xl p-6 lg:p-10">
      {!viewState.showLog ? (
        <div className="flex flex-col gap-8 w-full max-w-xl mx-auto">
          <ChartSection
            chartData={chartData}
            options={options}
            activeTimeRange={activeTimeRange}
            availableTimeRanges={availableTimeRanges}
            onTimeRangeChange={handleTimeRangeChange}
          />

          {!viewState.showAddWorkout ? (
            <MainDashboard
              exerciseName={exerciseName}
              estimatedMax={estimatedMax}
              onShowLog={viewState.showTrainingLog}
              onShowAddWorkout={viewState.showWorkoutForm}
            />
          ) : (
            <WorkoutForm
              sets={workoutForm.sets}
              workoutDate={workoutForm.workoutDate}
              onUpdateSet={workoutForm.updateSet}
              onAddSet={workoutForm.addSet}
              onSaveWorkout={saveWorkout}
              onCancel={handleCancelWorkout}
            />
          )}
        </div>
      ) : (
        <TrainingLogView
          data={data}
          currentPage={viewState.currentPage}
          itemsPerPage={itemsPerPage}
          onBack={viewState.showMainView}
          onPageChange={viewState.setCurrentPage}
        />
      )}
    </div>
  );
}