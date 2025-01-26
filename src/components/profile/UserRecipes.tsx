import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, Eye, Loader } from 'lucide-react';
import { useRecipeStore } from '../../store/recipeStore';
import { supabase } from '../../lib/supabase';
import { Recipe } from '../../types/recipe';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const UserRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile } = useRecipeStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadUserRecipes();
  }, [userProfile]);

  const loadUserRecipes = async () => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_reviews (
            rating
          ),
          recipe_ingredients (
            id, name, amount, unit
          ),
          recipe_instructions (
            id, step_number, instruction
          ),
          recipe_storage (
            storage_instructions, shelf_life_days
          )
        `)
        .eq('author_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRecipes(data || []);
    } catch (error: any) {
      toast.error('Failed to load recipes');
      console.error('Error loading recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      setRecipes(recipes.filter(r => r.id.toString() !== recipeId));
      toast.success('Recipe deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete recipe');
      console.error('Error deleting recipe:', error);
    }
  };

  const handleEdit = (recipe: Recipe) => {
    navigate(`/submit?edit=${recipe.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="animate-spin text-green-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Your Recipes
        </h2>
        <button
          onClick={() => navigate('/submit')}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <Plus size={20} />
          New Recipe
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            You haven't created any recipes yet
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                  alt={recipe.title}
                  className="w-16 h-16 object-cover rounded-xl"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
                  }}
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400" />
                      <span>{recipe.avgRating?.toFixed(1) || 'No ratings'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      <span>{recipe.reviewCount || 0} reviews</span>
                    </div>
                    <span>{recipe.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(recipe)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => deleteRecipe(recipe.id.toString())}
                  className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};