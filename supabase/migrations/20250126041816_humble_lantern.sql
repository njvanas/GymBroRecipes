/*
  # Fix Recipe Instructions RLS Policies

  1. Changes
    - Drop existing policies
    - Create new comprehensive policies for recipe_instructions table
    - Add missing indexes
    - Ensure proper access control

  2. Security
    - Allow public read access to instructions for all recipes
    - Allow recipe authors to manage instructions
    - Ensure RLS is enabled
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Recipe instructions are viewable by everyone" ON recipe_instructions;
DROP POLICY IF EXISTS "Authors can manage recipe instructions" ON recipe_instructions;

-- Create comprehensive RLS policies for recipe_instructions
CREATE POLICY "Anyone can view recipe instructions"
  ON recipe_instructions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create recipe instructions"
  ON recipe_instructions FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_instructions.recipe_id
  ));

CREATE POLICY "Authors can update recipe instructions"
  ON recipe_instructions FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_instructions.recipe_id
    AND (author_id = auth.uid() OR author_id IS NULL)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_instructions.recipe_id
    AND (author_id = auth.uid() OR author_id IS NULL)
  ));

CREATE POLICY "Authors can delete recipe instructions"
  ON recipe_instructions FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_instructions.recipe_id
    AND (author_id = auth.uid() OR author_id IS NULL)
  ));

-- Ensure RLS is enabled
ALTER TABLE recipe_instructions ENABLE ROW LEVEL SECURITY;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipe_instructions_recipe_id ON recipe_instructions(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_instructions_step_number ON recipe_instructions(step_number);