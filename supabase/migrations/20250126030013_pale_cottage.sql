/*
  # Add Recipe Review Indexes and Update Policies

  1. Changes
    - Add performance indexes for recipe reviews
    - Update trigger for recipe rating calculations

  2. Security
    - Ensure proper index creation
    - Maintain existing security policies
*/

-- Add indexes for better performance (IF NOT EXISTS to avoid errors)
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_recipe_id ON recipe_reviews(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_user_id ON recipe_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_created_at ON recipe_reviews(created_at);

-- Function to update recipe rating
CREATE OR REPLACE FUNCTION update_recipe_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE recipes
  SET 
    avg_rating = (
      SELECT AVG(rating)::decimal(3,2)
      FROM recipe_reviews
      WHERE recipe_id = NEW.recipe_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM recipe_reviews
      WHERE recipe_id = NEW.recipe_id
    )
  WHERE id = NEW.recipe_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating recipe rating
DROP TRIGGER IF EXISTS update_recipe_rating_trigger ON recipe_reviews;
CREATE TRIGGER update_recipe_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON recipe_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_recipe_rating();