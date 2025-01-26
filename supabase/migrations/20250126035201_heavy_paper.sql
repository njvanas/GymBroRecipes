/*
  # Add Measurement and Language Support
  
  1. New Tables
    - measurement_systems: Stores available measurement systems
    - languages: Stores supported languages
    - recipe_translations: Stores recipe content in different languages
    
  2. Changes
    - Add measurement_system to user_profiles
    - Add language_preference to user_profiles
    
  3. Default Data
    - English and metric as defaults
    - Support for imperial measurements
*/

-- Create measurement systems table
CREATE TABLE measurement_systems (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create languages table
CREATE TABLE languages (
  id text PRIMARY KEY,
  name text NOT NULL,
  native_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create recipe translations table
CREATE TABLE recipe_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  language_id text REFERENCES languages(id) ON DELETE CASCADE,
  title text NOT NULL,
  instructions text,
  storage_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(recipe_id, language_id)
);

-- Add measurement system and language preference to user profiles
ALTER TABLE user_profiles 
ADD COLUMN measurement_system text REFERENCES measurement_systems(id) DEFAULT 'metric',
ADD COLUMN language_preference text REFERENCES languages(id) DEFAULT 'en';

-- Enable RLS
ALTER TABLE measurement_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_translations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Measurement systems are viewable by everyone"
  ON measurement_systems FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Languages are viewable by everyone"
  ON languages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Recipe translations are viewable by everyone"
  ON recipe_translations FOR SELECT
  TO public
  USING (true);

-- Insert default measurement systems
INSERT INTO measurement_systems (id, name, description) VALUES
  ('metric', 'Metric', 'Uses grams, milliliters, etc.'),
  ('imperial', 'Imperial', 'Uses ounces, cups, etc.');

-- Insert default languages
INSERT INTO languages (id, name, native_name) VALUES
  ('en', 'English', 'English');

-- Create indexes
CREATE INDEX idx_recipe_translations_recipe_id ON recipe_translations(recipe_id);
CREATE INDEX idx_recipe_translations_language_id ON recipe_translations(language_id);

-- Function to convert measurements
CREATE OR REPLACE FUNCTION convert_measurement(
  value decimal,
  from_unit text,
  to_unit text
) RETURNS decimal AS $$
BEGIN
  -- Weight conversions
  IF from_unit = 'g' AND to_unit = 'oz' THEN
    RETURN value * 0.035274;
  ELSIF from_unit = 'oz' AND to_unit = 'g' THEN
    RETURN value * 28.3495;
  
  -- Volume conversions
  ELSIF from_unit = 'ml' AND to_unit = 'fl oz' THEN
    RETURN value * 0.033814;
  ELSIF from_unit = 'fl oz' AND to_unit = 'ml' THEN
    RETURN value * 29.5735;
  
  -- Temperature conversions
  ELSIF from_unit = 'C' AND to_unit = 'F' THEN
    RETURN (value * 9/5) + 32;
  ELSIF from_unit = 'F' AND to_unit = 'C' THEN
    RETURN (value - 32) * 5/9;
  
  -- Return original value if no conversion needed
  ELSE
    RETURN value;
  END IF;
END;
$$ LANGUAGE plpgsql;