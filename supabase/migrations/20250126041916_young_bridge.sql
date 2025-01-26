/*
  # Fix Recipe Storage RLS Policies

  1. Changes
    - Drop existing policies
    - Create new comprehensive policies for recipe_storage table
    - Add missing indexes
    - Ensure proper access control

  2. Security
    - Allow public read access to storage information for all recipes
    - Allow recipe authors to manage storage information
    - Ensure RLS is enabled
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Recipe storage information is viewable by everyone" ON recipe_storage;
DROP POLICY IF EXISTS "Authors can manage recipe storage" ON recipe_storage;

-- Create comprehensive RLS policies for recipe_storage
CREATE POLICY "Anyone can view recipe storage information"
  ON recipe_storage FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create recipe storage information"
  ON recipe_storage FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_storage.recipe_id
  ));

CREATE POLICY "Authors can update recipe storage information"
  ON recipe_storage FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_storage.recipe_id
    AND (author_id = auth.uid() OR author_id IS NULL)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_storage.recipe_id
    AND (author_id = auth.uid() OR author_id IS NULL)
  ));

CREATE POLICY "Authors can delete recipe storage information"
  ON recipe_storage FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_storage.recipe_id
    AND (author_id = auth.uid() OR author_id IS NULL)
  ));

-- Ensure RLS is enabled
ALTER TABLE recipe_storage ENABLE ROW LEVEL SECURITY;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipe_storage_recipe_id ON recipe_storage(recipe_id);