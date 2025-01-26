-- Update existing recipes with real data
UPDATE recipes
SET status = 'archived'
WHERE title LIKE 'High Protein%';

-- Insert real recipes for high protein, low carb, low fat
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
) VALUES
  (
    'Grilled Chicken Breast with Steamed Broccoli',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435',
    30,
    1,
    10,
    20,
    30,
    'easy',
    false,
    true,
    true,
    'lunch',
    280,
    35,
    15,
    8,
    6,
    'published',
    '1. Season chicken breast with salt, pepper, and herbs
2. Preheat grill or grill pan to medium-high heat
3. Grill chicken for 6-7 minutes per side until internal temperature reaches 165°F
4. Meanwhile, steam broccoli for 5-6 minutes until tender-crisp
5. Serve chicken with broccoli',
    now()
  ),
  (
    'Egg White and Turkey Scramble',
    'https://images.unsplash.com/photo-1607532941433-304659e8198a',
    20,
    1,
    5,
    15,
    20,
    'easy',
    false,
    true,
    true,
    'breakfast',
    250,
    32,
    8,
    6,
    2,
    'published',
    '1. Heat non-stick pan over medium heat
2. Cook ground turkey until no longer pink
3. Add egg whites and scramble until set
4. Season with salt, pepper, and herbs
5. Serve hot',
    now()
  );

-- Insert real recipes for high protein, low carb, medium fat
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
) VALUES
  (
    'Baked Salmon with Asparagus',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
    25,
    1,
    10,
    15,
    25,
    'medium',
    false,
    true,
    true,
    'dinner',
    320,
    34,
    12,
    16,
    4,
    'published',
    '1. Preheat oven to 400°F
2. Season salmon fillet with herbs and lemon
3. Place salmon and asparagus on baking sheet
4. Bake for 12-15 minutes until salmon flakes easily
5. Serve immediately',
    now()
  );

-- Insert real recipes for high protein, medium carb, low fat
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
) VALUES
  (
    'Lean Turkey Quinoa Bowl',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    35,
    1,
    10,
    25,
    35,
    'medium',
    false,
    true,
    true,
    'lunch',
    380,
    35,
    45,
    8,
    7,
    'published',
    '1. Cook quinoa according to package instructions
2. Brown lean ground turkey in a pan
3. Steam mixed vegetables
4. Combine all ingredients in a bowl
5. Season with herbs and spices',
    now()
  );

-- Add ingredients for the recipes
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
SELECT 
  r.id,
  'Chicken Breast',
  8,
  'oz'
FROM recipes r
WHERE r.title = 'Grilled Chicken Breast with Steamed Broccoli';

-- Add nutrients for the recipes
INSERT INTO recipe_nutrients (recipe_id, name, amount, unit)
SELECT 
  r.id,
  'Protein',
  35,
  'g'
FROM recipes r
WHERE r.title = 'Grilled Chicken Breast with Steamed Broccoli';

-- Update search indexes
REINDEX INDEX idx_recipes_protein;
REINDEX INDEX idx_recipes_calories;
REINDEX INDEX idx_recipes_meal_type;
REINDEX INDEX idx_recipes_status;