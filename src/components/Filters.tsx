import React from 'react';
import { useRecipeStore } from '../store/recipeStore';

export const Filters = () => {
  const { filters, setFilters } = useRecipeStore();

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Min Protein:</label>
        <select
          value={filters.minProtein || ''}
          onChange={(e) =>
            setFilters({ ...filters, minProtein: Number(e.target.value) || undefined })
          }
          className="px-2 py-1 border rounded-md"
        >
          <option value="">Any</option>
          <option value="20">20g+</option>
          <option value="30">30g+</option>
          <option value="40">40g+</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Max Calories:</label>
        <select
          value={filters.maxCalories || ''}
          onChange={(e) =>
            setFilters({ ...filters, maxCalories: Number(e.target.value) || undefined })
          }
          className="px-2 py-1 border rounded-md"
        >
          <option value="">Any</option>
          <option value="300">Under 300</option>
          <option value="500">Under 500</option>
          <option value="700">Under 700</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Diet:</label>
        <select
          value={filters.diet || ''}
          onChange={(e) =>
            setFilters({ ...filters, diet: e.target.value || undefined })
          }
          className="px-2 py-1 border rounded-md"
        >
          <option value="">Any</option>
          <option value="low-carb">Low Carb</option>
          <option value="keto">Keto</option>
          <option value="paleo">Paleo</option>
        </select>
      </div>
    </div>
  );
};