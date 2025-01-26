import React, { useState } from 'react';
import { Calendar, Plus, ShoppingBag } from 'lucide-react';
import { useRecipeStore } from '../store/recipeStore';
import { Recipe } from '../types/recipe';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export const MealPlanner = () => {
  const { mealPlans, recipes, addToMealPlan, generateShoppingList } = useRecipeStore();
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);

  const currentDate = new Date();
  const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
  
  const currentMealPlan = mealPlans.find(mp => 
    mp.weekStartDate.getTime() === weekStart.getTime()
  );

  const getMealForDayAndType = (day: number, mealType: string) => {
    if (!currentMealPlan) return null;
    return currentMealPlan.items.find(
      item => item.dayOfWeek === day && item.mealType.toLowerCase() === mealType.toLowerCase()
    );
  };

  const handleAddMeal = (day: number, mealType: string) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setShowRecipeSelector(true);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    addToMealPlan(recipe, selectedDay, selectedMealType.toLowerCase());
    setShowRecipeSelector(false);
  };

  const handleGenerateShoppingList = () => {
    if (currentMealPlan) {
      generateShoppingList(currentMealPlan.id);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="text-green-500" size={24} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Meal Plan for Week of {weekStart.toLocaleDateString()}
          </h2>
        </div>
        <button
          onClick={handleGenerateShoppingList}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <ShoppingBag size={20} />
          Generate Shopping List
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map((day, index) => (
          <div key={day} className="space-y-4">
            <div className="text-center p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-100">{day}</h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                {new Date(weekStart.getTime() + index * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>

            {MEAL_TYPES.map(mealType => {
              const meal = getMealForDayAndType(index, mealType);
              const recipe = meal ? recipes.find(r => r.id.toString() === meal.recipeId) : null;

              return (
                <div
                  key={mealType}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-[100px]"
                >
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {mealType}
                  </h4>
                  
                  {recipe ? (
                    <div className="space-y-2">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-20 object-cover rounded-md"
                      />
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {recipe.title}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{recipe.caloriesPerServing} cal</span>
                        <span>{recipe.proteinPerServing}g protein</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddMeal(index, mealType)}
                      className="w-full h-full min-h-[60px] flex items-center justify-center text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {showRecipeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Recipe for {DAYS_OF_WEEK[selectedDay]} - {selectedMealType}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4">
              {recipes.map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => handleSelectRecipe(recipe)}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {recipe.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {recipe.caloriesPerServing} cal · {recipe.proteinPerServing}g protein
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ready in {recipe.readyInMinutes} mins
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 border-t dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setShowRecipeSelector(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};