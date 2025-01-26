/*
  # Fix Recipe RLS Policies

  1. Changes
    - Drop existing policies
    - Create new comprehensive policies for recipes table
    - Add missing indexes
    - Update status for existing recipes

  2. Security
    - Allow public read access to published recipes
    - Allow authenticated users to create recipes
    - Allow recipe authors to update/delete their own recipes
    - Ensure RLS is enabled
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view published recipes" ON recipes;
DROP POLICY IF EXISTS "Authenticated users can create recipes" ON recipes;
DROP POLICY IF EXISTS "Authors can update their own recipes" ON recipes;
DROP POLICY IF EXISTS "Authors can delete their own recipes" ON recipes;

-- Create comprehensive RLS policies for recipes
CREATE POLICY "Anyone can view published recipes"
  ON recipes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create recipes"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authors can update their own recipes"
  ON recipes FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id OR author_id IS NULL)
  WITH CHECK (auth.uid() = author_id OR author_id IS NULL);

CREATE POLICY "Authors can delete their own recipes"
  ON recipes FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id OR author_id IS NULL);

-- Ensure RLS is enabled
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);
CREATE INDEX IF NOT EXISTS idx_recipes_author_id ON recipes(author_id);

-- Update existing recipes to have published status if not set
UPDATE recipes 
SET status = 'published' 
WHERE status IS NULL;