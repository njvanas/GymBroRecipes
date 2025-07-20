import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';
import Button from './ui/Button';
import Input from './ui/Input';
import Label from './ui/Label';
import { Card, CardHeader, CardContent } from './ui/Card';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

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
    if (!user || !user.is_paid || !supabase) {
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
    <div className="space-y-4">
      <h1 className="text-3xl font-bold md:text-4xl text-center">Workout Planner</h1>

      <Card className="mt-4">
        <CardContent className="space-y-2">
          <div>
            <Label htmlFor="exercise">Exercise</Label>
            <select
              id="exercise"
              className="w-full border rounded p-2 dark:bg-gray-800"
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
            <Input
              type="number"
              aria-label="Sets"
              placeholder="Sets"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
            <Input
              type="number"
              aria-label="Reps"
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
            <Input
              type="number"
              aria-label="Weight"
              placeholder="Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <Input
              type="number"
              aria-label="RPE"
              placeholder="RPE"
              value={rpe}
              onChange={(e) => setRpe(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={addExercise} aria-label="Add Exercise">
            {editIndex !== null ? 'Update Exercise' : 'Add Exercise'}
          </Button>
        </CardContent>
      </Card>

      {exercises.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <h2 className="text-xl font-semibold md:text-2xl">Workout Log</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {exercises.map((ex, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded"
                >
                  <div>
                    <p className="font-semibold">{ex.exercise}</p>
                    <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-100">
                      Sets: {ex.sets} Reps: {ex.reps} Weight: {ex.weight} RPE: {ex.rpe}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      className="bg-transparent text-blue-600 hover:underline px-2 py-1"
                      onClick={() => handleEdit(idx)}
                      aria-label="Edit exercise"
                    >
                      Edit
                    </Button>
                    <Button
                      className="bg-transparent text-red-600 hover:underline px-2 py-1"
                      onClick={() => handleRemove(idx)}
                      aria-label="Remove exercise"
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Button
        className="bg-green-500 hover:bg-green-600 mt-4"
        onClick={saveWorkout}
        disabled={!exercises.length}
        aria-label="Save Workout"
      >
        Save Workout
      </Button>
    </div>
  );
};

export default WorkoutPlanner;
