-- Drop existing policies
DROP POLICY IF EXISTS "Recipe nutrients are viewable by everyone" ON recipe_nutrients;

-- Create comprehensive RLS policies for recipe_nutrients
CREATE POLICY "Anyone can view recipe nutrients"
  ON recipe_nutrients FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage recipe nutrients"
  ON recipe_nutrients FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_nutrients.recipe_id
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE id = recipe_nutrients.recipe_id
  ));

-- Ensure RLS is enabled
ALTER TABLE recipe_nutrients ENABLE ROW LEVEL SECURITY;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipe_nutrients_recipe_id ON recipe_nutrients(recipe_id);