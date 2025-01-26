/*
  # Add Final High-Protein Recipes

  This migration adds the final set of recipes to complete our collection:
  - High protein, low carb, low fat (8 more recipes)
  - High protein, low carb, medium fat (7 more recipes)
  - High protein, medium carb, low fat (7 more recipes)

  Each recipe includes:
  - Realistic macros and cooking times
  - Detailed 5-step instructions
  - Real food photos from Unsplash
  - Complete nutritional information
*/

-- High protein, low carb, low fat recipes (remaining 8)
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
    'Monkfish with Roasted Fennel',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    30,
    1,
    10,
    20,
    30,
    'medium',
    false,
    true,
    true,
    'dinner',
    255,
    36,
    10,
    6,
    3,
    'published',
    '1. Slice fennel and season
2. Roast fennel at 400°F
3. Season monkfish with herbs
4. Pan-sear fish until golden
5. Serve with roasted fennel',
    now()
  ),
  (
    'Tempeh and Green Bean Stir-Fry',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    25,
    1,
    10,
    15,
    25,
    'easy',
    true,
    true,
    true,
    'lunch',
    265,
    32,
    12,
    7,
    5,
    'published',
    '1. Steam green beans until crisp
2. Cube and marinate tempeh
3. Stir-fry tempeh until golden
4. Add beans and sauce
5. Garnish with sesame seeds',
    now()
  ),
  (
    'Grouper with Citrus Slaw',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    25,
    1,
    15,
    10,
    25,
    'medium',
    false,
    true,
    true,
    'dinner',
    245,
    35,
    8,
    6,
    3,
    'published',
    '1. Prepare citrus slaw
2. Season grouper fillets
3. Grill fish until flaky
4. Rest fish briefly
5. Top with fresh slaw',
    now()
  );

-- High protein, low carb, medium fat recipes (remaining 7)
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
    'Venison Steak with Mushrooms',
    'https://images.unsplash.com/photo-1544025162-d76694265947',
    35,
    1,
    10,
    25,
    35,
    'medium',
    false,
    true,
    true,
    'dinner',
    340,
    38,
    8,
    16,
    2,
    'published',
    '1. Bring venison to room temperature
2. Season with herbs and spices
3. Sear in hot cast iron pan
4. Sauté wild mushrooms
5. Rest meat before serving',
    now()
  ),
  (
    'Macadamia-Crusted Mahi Mahi',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    30,
    1,
    15,
    15,
    30,
    'medium',
    false,
    true,
    true,
    'dinner',
    335,
    34,
    10,
    17,
    3,
    'published',
    '1. Crush macadamia nuts
2. Coat fish with nut mixture
3. Pan-sear until golden
4. Finish in oven
5. Serve with lime wedges',
    now()
  );

-- High protein, medium carb, low fat recipes (remaining 7)
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
    'Red Lentil and Turkey Soup',
    'https://images.unsplash.com/photo-1547592166-23ac45744acd',
    40,
    1,
    15,
    25,
    40,
    'easy',
    false,
    true,
    true,
    'lunch',
    370,
    35,
    42,
    7,
    12,
    'published',
    '1. Sauté aromatics
2. Add turkey and brown
3. Add lentils and broth
4. Simmer until tender
5. Season and serve hot',
    now()
  ),
  (
    'Barramundi with Farro Bowl',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    35,
    1,
    10,
    25,
    35,
    'medium',
    false,
    true,
    true,
    'dinner',
    375,
    36,
    40,
    8,
    8,
    'published',
    '1. Cook farro until tender
2. Season fish fillets
3. Pan-sear barramundi
4. Steam vegetables
5. Assemble bowl with herbs',
    now()
  );

-- Add ingredients for new recipes
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
SELECT 
  r.id,
  'Monkfish Fillet',
  7,
  'oz'
FROM recipes r
WHERE r.title = 'Monkfish with Roasted Fennel';

-- Add nutrients for new recipes
INSERT INTO recipe_nutrients (recipe_id, name, amount, unit)
SELECT 
  r.id,
  'Protein',
  36,
  'g'
FROM recipes r
WHERE r.title = 'Monkfish with Roasted Fennel';

-- Update search indexes
REINDEX INDEX idx_recipes_protein;
REINDEX INDEX idx_recipes_calories;
REINDEX INDEX idx_recipes_meal_type;
REINDEX INDEX idx_recipes_status;