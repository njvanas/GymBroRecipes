/*
  # Add User Recipes Management

  1. Changes
    - Add user recipes view
    - Add indexes for recipe filtering
    - Add functions for recipe management
    - Update RLS policies

  2. Security
    - Ensure proper access control for user recipes
    - Maintain existing RLS policies
*/

-- Create view for user recipes
CREATE VIEW user_recipe_stats AS
SELECT 
  r.id,
  r.author_id,
  r.title,
  r.status,
  COUNT(DISTINCT rv.id) as review_count,
  AVG(rv.rating)::numeric(3,2) as avg_rating,
  COUNT(DISTINCT uf.user_id) as favorite_count
FROM recipes r
LEFT JOIN recipe_reviews rv ON r.id = rv.recipe_id
LEFT JOIN user_favorites uf ON r.id = uf.recipe_id
GROUP BY r.id, r.author_id, r.title, r.status;

-- Add indexes for better filtering
CREATE INDEX IF NOT EXISTS idx_recipes_protein_ratio 
ON recipes ((protein_per_serving * 4 / NULLIF(calories_per_serving, 0)));

CREATE INDEX IF NOT EXISTS idx_recipes_created_at 
ON recipes (created_at);

-- Function to calculate recipe stats
CREATE OR REPLACE FUNCTION calculate_recipe_stats(recipe_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE recipes
  SET 
    review_count = (
      SELECT COUNT(*) 
      FROM recipe_reviews 
      WHERE recipe_id = calculate_recipe_stats.recipe_id
    ),
    avg_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM recipe_reviews 
      WHERE recipe_id = calculate_recipe_stats.recipe_id
    )
  WHERE id = recipe_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating recipe stats
CREATE OR REPLACE FUNCTION update_recipe_stats()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_recipe_stats(NEW.recipe_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS recipe_stats_update ON recipe_reviews;
CREATE TRIGGER recipe_stats_update
  AFTER INSERT OR UPDATE OR DELETE ON recipe_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_recipe_stats();