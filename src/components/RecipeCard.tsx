import React from 'react';
import { Heart } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { useRecipeStore } from '../store/recipeStore';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { favorites, toggleFavorite } = useRecipeStore();
  const isFavorite = favorites.some((fav) => fav.id === recipe.id);

  const getNutrientValue = (name: string) => {
    return recipe.nutrition.nutrients.find((n) => n.name === name)?.amount || 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{recipe.title}</h3>
          <button
            onClick={() => toggleFavorite(recipe)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Heart
              size={20}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-medium">Calories:</span>
            <span>{Math.round(getNutrientValue('Calories'))}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Protein:</span>
            <span>{Math.round(getNutrientValue('Protein'))}g</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Carbs:</span>
            <span>{Math.round(getNutrientValue('Carbohydrates'))}g</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Fat:</span>
            <span>{Math.round(getNutrientValue('Fat'))}g</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <span>Ready in {recipe.readyInMinutes} mins</span>
          <span>{recipe.servings} servings</span>
        </div>
      </div>
    </div>
  );
};