import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const exercisesList = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Overhead Press',
  'Pull Up',
];

const WorkoutPlanner = () => {
  const [user, setUser] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(exercisesList[0]);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [rpe, setRpe] = useState('');
  const [exercises, setExercises] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const stored = await get('user');
      setUser(stored || { is_paid: false });
    }
    loadUser();
  }, []);

  const resetForm = () => {
    setSelectedExercise(exercisesList[0]);
    setSets('');
    setReps('');
    setWeight('');
    setRpe('');
    setEditIndex(null);
  };

  const addExercise = () => {
    const newEntry = {
      exercise: selectedExercise,
      sets,
      reps,
      weight,
      rpe,
    };
    if (editIndex !== null) {
      const updated = [...exercises];
      updated[editIndex] = newEntry;
      setExercises(updated);
    } else {
      setExercises([...exercises, newEntry]);
    }
    resetForm();
  };

  const handleEdit = (index) => {
    const entry = exercises[index];
    setSelectedExercise(entry.exercise);
    setSets(entry.sets);
    setReps(entry.reps);
    setWeight(entry.weight);
    setRpe(entry.rpe);
    setEditIndex(index);
  };

  const handleRemove = (index) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
  };

  const saveWorkout = async () => {
    const workout = {
      date: new Date().toISOString(),
      exercises,
    };
    if (!user || !user.is_paid) {
      const existing = (await get('workouts')) || [];
      await set('workouts', [...existing, workout]);
      alert('Workout saved locally');
    } else {
      try {
        const { error } = await supabase.from('workouts').insert([workout]);
        if (error) throw error;
        alert('Workout saved to cloud');
      } catch (err) {
        console.error('Error saving workout', err);
      }
    }
    setExercises([]);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Workout Planner</h2>

      <div className="space-y-2 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Exercise</label>
          <select
            className="w-full border rounded p-2"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            {exercisesList.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <input
            type="number"
            placeholder="Sets"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="RPE"
            value={rpe}
            onChange={(e) => setRpe(e.target.value)}
            className="border rounded p-2"
          />
        </div>

        <button
          className="bg-blue-500 text-white rounded px-4 py-2 w-full"
          onClick={addExercise}
        >
          {editIndex !== null ? 'Update Exercise' : 'Add Exercise'}
        </button>
      </div>

      {exercises.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Workout Log</h3>
          <ul className="space-y-2">
            {exercises.map((ex, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <div>
                  <p className="font-semibold">{ex.exercise}</p>
                  <p className="text-sm text-gray-600">
                    Sets: {ex.sets} Reps: {ex.reps} Weight: {ex.weight} RPE: {ex.rpe}
                  </p>
                </div>
                <div className="space-x-2">
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        className="bg-green-500 text-white rounded px-4 py-2"
        onClick={saveWorkout}
        disabled={!exercises.length}
      >
        Save Workout
      </button>
    </div>
  );
};

export default WorkoutPlanner;
