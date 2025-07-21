import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card, CardHeader, CardContent } from './ui/Card';
import { NutritionIcon, PlusIcon, SearchIcon, DeleteIcon, CaloriesIcon } from './ui/icons';
import ProgressBar from './ui/ProgressBar';
import FoodSearch from './FoodSearch';
import { useToast } from './ui/Toast';
import LoadingSpinner from './ui/LoadingSpinner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const TARGETS = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fats: 70,
};

const NutritionTracker = () => {
  const [user, setUser] = useState(null);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [meals, setMeals] = useState([]);
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
    setMealName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
  };

  const addMeal = () => {
    if (!mealName) {
      toast.error('Please enter a meal name');
      return;
    }

    const newMeal = {
      name: mealName,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
    };
    setMeals([...meals, newMeal]);
    toast.success(`Added ${mealName} to today's meals`);
    resetForm();
  };

  const handleSelectFood = (food) => {
    setMealName(food.name);
    setCalories(food.calories.toString());
    setProtein(food.protein.toString());
    setCarbs(food.carbs.toString());
    setFats(food.fats.toString());
    setShowSearch(false);
    toast.success(`Selected ${food.name} from database`);
  };

  const removeMeal = (index) => {
    const mealName = meals[index].name;
    const updated = meals.filter((_, i) => i !== index);
    setMeals(updated);
    toast.success(`Removed ${mealName} from meals`);
  };

  const totals = meals.reduce(
    (acc, m) => {
      acc.calories += m.calories;
      acc.protein += m.protein;
      acc.carbs += m.carbs;
      acc.fats += m.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const saveLogs = async () => {
    if (meals.length === 0) {
      toast.error('Please add at least one meal');
      return;
    }

    setSaving(true);
    const log = {
      date: new Date().toISOString().split('T')[0],
      meals,
      ...totals,
    };

    try {
      if (!user || !user.is_paid || !supabase) {
        const existing = (await get('nutrition_logs')) || [];
        await set('nutrition_logs', [...existing, log]);
        toast.success('Nutrition log saved locally');
      } else {
        const { error } = await supabase.from('nutrition_logs').insert([log]);
        if (error) throw error;
        toast.success('Nutrition log saved to cloud');
      }
      setMeals([]);
    } catch (err) {
      console.error('Error saving log', err);
      toast.error('Failed to save nutrition log');
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-4">
          <NutritionIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          Nutrition Tracker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Track your daily nutrition intake. Log meals, monitor calories and macros to achieve your health goals.
        </p>
      </div>

      {/* Meal Input Form */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PlusIcon className="w-6 h-6 text-orange-500" />
            Add Meal
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Meal Name"
              placeholder="e.g., Grilled Chicken Breast"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="md:col-span-2"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              type="number"
              label="Calories"
              placeholder="250"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="text-center text-lg font-semibold"
            />
            <Input
              type="number"
              label="Protein (g)"
              placeholder="25"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="text-center text-lg font-semibold"
            />
            <Input
              type="number"
              label="Carbs (g)"
              placeholder="30"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              className="text-center text-lg font-semibold"
            />
            <Input
              type="number"
              label="Fats (g)"
              placeholder="10"
              value={fats}
              onChange={(e) => setFats(e.target.value)}
              className="text-center text-lg font-semibold"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={addMeal} 
              className="flex-1"
              disabled={!mealName}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Meal
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowSearch(!showSearch)}
              className="flex-1"
            >
              <SearchIcon className="w-5 h-5 mr-2" />
              Search Food Database
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Food Search */}
      {showSearch && (
        <div className="animate-slide-up">
          <FoodSearch onSelect={handleSelectFood} />
        </div>
      )}

      {/* Daily Progress */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CaloriesIcon className="w-6 h-6 text-blue-500" />
            Daily Progress
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ProgressBar
                value={totals.calories}
                max={TARGETS.calories}
                label={`Calories: ${totals.calories} / ${TARGETS.calories}`}
                color="yellow"
                showLabel
              />
              <ProgressBar
                value={totals.protein}
                max={TARGETS.protein}
                label={`Protein: ${totals.protein}g / ${TARGETS.protein}g`}
                color="red"
                showLabel
              />
            </div>
            <div className="space-y-4">
              <ProgressBar
                value={totals.carbs}
                max={TARGETS.carbs}
                label={`Carbs: ${totals.carbs}g / ${TARGETS.carbs}g`}
                color="blue"
                showLabel
              />
              <ProgressBar
                value={totals.fats}
                max={TARGETS.fats}
                label={`Fats: ${totals.fats}g / ${TARGETS.fats}g`}
                color="purple"
                showLabel
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Meals */}
      {meals.length > 0 && (
        <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <NutritionIcon className="w-6 h-6 text-green-500" />
              Today's Meals ({meals.length})
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {meals.map((meal, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {meal.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-lg font-medium">
                        {meal.calories} kcal
                      </span>
                      <span className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded-lg font-medium">
                        P: {meal.protein}g
                      </span>
                      <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-lg font-medium">
                        C: {meal.carbs}g
                      </span>
                      <span className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded-lg font-medium">
                        F: {meal.fats}g
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMeal(idx)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      {meals.length > 0 && (
        <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button
            variant="success"
            size="lg"
            onClick={saveLogs}
            loading={saving}
            className="px-12 py-4 text-lg font-bold shadow-2xl"
          >
            <NutritionIcon className="w-6 h-6 mr-2" />
            Save Nutrition Log
          </Button>
        </div>
      )}
    </div>
  );
};

export default NutritionTracker;