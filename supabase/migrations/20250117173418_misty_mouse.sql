/*
  # Recipe Database Schema

  1. New Tables
    - `recipes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `image_url` (text)
      - `ready_in_minutes` (integer)
      - `servings` (integer)
      - `instructions` (text)
      - `created_at` (timestamp)
    
    - `recipe_nutrients`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, foreign key)
      - `name` (text)
      - `amount` (decimal)
      - `unit` (text)
    
    - `recipe_ingredients`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, foreign key)
      - `name` (text)
      - `amount` (decimal)
      - `unit` (text)
    
    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `recipe_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  ready_in_minutes integer,
  servings integer,
  instructions text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE recipe_nutrients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  name text NOT NULL,
  amount decimal NOT NULL,
  unit text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  name text NOT NULL,
  amount decimal,
  unit text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_nutrients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Recipes are viewable by everyone"
  ON recipes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Recipe nutrients are viewable by everyone"
  ON recipe_nutrients FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Recipe ingredients are viewable by everyone"
  ON recipe_ingredients FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own favorites"
  ON user_favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);