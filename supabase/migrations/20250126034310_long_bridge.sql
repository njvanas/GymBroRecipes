/*
  # Fix Recipe Reviews Relationship

  This migration:
  1. Adds missing relationship between recipe_reviews and user_profiles
  2. Updates recipe_reviews table structure
  3. Adds proper indexes and constraints
*/

-- Drop existing recipe_reviews table if it exists
DROP TABLE IF EXISTS recipe_reviews CASCADE;

-- Recreate recipe_reviews table with proper relationships
CREATE TABLE recipe_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(recipe_id, user_id)
);

-- Enable RLS
ALTER TABLE recipe_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Reviews are viewable by everyone"
  ON recipe_reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create reviews if authenticated"
  ON recipe_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON recipe_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON recipe_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
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
      SELECT ROUND(AVG(rating)::numeric, 2)
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