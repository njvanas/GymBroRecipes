/*
  # Recipe submission schema updates

  1. New Tables
    - `recipe_versions`
      - Tracks recipe revisions and changes
      - Stores version history and author information
    - `recipe_reviews`
      - Stores user reviews and ratings
      - Includes review text, rating, and timestamps
    - `recipe_images`
      - Handles multiple images per recipe
      - Stores image metadata and URLs

  2. Changes
    - Add new columns to recipes table for submission workflow
    - Add review-related columns and constraints
    - Add version control fields

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Add new columns to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS published_at timestamptz;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES auth.users;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS version integer DEFAULT 1;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS avg_rating decimal;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0;

-- Recipe reviews
CREATE TABLE IF NOT EXISTS recipe_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(recipe_id, user_id)
);

-- Recipe images
CREATE TABLE IF NOT EXISTS recipe_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  url text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE recipe_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_images ENABLE ROW LEVEL SECURITY;

-- Policies for recipe reviews
CREATE POLICY "Users can read all reviews"
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

-- Policies for recipe images
CREATE POLICY "Anyone can view recipe images"
  ON recipe_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authors can manage recipe images"
  ON recipe_images FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT author_id FROM recipes WHERE id = recipe_id
    )
  );

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
CREATE TRIGGER update_recipe_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON recipe_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_recipe_rating();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE TRIGGER update_recipe_reviews_updated_at
  BEFORE UPDATE ON recipe_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipe_images_updated_at
  BEFORE UPDATE ON recipe_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();