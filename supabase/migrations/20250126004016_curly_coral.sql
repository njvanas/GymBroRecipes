/*
  # Add detailed recipe information

  1. New Tables
    - `recipe_instructions`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, foreign key)
      - `step_number` (integer)
      - `instruction` (text)
    - `recipe_storage`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, foreign key)
      - `storage_instructions` (text)
      - `shelf_life_days` (integer)

  2. Modifications
    - Add columns to `recipes`:
      - `prep_time_minutes`
      - `cook_time_minutes`
      - `total_time_minutes`
      - `difficulty_level`
      - `is_vegetarian`
      - `is_gluten_free`
      - `is_dairy_free`
      - `meal_type` (breakfast/lunch/dinner)
      - `calories_per_serving`
      - `protein_per_serving`
      - `carbs_per_serving`
      - `fat_per_serving`
      - `fiber_per_serving`

  3. Security
    - Enable RLS on new tables
    - Add policies for public read access
*/

-- Add new columns to recipes table
DO $$ 
BEGIN
  ALTER TABLE recipes ADD COLUMN IF NOT EXISTS prep_time_minutes integer;
  ALTER TABLE recipes ADD COLUMN IF NOT EXISTS cook_time_minutes integer;
  ALTER TABLE recipes ADD COLUMN IF NOT EXISTS total_time_minutes integer;
  ALTER TABLE recipes ADD COLUMN IF NOT EXISTS difficulty_level text;
  ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_vegetarian boolean DEFAULT false;
  ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_gluten_free boolean DEFAULT false;
  ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_dairy_free boolean DEFAULT false;
  ALTER TABLE recipes ADD COLUMN IF NOT EXISTS meal_type text;
  ALTER TABLE recipes ADD COLUMN IF NOT EXISTS calories_per_serving integer;
  ALTER TABLE recipes ADD COLUMN IF NOT EXISTS protein_per_serving decimal;
  ALTER TABLE recipes ADD COLUMN IF NOT EXISTS carbs_per_serving decimal;
  ALTER TABLE recipes ADD COLUMN IF NOT EXISTS fat_per_serving decimal;
  ALTER TABLE recipes ADD COLUMN IF NOT EXISTS fiber_per_serving decimal;
END $$;

-- Create recipe instructions table
CREATE TABLE IF NOT EXISTS recipe_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  step_number integer NOT NULL,
  instruction text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create recipe storage table
CREATE TABLE IF NOT EXISTS recipe_storage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  storage_instructions text NOT NULL,
  shelf_life_days integer,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE recipe_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_storage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Recipe instructions are viewable by everyone"
  ON recipe_instructions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Recipe storage information is viewable by everyone"
  ON recipe_storage FOR SELECT
  TO public
  USING (true);