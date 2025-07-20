import { useState } from 'react';
import { saveWorkout as saveIndexedWorkout } from '../utils/indexedDB';
import { saveWorkout as saveSupabaseWorkout } from '../utils/supabaseClient';

const EXERCISES = [
  'Squat',
  'Bench Press',
  'Deadlift',
  'Overhead Press',
  'Pull Up',
  'Push Up'
];

export default function WorkoutPlanner({ user }) {
  const [exercise, setExercise] = useState(EXERCISES[0]);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [rpe, setRpe] = useState('');
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddExercise = () => {
    const ex = {
      exercise,
      sets: parseInt(sets, 10) || 0,
      reps: parseInt(reps, 10) || 0,
      weight: parseFloat(weight) || 0,
      rpe: parseFloat(rpe) || 0,
    };
    if (editIndex !== null) {
      const updated = [...workoutExercises];
      updated[editIndex] = ex;
      setWorkoutExercises(updated);
      setEditIndex(null);
    } else {
      setWorkoutExercises([...workoutExercises, ex]);
    }
    setSets('');
    setReps('');
    setWeight('');
    setRpe('');
  };

  const handleEdit = (index) => {
    const ex = workoutExercises[index];
    setExercise(ex.exercise);
    setSets(String(ex.sets));
    setReps(String(ex.reps));
    setWeight(String(ex.weight));
    setRpe(String(ex.rpe));
    setEditIndex(index);
  };

  const handleRemove = (index) => {
    const updated = workoutExercises.filter((_, i) => i !== index);
    setWorkoutExercises(updated);
    if (editIndex === index) {
      setEditIndex(null);
      setSets('');
      setReps('');
      setWeight('');
      setRpe('');
    }
  };

  const handleSaveWorkout = async () => {
    const workout = {
      date: new Date().toISOString(),
      exercises: workoutExercises
    };
    try {
      if (user?.isPaid) {
        await saveSupabaseWorkout(workout);
      } else {
        await saveIndexedWorkout(workout);
      }
      setWorkoutExercises([]);
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  return (
    <div className="p-4 space-y-4 bg-gray-100 max-w-xl mx-auto rounded">
      <h2 className="text-xl font-bold">Workout Planner</h2>
      <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-2 md:space-y-0">
        <div>
          <label className="block text-sm font-medium">Exercise</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          >
            {EXERCISES.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <div>
            <label className="block text-sm font-medium">Sets</label>
            <input
              type="number"
              className="mt-1 w-16 border border-gray-300 rounded p-2"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Reps</label>
            <input
              type="number"
              className="mt-1 w-16 border border-gray-300 rounded p-2"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Weight</label>
            <input
              type="number"
              className="mt-1 w-20 border border-gray-300 rounded p-2"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">RPE</label>
            <input
              type="number"
              className="mt-1 w-16 border border-gray-300 rounded p-2"
              value={rpe}
              onChange={(e) => setRpe(e.target.value)}
            />
          </div>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddExercise}
        >
          {editIndex !== null ? 'Update' : 'Add'}
        </button>
      </div>
      <ul className="space-y-2">
        {workoutExercises.map((ex, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center bg-white p-2 rounded shadow"
          >
            <span>
              {ex.exercise} - {ex.sets}x{ex.reps} @ {ex.weight}kg RPE {ex.rpe}
            </span>
            <span className="space-x-2">
              <button
                className="text-blue-600"
                onClick={() => handleEdit(idx)}
              >
                Edit
              </button>
              <button
                className="text-red-600"
                onClick={() => handleRemove(idx)}
              >
                Remove
              </button>
            </span>
          </li>
        ))}
      </ul>
      {workoutExercises.length > 0 && (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
          onClick={handleSaveWorkout}
        >
          Save Workout
        </button>
      )}
    </div>
  );
}
