/*
  # Fix Measurement and Language System Initialization
  
  1. Changes
    - Add default values for existing user profiles
    - Ensure measurement_system and language_preference are set
*/

-- Update existing user profiles with default values
UPDATE user_profiles
SET 
  measurement_system = COALESCE(measurement_system, 'metric'),
  language_preference = COALESCE(language_preference, 'en')
WHERE measurement_system IS NULL OR language_preference IS NULL;

-- Create function to ensure user preferences are set
CREATE OR REPLACE FUNCTION ensure_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  NEW.measurement_system := COALESCE(NEW.measurement_system, 'metric');
  NEW.language_preference := COALESCE(NEW.language_preference, 'en');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set defaults
DROP TRIGGER IF EXISTS set_user_preferences ON user_profiles;
CREATE TRIGGER set_user_preferences
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_preferences();