/*
  # Fix Recipe Ingredients RLS Policies

  1. Changes
    - Drop existing policies
    - Create new comprehensive policies for recipe_ingredients table
    - Add missing indexes
    - Ensure proper access control

  2. Security
    - Allow public read access to ingredients for published recipes
    - Allow recipe authors to manage ingredients
    - Ensure RLS is enabled
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Recipe ingredients are viewable by everyone" ON recipe_ingredients;
DROP POLICY IF EXISTS "Authors can manage recipe ingredients" ON recipe_ingredients;

-- Create comprehensive RLS policies for recipe_ingredients
CREATE POLICY "Anyone can view recipe ingredients"
  ON recipe_ingredients FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create recipe ingredients"
  ON recipe_ingredients FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_ingredients.recipe_id
  ));

CREATE POLICY "Authors can update recipe ingredients"
  ON recipe_ingredients FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_ingredients.recipe_id
    AND (author_id = auth.uid() OR author_id IS NULL)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_ingredients.recipe_id
    AND (author_id = auth.uid() OR author_id IS NULL)
  ));

CREATE POLICY "Authors can delete recipe ingredients"
  ON recipe_ingredients FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_ingredients.recipe_id
    AND (author_id = auth.uid() OR author_id IS NULL)
  ));

-- Ensure RLS is enabled
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);