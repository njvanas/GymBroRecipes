-- Drop existing policies
DROP POLICY IF EXISTS "Users can view any profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Create comprehensive RLS policies for user_profiles
CREATE POLICY "Users can view any profile"
  ON user_profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Add default values for new columns if they don't exist
DO $$ 
BEGIN
  ALTER TABLE user_profiles 
    ALTER COLUMN measurement_system SET DEFAULT 'metric',
    ALTER COLUMN language_preference SET DEFAULT 'en';
EXCEPTION
  WHEN others THEN NULL;
END $$;