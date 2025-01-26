-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view recipes" ON recipes;
DROP POLICY IF EXISTS "Authenticated users can manage recipes" ON recipes;

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

-- Create more permissive policies for storage
CREATE POLICY "Public recipe images access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'recipe-images');

-- Update recipes to use default image if none exists
UPDATE recipes
SET image_url = CASE
  WHEN image_url IS NULL OR image_url = '' THEN 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
  WHEN image_url NOT LIKE 'http%' THEN 'https://xbqchhogscihzohmcuqr.supabase.co/storage/v1/object/recipe-images/' || image_url
  ELSE image_url
END
WHERE image_url IS NOT NULL;