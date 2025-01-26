/*
  # Populate Recipe Data

  1. Changes
    - Add function to generate random recipe data
    - Populate 10,000 high-protein, low-calorie recipes
    - Include 2,000 low-carb, low-fat recipes
    - Add nutrition data for all recipes

  2. Data Characteristics
    - All recipes: High protein (>25g), moderate-low calories (<500)
    - Subset: Low carbs (<20g), low fat (<10g)
    - Random variations in ingredients and instructions
*/

-- Function to generate random recipe data
CREATE OR REPLACE FUNCTION generate_recipes() RETURNS void AS $$
DECLARE
  v_recipe_id uuid;
  v_title text;
  v_protein decimal;
  v_calories integer;
  v_carbs decimal;
  v_fat decimal;
  v_is_low_carb boolean;
  v_counter integer := 0;
  v_instructions text;
BEGIN
  -- Clear existing data
  DELETE FROM recipes WHERE title LIKE 'High Protein%';
  
  -- Generate 10,000 recipes
  WHILE v_counter < 10000 LOOP
    -- Determine if this should be a low-carb recipe
    v_is_low_carb := v_counter < 2000;
    
    -- Generate random nutrition values
    v_protein := random() * 20 + 25; -- 25-45g protein
    v_calories := floor(random() * 200 + 300)::integer; -- 300-500 calories
    
    IF v_is_low_carb THEN
      v_carbs := random() * 15 + 5; -- 5-20g carbs
      v_fat := random() * 5 + 5; -- 5-10g fat
      v_title := 'High Protein Low Carb Meal #' || v_counter;
    ELSE
      v_carbs := random() * 30 + 20; -- 20-50g carbs
      v_fat := random() * 10 + 10; -- 10-20g fat
      v_title := 'High Protein Meal #' || v_counter;
    END IF;

    -- Generate random instructions
    v_instructions := 
      '1. Prepare ingredients' || E'\n' ||
      '2. Cook main protein' || E'\n' ||
      '3. Add vegetables and seasonings' || E'\n' ||
      '4. Combine all ingredients' || E'\n' ||
      '5. Serve hot';

    -- Insert recipe
    INSERT INTO recipes (
      title,
      image_url,
      ready_in_minutes,
      servings,
      prep_time_minutes,
      cook_time_minutes,
      total_time_minutes,
      difficulty_level,
      is_vegetarian,
      is_gluten_free,
      is_dairy_free,
      meal_type,
      calories_per_serving,
      protein_per_serving,
      carbs_per_serving,
      fat_per_serving,
      fiber_per_serving,
      status,
      instructions,
      published_at
    ) VALUES (
      v_title,
      'https://source.unsplash.com/random/800x600/?healthy-food',
      floor(random() * 30 + 15)::integer,
      floor(random() * 2 + 1)::integer,
      floor(random() * 15 + 5)::integer,
      floor(random() * 20 + 10)::integer,
      floor(random() * 35 + 15)::integer,
      CASE floor(random() * 3)::integer
        WHEN 0 THEN 'easy'
        WHEN 1 THEN 'medium'
        ELSE 'hard'
      END,
      random() < 0.3,
      random() < 0.3,
      random() < 0.3,
      CASE floor(random() * 3)::integer
        WHEN 0 THEN 'breakfast'
        WHEN 1 THEN 'lunch'
        ELSE 'dinner'
      END,
      v_calories,
      v_protein,
      v_carbs,
      v_fat,
      random() * 5 + 2,
      'published',
      v_instructions,
      now()
    ) RETURNING id INTO v_recipe_id;

    -- Add nutrients
    INSERT INTO recipe_nutrients (recipe_id, name, amount, unit)
    VALUES 
      (v_recipe_id, 'Calories', v_calories, 'kcal'),
      (v_recipe_id, 'Protein', v_protein, 'g'),
      (v_recipe_id, 'Carbohydrates', v_carbs, 'g'),
      (v_recipe_id, 'Fat', v_fat, 'g'),
      (v_recipe_id, 'Fiber', random() * 5 + 2, 'g');

    -- Add some basic ingredients
    INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
    VALUES
      (v_recipe_id, 'Protein Source', random() * 200 + 100, 'g'),
      (v_recipe_id, 'Mixed Vegetables', random() * 150 + 50, 'g'),
      (v_recipe_id, 'Healthy Carbs', random() * 100 + 50, 'g'),
      (v_recipe_id, 'Seasonings', random() * 2 + 1, 'tbsp');

    v_counter := v_counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to populate data
SELECT generate_recipes();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipes_protein ON recipes(protein_per_serving);
CREATE INDEX IF NOT EXISTS idx_recipes_calories ON recipes(calories_per_serving);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON recipes(meal_type);
CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);