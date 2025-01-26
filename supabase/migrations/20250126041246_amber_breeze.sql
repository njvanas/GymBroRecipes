-- Drop existing policies
DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON recipes;

-- Create comprehensive RLS policies for recipes
CREATE POLICY "Anyone can view published recipes"
  ON recipes FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authenticated users can create recipes"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own recipes"
  ON recipes FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own recipes"
  ON recipes FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Ensure RLS is enabled
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);
CREATE INDEX IF NOT EXISTS idx_recipes_author_id ON recipes(author_id);

-- Update existing recipes to have published status if not set
UPDATE recipes 
SET status = 'published' 
WHERE status IS NULL;