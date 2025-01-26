/*
  # Gym Bro Recipes Schema Update

  1. New Tables
    - `user_profiles`
      - User fitness goals and preferences
      - Macro targets and dietary restrictions
    - `recipe_versions`
      - Version control for recipes
      - Tracks modifications and improvements
    - `meal_plans`
      - Weekly meal planning functionality
      - Links recipes to specific days/meals
    - `shopping_lists`
      - Generated shopping lists from meal plans
      - Ingredient aggregation and categorization

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
    - Secure profile data access
*/

-- User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name text,
  fitness_goals text[],
  dietary_restrictions text[],
  protein_target integer,
  calorie_target integer,
  preferred_theme text DEFAULT 'light',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recipe Versions
CREATE TABLE IF NOT EXISTS recipe_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  version_number integer NOT NULL,
  changes jsonb,
  created_by uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now()
);

-- Meal Plans
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  week_start_date date NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meal_plan_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id uuid REFERENCES meal_plans ON DELETE CASCADE,
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  day_of_week integer,
  meal_type text,
  servings integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Shopping Lists
CREATE TABLE IF NOT EXISTS shopping_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  meal_plan_id uuid REFERENCES meal_plans ON DELETE CASCADE,
  name text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shopping_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id uuid REFERENCES shopping_lists ON DELETE CASCADE,
  ingredient_name text NOT NULL,
  amount decimal,
  unit text,
  category text,
  is_checked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Recipe versions are viewable by everyone"
  ON recipe_versions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their meal plans"
  ON meal_plans FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their meal plan items"
  ON meal_plan_items FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM meal_plans WHERE id = meal_plan_id
    )
  );

CREATE POLICY "Users can manage their shopping lists"
  ON shopping_lists FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their shopping list items"
  ON shopping_list_items FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM shopping_lists WHERE id = shopping_list_id
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_shopping_lists_updated_at
  BEFORE UPDATE ON shopping_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();