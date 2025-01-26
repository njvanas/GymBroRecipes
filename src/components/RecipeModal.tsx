import React, { useState } from 'react';
import { X, Timer, Users, Printer, Share2, Scale, Star, Clock } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { RecipeReviews } from './recipe/RecipeReviews';
import { supabase } from '../lib/supabase';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const [servings, setServings] = useState(recipe.servings);
  const [activeTab, setActiveTab] = useState<'instructions' | 'nutrition' | 'reviews'>('instructions');

  const getImageUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
    if (url.startsWith('http')) return url;
    return `${supabase.storage.from('recipe-images').getPublicUrl(url).data.publicUrl}`;
  };

  const scaleIngredient = (amount: number) => {
    return (amount * servings) / recipe.servings;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: recipe.title,
        text: `Check out this high-protein recipe: ${recipe.title}`,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const instructions = recipe.instructions.split('\n').filter(step => step.trim());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-6xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
          >
            <X size={20} />
          </button>

          <div className="grid md:grid-cols-2">
            {/* Left side - Fixed height image */}
            <div className="relative h-[600px] overflow-hidden">
              <img
                src={getImageUrl(recipe.image)}
                alt={recipe.title}
                className="absolute inset-0 w-full h-full object-cover rounded-l-xl"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
                }}
              />
              {recipe.avgRating && (
                <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{recipe.avgRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({recipe.reviewCount})
                  </span>
                </div>
              )}
            </div>

            {/* Right side - Content */}
            <div className="h-[600px] flex flex-col">
              {/* Fixed header section */}
              <div className="p-6 border-b dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {recipe.title}
                </h2>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Timer size={18} />
                    <span>Prep {recipe.prepTimeMinutes}m</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock size={18} />
                    <span>Cook {recipe.cookTimeMinutes}m</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users size={18} />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setServings(Math.max(1, servings - 1))}
                        className="px-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        -
                      </button>
                      <span>{servings} servings</span>
                      <button
                        onClick={() => setServings(servings + 1)}
                        className="px-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <Printer size={18} />
                    Print
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b dark:border-gray-800">
                <div className="flex gap-6 px-6">
                  <button
                    onClick={() => setActiveTab('instructions')}
                    className={`px-4 py-2 border-b-2 transition-colors ${
                      activeTab === 'instructions'
                        ? 'border-green-500 text-green-500'
                        : 'border-transparent text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Instructions
                  </button>
                  <button
                    onClick={() => setActiveTab('nutrition')}
                    className={`px-4 py-2 border-b-2 transition-colors ${
                      activeTab === 'nutrition'
                        ? 'border-green-500 text-green-500'
                        : 'border-transparent text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Nutrition
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-4 py-2 border-b-2 transition-colors ${
                      activeTab === 'reviews'
                        ? 'border-green-500 text-green-500'
                        : 'border-transparent text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Reviews
                  </button>
                </div>
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-6">
                  {activeTab === 'instructions' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
                        <ul className="space-y-3">
                          {recipe.extendedIngredients.map((ingredient, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                            >
                              <Scale size={18} className="text-gray-400 flex-shrink-0" />
                              <span>
                                {scaleIngredient(ingredient.amount).toFixed(1)} {ingredient.unit}{' '}
                                {ingredient.original}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Steps</h3>
                        <ol className="space-y-4">
                          {instructions.map((step, index) => (
                            <li
                              key={index}
                              className="flex gap-4 text-gray-700 dark:text-gray-300"
                            >
                              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 flex items-center justify-center text-lg font-medium">
                                {index + 1}
                              </span>
                              <span className="mt-1">{step.replace(/^\d+\.\s*/, '')}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}

                  {activeTab === 'nutrition' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Calories
                          </div>
                          <div className="text-xl font-semibold text-gray-900 dark:text-white">
                            {Math.round(recipe.caloriesPerServing * servings / recipe.servings)}
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Protein
                          </div>
                          <div className="text-xl font-semibold text-gray-900 dark:text-white">
                            {Math.round(recipe.proteinPerServing * servings / recipe.servings)}g
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Carbs
                          </div>
                          <div className="text-xl font-semibold text-gray-900 dark:text-white">
                            {Math.round(recipe.carbsPerServing * servings / recipe.servings)}g
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Fat
                          </div>
                          <div className="text-xl font-semibold text-gray-900 dark:text-white">
                            {Math.round(recipe.fatPerServing * servings / recipe.servings)}g
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h4 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                          Protein Ratio
                        </h4>
                        <div className="text-green-600 dark:text-green-400">
                          {Math.round((recipe.proteinPerServing * 4 * 100) / recipe.caloriesPerServing)}%
                          of total calories from protein
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      <RecipeReviews
                        recipeId={recipe.id.toString()}
                        avgRating={recipe.avgRating}
                        reviewCount={recipe.reviewCount}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};