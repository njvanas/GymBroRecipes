import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';
import Button from './ui/Button';
import Input from './ui/Input';
import Label from './ui/Label';
import { Card, CardHeader, CardContent } from './ui/Card';
import FoodSearch from './FoodSearch';

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

  useEffect(() => {
    async function loadUser() {
      const stored = await get('user');
      setUser(stored || { is_paid: false });
    }
    loadUser();
  }, []);

  const resetForm = () => {
    setMealName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
  };

  const addMeal = () => {
    const newMeal = {
      name: mealName,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
    };
    setMeals([...meals, newMeal]);
    resetForm();
  };

  const handleSelectFood = (food) => {
    setMealName(food.name);
    setCalories(food.calories);
    setProtein(food.protein);
    setCarbs(food.carbs);
    setFats(food.fats);
    setShowSearch(false);
  };

  const removeMeal = (index) => {
    const updated = meals.filter((_, i) => i !== index);
    setMeals(updated);
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
    const log = {
      date: new Date().toISOString().split('T')[0],
      meals,
      ...totals,
    };
    if (!user || !user.is_paid || !supabase) {
      const existing = (await get('nutrition_logs')) || [];
      await set('nutrition_logs', [...existing, log]);
      alert('Nutrition log saved locally');
    } else {
      try {
        const { error } = await supabase.from('nutrition_logs').insert([log]);
        if (error) throw error;
        alert('Nutrition log saved to cloud');
      } catch (err) {
        console.error('Error saving log', err);
      }
    }
    setMeals([]);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold md:text-4xl text-center">Nutrition Tracker</h1>
      <Card className="mt-4">
        <CardContent className="grid grid-cols-5 gap-2">
          <Input
            type="text"
            aria-label="Meal"
            placeholder="Meal"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="col-span-2"
          />
          <Input
            type="number"
            aria-label="Calories"
            placeholder="Cal"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
          <Input
            type="number"
            aria-label="Protein"
            placeholder="Protein"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <Input
            type="number"
            aria-label="Carbs"
            placeholder="Carbs"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
          <Input
            type="number"
            aria-label="Fats"
            placeholder="Fats"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
          />
        </CardContent>
      </Card>
      <div className="flex space-x-2">
        <Button className="flex-1" onClick={addMeal} disabled={!mealName} aria-label="Add Meal">
          Add Meal
        </Button>
        <Button
          className="flex-1 bg-gray-600 hover:bg-gray-700"
          onClick={() => setShowSearch((s) => !s)}
          aria-label="Search food database"
        >
          Search Food
        </Button>
      </div>

      {meals.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <h2 className="text-xl font-semibold md:text-2xl">Today's Meals</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {meals.map((meal, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded"
                >
                  <div>
                    <p className="font-semibold">{meal.name}</p>
                    <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-100">
                      {meal.calories} kcal | P {meal.protein} | C {meal.carbs} | F {meal.fats}
                    </p>
                  </div>
                  <Button
                    className="bg-transparent text-red-600 dark:text-red-400 hover:underline px-2 py-1"
                    onClick={() => removeMeal(idx)}
                    aria-label="Remove meal"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {showSearch && <FoodSearch onSelect={handleSelectFood} />}

      <Card className="mt-4">
        <CardHeader>
          <h2 className="text-xl font-semibold md:text-2xl">Daily Totals</h2>
        </CardHeader>
        <CardContent>
          <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-100">
            Calories: {totals.calories}/{TARGETS.calories}
          </p>
          <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-100">
            Protein: {totals.protein}g/{TARGETS.protein}g
          </p>
          <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-100">
            Carbs: {totals.carbs}g/{TARGETS.carbs}g
          </p>
          <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-100">
            Fats: {totals.fats}g/{TARGETS.fats}g
          </p>
        </CardContent>
      </Card>

      <Button
        className="bg-green-500 hover:bg-green-600 mt-4 w-full"
        onClick={saveLogs}
        disabled={!meals.length}
        aria-label="Save Log"
      >
        Save Log
      </Button>
    </div>
  );
};

export default NutritionTracker;
