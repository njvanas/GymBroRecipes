import { create } from 'zustand';
import { Recipe, RecipeFilters, UserProfile, MealPlan, ShoppingList } from '../types/recipe';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface RecipeStore {
  recipes: Recipe[];
  filters: RecipeFilters;
  favorites: Recipe[];
  userProfile: UserProfile | null;
  mealPlans: MealPlan[];
  shoppingLists: ShoppingList[];
  theme: 'dark' | 'light';
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  setRecipes: (recipes: Recipe[]) => void;
  setFilters: (filters: RecipeFilters) => void;
  searchRecipes: (filters: RecipeFilters, loadMore?: boolean) => Promise<void>;
  toggleFavorite: (recipe: Recipe) => void;
  loadFavorites: () => void;
  setUserProfile: (profile: UserProfile) => void;
  loadUserProfile: () => Promise<void>;
  toggleTheme: () => void;
  addToMealPlan: (recipe: Recipe, dayOfWeek: number, mealType: string) => void;
  generateShoppingList: (mealPlanId: string) => void;
  toggleShoppingItem: (listId: string, itemId: string) => void;
  updateRecipe: (recipe: Recipe) => Promise<void>;
}

const RECIPES_PER_PAGE = 10;

const mapDbRecipeToModel = (dbRecipe: any): Recipe => ({
  id: dbRecipe.id,
  title: dbRecipe.title,
  image: dbRecipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  readyInMinutes: dbRecipe.ready_in_minutes || 30,
  servings: dbRecipe.servings || 2,
  prepTimeMinutes: dbRecipe.prep_time_minutes || 15,
  cookTimeMinutes: dbRecipe.cook_time_minutes || 15,
  totalTimeMinutes: dbRecipe.total_time_minutes || 30,
  difficultyLevel: dbRecipe.difficulty_level || 'medium',
  isVegetarian: dbRecipe.is_vegetarian || false,
  isGlutenFree: dbRecipe.is_gluten_free || false,
  isDairyFree: dbRecipe.is_dairy_free || false,
  mealType: dbRecipe.meal_type || 'dinner',
  caloriesPerServing: dbRecipe.calories_per_serving || 0,
  proteinPerServing: dbRecipe.protein_per_serving || 0,
  carbsPerServing: dbRecipe.carbs_per_serving || 0,
  fatPerServing: dbRecipe.fat_per_serving || 0,
  fiberPerServing: dbRecipe.fiber_per_serving || 0,
  instructions: dbRecipe.instructions || '',
  avgRating: dbRecipe.avg_rating,
  reviewCount: dbRecipe.review_count || 0,
  nutrition: {
    nutrients: [
      { name: 'Calories', amount: dbRecipe.calories_per_serving || 0, unit: 'kcal' },
      { name: 'Protein', amount: dbRecipe.protein_per_serving || 0, unit: 'g' },
      { name: 'Carbohydrates', amount: dbRecipe.carbs_per_serving || 0, unit: 'g' },
      { name: 'Fat', amount: dbRecipe.fat_per_serving || 0, unit: 'g' },
      { name: 'Fiber', amount: dbRecipe.fiber_per_serving || 0, unit: 'g' }
    ]
  },
  extendedIngredients: dbRecipe.recipe_ingredients?.map((i: any) => ({
    id: i.id,
    original: i.name,
    amount: i.amount,
    unit: i.unit
  })) || [],
  proteinRatio: dbRecipe.protein_per_serving ? (dbRecipe.protein_per_serving * 4) / dbRecipe.calories_per_serving : 0,
  version: dbRecipe.version || 1,
  status: dbRecipe.status || 'published'
});

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipes: [],
  filters: {},
  favorites: [],
  userProfile: null,
  mealPlans: [],
  shoppingLists: [],
  theme: 'dark',
  isLoading: false,
  hasMore: true,
  page: 1,

  setRecipes: (recipes) => set({ recipes }),
  
  setFilters: (filters) => {
    set({ filters, page: 1, recipes: [], hasMore: true });
    get().searchRecipes(filters);
  },

  searchRecipes: async (filters, loadMore = false) => {
    const state = get();
    if (state.isLoading || (!loadMore && !state.hasMore)) return;
    
    set({ isLoading: true });
    
    try {
      const currentPage = loadMore ? state.page : 1;
      const from = (currentPage - 1) * RECIPES_PER_PAGE;
      const to = from + RECIPES_PER_PAGE - 1;

      let query = supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            id, name, amount, unit
          )
        `)
        .eq('status', 'published')
        .range(from, to);

      // Apply filters
      if (filters.minProtein) {
        query = query.gte('protein_per_serving', filters.minProtein);
      }

      if (filters.maxCalories) {
        query = query.lte('calories_per_serving', filters.maxCalories);
      }

      if (filters.mealType) {
        query = query.eq('meal_type', filters.mealType);
      }

      if (filters.diet === 'vegetarian') {
        query = query.eq('is_vegetarian', true);
      } else if (filters.diet === 'gluten-free') {
        query = query.eq('is_gluten_free', true);
      } else if (filters.diet === 'dairy-free') {
        query = query.eq('is_dairy_free', true);
      }

      // Order by protein ratio for high-protein focus
      query = query.order('protein_per_serving', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      // Map database records to frontend model
      const recipes = (data || []).map(mapDbRecipeToModel);

      // Apply client-side filters for ingredients
      let filteredRecipes = recipes;

      if (filters.ingredients?.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          filters.ingredients.every(ingredient =>
            recipe.extendedIngredients.some(ri => 
              ri.original.toLowerCase().includes(ingredient.toLowerCase())
            )
          )
        );
      }

      if (filters.excludeIngredients?.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          !filters.excludeIngredients?.some(ingredient =>
            recipe.extendedIngredients.some(ri =>
              ri.original.toLowerCase().includes(ingredient.toLowerCase())
            )
          )
        );
      }

      set(state => ({
        recipes: loadMore ? [...state.recipes, ...filteredRecipes] : filteredRecipes,
        hasMore: filteredRecipes.length === RECIPES_PER_PAGE,
        page: currentPage + 1,
        isLoading: false
      }));

      if (!loadMore && filteredRecipes.length === 0) {
        toast.error('No recipes found matching your criteria');
      }
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load recipes. Please try again.');
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

  loadFavorites: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_favorites')
        .select('recipe_id')
        .eq('user_id', user.id);

      if (error) throw error;

      // Load full recipe details for favorites
      const recipeIds = data.map(f => f.recipe_id);
      if (recipeIds.length === 0) return;

      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', recipeIds);

      if (recipesError) throw recipesError;

      set({ favorites: recipes.map(mapDbRecipeToModel) });
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  },

  setUserProfile: (profile) => set({ userProfile: profile }),

  loadUserProfile: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (profile) {
        set({
          userProfile: {
            id: profile.id,
            displayName: profile.display_name,
            fitnessGoals: profile.fitness_goals || [],
            dietaryRestrictions: profile.dietary_restrictions || [],
            proteinTarget: profile.protein_target || 150,
            calorieTarget: profile.calorie_target || 2000,
            preferredTheme: profile.preferred_theme || 'dark',
            measurementSystem: profile.measurement_system || 'metric',
            languagePreference: profile.language_preference || 'en'
          }
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  },

  toggleTheme: () => set(state => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),

  addToMealPlan: (recipe, dayOfWeek, mealType) => {
    set(state => {
      const currentDate = new Date();
      const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
      
      let mealPlan = state.mealPlans.find(mp => 
        mp.weekStartDate.getTime() === weekStart.getTime()
      );

      if (!mealPlan) {
        mealPlan = {
          id: crypto.randomUUID(),
          userId: state.userProfile?.id || '',
          weekStartDate: weekStart,
          name: `Week of ${weekStart.toLocaleDateString()}`,
          items: []
        };
      }

      const newItem = {
        id: crypto.randomUUID(),
        mealPlanId: mealPlan.id,
        recipeId: recipe.id.toString(),
        dayOfWeek,
        mealType,
        servings: 1
      };

      const updatedMealPlan = {
        ...mealPlan,
        items: [...mealPlan.items, newItem]
      };

      const updatedMealPlans = state.mealPlans.map(mp =>
        mp.id === mealPlan?.id ? updatedMealPlan : mp
      );

      if (!state.mealPlans.find(mp => mp.id === mealPlan.id)) {
        updatedMealPlans.push(updatedMealPlan);
      }

      toast.success('Added to meal plan');
      return { mealPlans: updatedMealPlans };
    });
  },

  generateShoppingList: (mealPlanId) => {
    set(state => {
      const mealPlan = state.mealPlans.find(mp => mp.id === mealPlanId);
      if (!mealPlan) return state;

      const ingredients = mealPlan.items.flatMap(item => {
        const recipe = state.recipes.find(r => r.id.toString() === item.recipeId);
        return recipe?.extendedIngredients.map(ing => ({
          name: ing.original,
          amount: ing.amount * item.servings,
          unit: ing.unit,
          category: 'Uncategorized'
        })) || [];
      });

      const newList: ShoppingList = {
        id: crypto.randomUUID(),
        userId: state.userProfile?.id || '',
        mealPlanId,
        name: `Shopping List for ${mealPlan.name}`,
        status: 'active',
        items: ingredients.map(ing => ({
          id: crypto.randomUUID(),
          shoppingListId: '',
          ingredientName: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          category: ing.category,
          isChecked: false
        }))
      };

      newList.items.forEach(item => {
        item.shoppingListId = newList.id;
      });

      toast.success('Shopping list generated');
      return { shoppingLists: [...state.shoppingLists, newList] };
    });
  },

  toggleShoppingItem: (listId, itemId) => {
    set(state => {
      const updatedLists = state.shoppingLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.map(item => {
              if (item.id === itemId) {
                return { ...item, isChecked: !item.isChecked };
              }
              return item;
            })
          };
        }
        return list;
      });

      return { shoppingLists: updatedLists };
    });
  },

  updateRecipe: async (recipe: Recipe) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .update({
          title: recipe.title,
          image_url: recipe.image,
          prep_time_minutes: recipe.prepTimeMinutes,
          cook_time_minutes: recipe.cookTimeMinutes,
          total_time_minutes: recipe.totalTimeMinutes,
          servings: recipe.servings,
          is_vegetarian: recipe.isVegetarian,
          is_gluten_free: recipe.isGlutenFree,
          is_dairy_free: recipe.isDairyFree,
          meal_type: recipe.mealType,
          calories_per_serving: recipe.caloriesPerServing,
          protein_per_serving: recipe.proteinPerServing,
          carbs_per_serving: recipe.carbsPerServing,
          fat_per_serving: recipe.fatPerServing,
          fiber_per_serving: recipe.fiberPerServing,
          instructions: recipe.instructions,
          status: recipe.status
        })
        .eq('id', recipe.id);

      if (error) throw error;

      // Update ingredients
      await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', recipe.id);

      await supabase
        .from('recipe_ingredients')
        .insert(recipe.extendedIngredients.map(ing => ({
          recipe_id: recipe.id,
          name: ing.original,
          amount: ing.amount,
          unit: ing.unit
        })));

      toast.success('Recipe updated successfully');
    } catch (error: any) {
      toast.error('Failed to update recipe');
      console.error('Error updating recipe:', error);
    }
  }
}));