import React, { useState } from 'react';
import { Heart, Star, Clock, Users, Timer } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { useRecipeStore } from '../store/recipeStore';
import { RecipeModal } from './RecipeModal';
import { supabase } from '../lib/supabase';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { favorites, toggleFavorite } = useRecipeStore();
  const [showModal, setShowModal] = useState(false);
  const isFavorite = favorites.some((fav) => fav.id === recipe.id);

  const getImageUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
    if (url.startsWith('http')) return url;
    return `${supabase.storage.from('recipe-images').getPublicUrl(url).data.publicUrl}`;
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative">
        <img
          src={getImageUrl(recipe.image)}
          alt={recipe.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
          }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
        {recipe.avgRating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 rounded-full text-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-medium">{recipe.avgRating.toFixed(1)}</span>
            <span className="text-gray-600 dark:text-gray-400">
              ({recipe.reviewCount})
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-full text-left group"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
            {recipe.title}
          </h3>
        </button>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Timer size={16} />
            <span>Prep {recipe.prepTimeMinutes}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>Cook {recipe.cookTimeMinutes}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{recipe.servings} serv</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">Calories</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {Math.round(recipe.caloriesPerServing)}
            </div>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-xs text-green-600 dark:text-green-400">Protein</div>
            <div className="font-semibold text-green-700 dark:text-green-300">
              {Math.round(recipe.proteinPerServing)}g
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {recipe.isVegetarian && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
              Vegetarian
            </span>
          )}
          {recipe.isGlutenFree && (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full">
              Gluten Free
            </span>
          )}
          {recipe.isDairyFree && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
              Dairy Free
            </span>
          )}
        </div>
      </div>

      {showModal && (
        <RecipeModal recipe={recipe} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};