import { create } from 'zustand';
import { Recipe, RecipeFilters } from '../types/recipe';
import { recipes as recipeData } from '../data/recipes';
import { toast } from 'react-hot-toast';

interface RecipeStore {
  recipes: Recipe[];
  filters: RecipeFilters;
  favorites: Recipe[];
  isLoading: boolean;
  setRecipes: (recipes: Recipe[]) => void;
  setFilters: (filters: RecipeFilters) => void;
  searchRecipes: (filters: RecipeFilters) => void;
  toggleFavorite: (recipe: Recipe) => void;
  loadFavorites: () => void;
}

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipes: [],
  filters: {
    ingredients: [],
  },
  favorites: [],
  isLoading: false,
  setRecipes: (recipes) => set({ recipes }),
  setFilters: (filters) => {
    set({ filters });
    get().searchRecipes(filters);
  },
  searchRecipes: (filters) => {
    set({ isLoading: true });
    try {
      // Filter recipes based on ingredients
      let filteredRecipes = [...recipeData];
      
      if (filters.ingredients?.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          filters.ingredients.every(ingredient =>
            recipe.extendedIngredients.some(ri => 
              ri.original.toLowerCase().includes(ingredient.toLowerCase())
            )
          )
        );
      }

      // Apply protein filter
      if (filters.minProtein) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.proteinPerServing >= filters.minProtein!
        );
      }

      // Apply calories filter
      if (filters.maxCalories) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.caloriesPerServing <= filters.maxCalories!
        );
      }

      // Apply diet filter
      if (filters.diet) {
        filteredRecipes = filteredRecipes.filter(recipe => {
          switch (filters.diet) {
            case 'vegetarian':
              return recipe.isVegetarian;
            case 'gluten-free':
              return recipe.isGlutenFree;
            case 'dairy-free':
              return recipe.isDairyFree;
            default:
              return true;
          }
        });
      }

      set({ recipes: filteredRecipes, isLoading: false });
      
      if (filteredRecipes.length === 0) {
        toast.error('No recipes found matching your criteria');
      } else {
        toast.success(`Found ${filteredRecipes.length} recipes`);
      }
    } catch (error) {
      toast.error('Failed to search recipes');
      set({ isLoading: false });
    }
  },
  toggleFavorite: (recipe) => {
    set(state => {
      const isFavorite = state.favorites.some(fav => fav.id === recipe.id);
      const newFavorites = isFavorite
        ? state.favorites.filter(fav => fav.id !== recipe.id)
        : [...state.favorites, recipe];
      
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
      return { favorites: newFavorites };
    });
  },
  loadFavorites: () => {
    // For now, favorites are stored in memory
    // This could be enhanced with localStorage or database persistence
  },
}));