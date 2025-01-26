/*
  # Clear Recipe Data

  This migration safely removes all recipe-related data while maintaining referential integrity.
  
  1. Changes
    - Removes all recipe-related data in the correct order
    - Preserves table structure and relationships
    - Avoids system trigger conflicts
  
  2. Safety
    - Uses cascading deletes where appropriate
    - Maintains referential integrity
    - Preserves table structure
*/

-- Clear recipe data in the correct order to maintain referential integrity
DELETE FROM user_favorites;
DELETE FROM recipe_reviews;
DELETE FROM recipe_nutrients;
DELETE FROM recipe_ingredients;
DELETE FROM recipe_instructions;
DELETE FROM recipe_storage;
DELETE FROM recipe_images;
DELETE FROM recipe_versions;
DELETE FROM meal_plan_items;
DELETE FROM recipes;

-- Verify tables are empty using counts
DO $$ 
BEGIN
  ASSERT (SELECT COUNT(*) FROM recipes) = 0, 'Recipes table is not empty';
  ASSERT (SELECT COUNT(*) FROM recipe_nutrients) = 0, 'Recipe nutrients table is not empty';
  ASSERT (SELECT COUNT(*) FROM recipe_ingredients) = 0, 'Recipe ingredients table is not empty';
  ASSERT (SELECT COUNT(*) FROM recipe_instructions) = 0, 'Recipe instructions table is not empty';
  ASSERT (SELECT COUNT(*) FROM recipe_storage) = 0, 'Recipe storage table is not empty';
  ASSERT (SELECT COUNT(*) FROM recipe_reviews) = 0, 'Recipe reviews table is not empty';
  ASSERT (SELECT COUNT(*) FROM recipe_images) = 0, 'Recipe images table is not empty';
  ASSERT (SELECT COUNT(*) FROM user_favorites) = 0, 'User favorites table is not empty';
  ASSERT (SELECT COUNT(*) FROM meal_plan_items) = 0, 'Meal plan items table is not empty';
END $$;