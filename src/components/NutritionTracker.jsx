import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    if (!user || !user.is_paid) {
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
    <div className="max-w-xl mx-auto space-y-4 dark:text-white">
      <h2 className="text-xl font-semibold">Nutrition Tracker</h2>
      <div className="grid grid-cols-5 gap-2">
        <input
          type="text"
          placeholder="Meal"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="border rounded p-2 col-span-2 dark:bg-gray-800"
        />
        <input
          type="number"
          placeholder="Cal"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="border rounded p-2 dark:bg-gray-800"
        />
        <input
          type="number"
          placeholder="Protein"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          className="border rounded p-2 dark:bg-gray-800"
        />
        <input
          type="number"
          placeholder="Carbs"
          value={carbs}
          onChange={(e) => setCarbs(e.target.value)}
          className="border rounded p-2 dark:bg-gray-800"
        />
        <input
          type="number"
          placeholder="Fats"
          value={fats}
          onChange={(e) => setFats(e.target.value)}
          className="border rounded p-2 dark:bg-gray-800"
        />
      </div>
      <button
        className="bg-blue-500 text-white rounded px-4 py-2 w-full"
        onClick={addMeal}
        disabled={!mealName}
      >
        Add Meal
      </button>

      {meals.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Today's Meals</h3>
          <ul className="space-y-1">
            {meals.map((meal, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                <div>
                  <p className="font-semibold">{meal.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {meal.calories} kcal | P {meal.protein} | C {meal.carbs} | F {meal.fats}
                  </p>
                </div>
                <button
                  className="text-red-600 dark:text-red-400"
                  onClick={() => removeMeal(idx)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <h3 className="font-medium mb-2">Daily Totals</h3>
        <p>
          Calories: {totals.calories}/{TARGETS.calories}
        </p>
        <p>
          Protein: {totals.protein}g/{TARGETS.protein}g
        </p>
        <p>
          Carbs: {totals.carbs}g/{TARGETS.carbs}g
        </p>
        <p>
          Fats: {totals.fats}g/{TARGETS.fats}g
        </p>
      </div>

      <button
        className="bg-green-500 text-white rounded px-4 py-2 w-full"
        onClick={saveLogs}
        disabled={!meals.length}
      >
        Save Log
      </button>
    </div>
  );
};

export default NutritionTracker;
