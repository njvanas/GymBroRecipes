import { supabase } from '../lib/supabase';
import { Recipe, RecipeFilters } from '../types/recipe';

export async function searchRecipes(filters: RecipeFilters): Promise<Recipe[]> {
  let query = supabase
    .from('recipes')
    .select(`
      *,
      recipe_instructions (
        step_number,
        instruction
      ),
      recipe_storage (
        storage_instructions,
        shelf_life_days
      ),
      recipe_nutrients (*),
      recipe_ingredients (*)
    `);

  // Apply filters
  if (filters.ingredients?.length > 0) {
    query = query.contains('recipe_ingredients.name', filters.ingredients);
  }

  if (filters.minProtein) {
    query = query.gte('protein_per_serving', filters.minProtein);
  }

  if (filters.maxCalories) {
    query = query.lte('calories_per_serving', filters.maxCalories);
  }

  if (filters.diet === 'vegetarian') {
    query = query.eq('is_vegetarian', true);
  } else if (filters.diet === 'gluten-free') {
    query = query.eq('is_gluten_free', true);
  } else if (filters.diet === 'dairy-free') {
    query = query.eq('is_dairy_free', true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Failed to fetch recipes');
  }

  return data as unknown as Recipe[];
}

export async function toggleFavoriteRecipe(recipeId: number, userId: string) {
  const { data: existingFavorite } = await supabase
    .from('user_favorites')
    .select()
    .eq('recipe_id', recipeId)
    .eq('user_id', userId)
    .single();

  if (existingFavorite) {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('recipe_id', recipeId)
      .eq('user_id', userId);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('user_favorites')
      .insert({ recipe_id: recipeId, user_id: userId });

    if (error) throw error;
  }
}

export async function getFavoriteRecipes(userId: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('user_favorites')
    .select(`
      recipes (
        *,
        recipe_instructions (
          step_number,
          instruction
        ),
        recipe_storage (
          storage_instructions,
          shelf_life_days
        ),
        recipe_nutrients (*),
        recipe_ingredients (*)
      )
    `)
    .eq('user_id', userId);

  if (error) {
    throw new Error('Failed to fetch favorite recipes');
  }

  return (data?.map(d => d.recipes) || []) as unknown as Recipe[];
}