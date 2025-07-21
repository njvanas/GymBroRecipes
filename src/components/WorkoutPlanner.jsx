import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';
import Button from './ui/Button';
import Input from './ui/Input';
import Label from './ui/Label';
import { Card, CardHeader, CardContent } from './ui/Card';
import { WorkoutIcon, PlusIcon, EditIcon, DeleteIcon, SearchIcon } from './ui/icons';
import TrainingMetrics from './TrainingMetrics';
import ExerciseSearch from './ExerciseSearch';
import { useToast } from './ui/Toast';
import LoadingSpinner from './ui/LoadingSpinner';

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
  'Barbell Row',
  'Dumbbell Press',
  'Leg Press',
  'Lat Pulldown',
  'Shoulder Press',
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
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function loadUser() {
      try {
        const stored = await get('user');
        setUser(stored || { is_paid: false });
      } catch (error) {
        console.error('Error loading user:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [toast]);

  const resetForm = () => {
    setSelectedExercise(exercisesList[0]);
    setSets('');
    setReps('');
    setWeight('');
    setRpe('');
    setEditIndex(null);
  };

  const handleSelectFromSearch = (exercise) => {
    setSelectedExercise(exercise.name);
    setShowSearch(false);
    toast.success(`Added ${exercise.name} to selection`);
  };

  const addExercise = () => {
    if (!sets || !reps) {
      toast.error('Please fill in sets and reps');
      return;
    }

    const newEntry = {
      exercise: selectedExercise,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight) || 0,
      rpe: Number(rpe) || 0,
    };

    if (editIndex !== null) {
      const updated = [...exercises];
      updated[editIndex] = newEntry;
      setExercises(updated);
      toast.success('Exercise updated successfully');
    } else {
      setExercises([...exercises, newEntry]);
      toast.success('Exercise added to workout');
    }
    resetForm();
  };

  const handleEdit = (index) => {
    const entry = exercises[index];
    setSelectedExercise(entry.exercise);
    setSets(entry.sets.toString());
    setReps(entry.reps.toString());
    setWeight(entry.weight.toString());
    setRpe(entry.rpe.toString());
    setEditIndex(index);
  };

  const handleRemove = (index) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
    toast.success('Exercise removed from workout');
  };

  const saveWorkout = async () => {
    if (exercises.length === 0) {
      toast.error('Please add at least one exercise');
      return;
    }

    setSaving(true);
    const workout = {
      date: new Date().toISOString(),
      exercises,
    };

    try {
      if (!user || !user.is_paid || !supabase) {
        const existing = (await get('workouts')) || [];
        await set('workouts', [...existing, workout]);
        toast.success('Workout saved locally');
      } else {
        const { error } = await supabase.from('workouts').insert([workout]);
        if (error) throw error;
        toast.success('Workout saved to cloud');
      }
      setExercises([]);
    } catch (err) {
      console.error('Error saving workout', err);
      toast.error('Failed to save workout');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
          <WorkoutIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          Workout Planner
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Plan and track your workouts with precision. Log exercises, sets, reps, and weights to monitor your strength progress.
        </p>
      </div>

      {/* Exercise Input Form */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PlusIcon className="w-6 h-6 text-green-500" />
            {editIndex !== null ? 'Edit Exercise' : 'Add Exercise'}
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="exercise" className="text-base font-semibold mb-2">Exercise</Label>
            <select
              id="exercise"
              className="input-field text-lg"
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              type="number"
              label="Sets"
              placeholder="3"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              className="text-center text-lg font-semibold"
            />
            <Input
              type="number"
              label="Reps"
              placeholder="10"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="text-center text-lg font-semibold"
            />
            <Input
              type="number"
              label="Weight (kg)"
              placeholder="60"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="text-center text-lg font-semibold"
            />
            <Input
              type="number"
              label="RPE (1-10)"
              placeholder="8"
              value={rpe}
              onChange={(e) => setRpe(e.target.value)}
              className="text-center text-lg font-semibold"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={addExercise} 
              className="flex-1"
              disabled={!sets || !reps}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {editIndex !== null ? 'Update Exercise' : 'Add Exercise'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowSearch(!showSearch)}
              className="flex-1"
            >
              <SearchIcon className="w-5 h-5 mr-2" />
              Search Exercises
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Search */}
      {showSearch && (
        <div className="animate-slide-up">
          <ExerciseSearch onSelect={handleSelectFromSearch} />
        </div>
      )}

      {/* Current Workout */}
      {exercises.length > 0 && (
        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <WorkoutIcon className="w-6 h-6 text-blue-500" />
              Current Workout ({exercises.length} exercises)
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exercises.map((ex, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {ex.exercise}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-lg font-medium">
                        {ex.sets} sets
                      </span>
                      <span className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-lg font-medium">
                        {ex.reps} reps
                      </span>
                      {ex.weight > 0 && (
                        <span className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded-lg font-medium">
                          {ex.weight} kg
                        </span>
                      )}
                      {ex.rpe > 0 && (
                        <span className="bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded-lg font-medium">
                          RPE {ex.rpe}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(idx)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <DeleteIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training Metrics */}
      <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <TrainingMetrics exercises={exercises} />
      </div>

      {/* Save Workout Button */}
      {exercises.length > 0 && (
        <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button
            variant="success"
            size="lg"
            onClick={saveWorkout}
            loading={saving}
            className="px-12 py-4 text-lg font-bold shadow-2xl"
          >
            <WorkoutIcon className="w-6 h-6 mr-2" />
            Save Workout
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanner;