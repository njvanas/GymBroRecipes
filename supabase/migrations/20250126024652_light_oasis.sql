/*
  # Add foreign key relationships for reviews

  1. Changes
    - Add foreign key relationship between recipe_reviews and user_profiles
    - Add indexes for better query performance
    - Update RLS policies for better security

  2. Security
    - Ensure proper RLS policies for review access
    - Add policies for user profile access
*/

-- Add foreign key relationship
ALTER TABLE recipe_reviews
ADD CONSTRAINT fk_recipe_reviews_user_profiles
FOREIGN KEY (user_id)
REFERENCES auth.users (id)
ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_recipe_id ON recipe_reviews(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_user_id ON recipe_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_created_at ON recipe_reviews(created_at);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can read all reviews" ON recipe_reviews;
DROP POLICY IF EXISTS "Users can create reviews if authenticated" ON recipe_reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON recipe_reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON recipe_reviews;

CREATE POLICY "Anyone can read reviews"
  ON recipe_reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
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

-- Ensure user_profiles policies exist
DROP POLICY IF EXISTS "Users can view any profile" ON user_profiles;
CREATE POLICY "Users can view any profile"
  ON user_profiles FOR SELECT
  TO public
  USING (true);