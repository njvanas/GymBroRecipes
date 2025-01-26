-- Create storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true);

-- Allow public access to recipe images
CREATE POLICY "Recipe images are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'recipe-images');

-- Allow authenticated users to upload recipe images
CREATE POLICY "Users can upload recipe images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'recipe-images'
    AND (storage.foldername(name))[1] != 'private'
  );

-- Allow users to update their own recipe images
CREATE POLICY "Users can update their own recipe images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'recipe-images' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'recipe-images' AND owner = auth.uid());

-- Allow users to delete their own recipe images
CREATE POLICY "Users can delete their own recipe images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'recipe-images' AND owner = auth.uid());