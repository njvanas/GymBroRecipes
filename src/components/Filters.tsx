import React from 'react';
import { useRecipeStore } from '../store/recipeStore';
import { Filter } from 'lucide-react';

export const Filters = () => {
  const { filters, setFilters } = useRecipeStore();

  return (
    <div className="w-full max-w-3xl">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-gray-500 dark:text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Advanced Filters
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Min Protein
          </label>
          <select
            value={filters.minProtein || ''}
            onChange={(e) =>
              setFilters({ ...filters, minProtein: Number(e.target.value) || undefined })
            }
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200"
          >
            <option value="">Any</option>
            <option value="20">20g+</option>
            <option value="30">30g+</option>
            <option value="40">40g+</option>
            <option value="50">50g+</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Max Calories
          </label>
          <select
            value={filters.maxCalories || ''}
            onChange={(e) =>
              setFilters({ ...filters, maxCalories: Number(e.target.value) || undefined })
            }
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200"
          >
            <option value="">Any</option>
            <option value="300">Under 300</option>
            <option value="500">Under 500</option>
            <option value="700">Under 700</option>
            <option value="900">Under 900</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Min Protein Ratio
          </label>
          <select
            value={filters.minProteinRatio || ''}
            onChange={(e) =>
              setFilters({ ...filters, minProteinRatio: Number(e.target.value) || undefined })
            }
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200"
          >
            <option value="">Any</option>
            <option value="0.3">30%+</option>
            <option value="0.4">40%+</option>
            <option value="0.5">50%+</option>
            <option value="0.6">60%+</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Max Cooking Time
          </label>
          <select
            value={filters.cookingTime || ''}
            onChange={(e) =>
              setFilters({ ...filters, cookingTime: Number(e.target.value) || undefined })
            }
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200"
          >
            <option value="">Any</option>
            <option value="15">15 mins</option>
            <option value="30">30 mins</option>
            <option value="45">45 mins</option>
            <option value="60">60 mins</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Meal Type
          </label>
          <select
            value={filters.mealType || ''}
            onChange={(e) =>
              setFilters({ ...filters, mealType: e.target.value || undefined })
            }
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200"
          >
            <option value="">Any</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Diet
          </label>
          <select
            value={filters.diet || ''}
            onChange={(e) =>
              setFilters({ ...filters, diet: e.target.value || undefined })
            }
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200"
          >
            <option value="">Any</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="gluten-free">Gluten Free</option>
            <option value="dairy-free">Dairy Free</option>
          </select>
        </div>
      </div>
    </div>
  );
};