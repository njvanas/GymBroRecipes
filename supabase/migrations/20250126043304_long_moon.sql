-- Drop existing policies
DROP POLICY IF EXISTS "Recipe images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own recipe images" ON storage.objects;

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

-- Ensure bucket exists and is public
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('recipe-images', 'recipe-images', true)
  ON CONFLICT (id) DO UPDATE
  SET public = true;
END $$;