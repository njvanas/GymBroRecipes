-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view published recipes" ON recipes;
DROP POLICY IF EXISTS "Authenticated users can create recipes" ON recipes;
DROP POLICY IF EXISTS "Authors can update their own recipes" ON recipes;
DROP POLICY IF EXISTS "Authors can delete their own recipes" ON recipes;

-- Create more permissive policies for recipes
CREATE POLICY "Anyone can view recipes"
  ON recipes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage recipes"
  ON recipes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure all recipes are visible in search
UPDATE recipes
SET status = 'published'
WHERE status IS NULL OR status = 'draft';

-- Fix recipe images
UPDATE recipes
SET image_url = COALESCE(
  image_url,
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
);

-- Ensure storage bucket exists with proper permissions
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('recipe-images', 'recipe-images', true)
  ON CONFLICT (id) DO UPDATE
  SET public = true;
END $$;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Recipe images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete recipe images" ON storage.objects;

-- Create more permissive policies for recipe images
CREATE POLICY "Recipe images are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload recipe images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can update recipe images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'recipe-images')
  WITH CHECK (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can delete recipe images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'recipe-images');

-- Reindex for better performance
REINDEX INDEX idx_recipes_protein;
REINDEX INDEX idx_recipes_calories;
REINDEX INDEX idx_recipes_meal_type;
REINDEX INDEX idx_recipes_status;