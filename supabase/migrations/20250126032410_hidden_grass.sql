-- High protein, low carb, low fat recipes
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
    'Poached Cod with Asian Greens',
    'https://images.unsplash.com/photo-1511344472844-5f14a914f2e8',
    25,
    1,
    10,
    15,
    25,
    'easy',
    false,
    true,
    true,
    'dinner',
    245,
    35,
    12,
    6,
    4,
    'published',
    '1. Bring seasoned water to simmer
2. Add cod fillets and poach for 8-10 minutes
3. Steam bok choy and broccoli
4. Season with ginger and soy sauce
5. Serve fish over greens',
    now()
  ),
  (
    'Turkey Breast and Roasted Bell Peppers',
    'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0',
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
    270,
    36,
    14,
    7,
    5,
    'published',
    '1. Slice bell peppers and season
2. Roast peppers at 400°F for 15 minutes
3. Season turkey breast cutlets
4. Grill turkey for 4-5 minutes per side
5. Serve with roasted peppers',
    now()
  );

-- High protein, low carb, medium fat recipes
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
    'Pan-Seared Duck Breast with Greens',
    'https://images.unsplash.com/photo-1572448862527-d3c904757de6',
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
    34,
    10,
    18,
    3,
    'published',
    '1. Score duck breast skin in diamond pattern
2. Start in cold pan, skin-side down
3. Cook for 6-8 minutes until skin is crispy
4. Flip and cook 4-5 minutes more
5. Rest meat and serve with sautéed greens',
    now()
  ),
  (
    'Sardines with Mediterranean Vegetables',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    25,
    1,
    10,
    15,
    25,
    'easy',
    false,
    true,
    true,
    'lunch',
    325,
    32,
    12,
    16,
    4,
    'published',
    '1. Grill fresh sardines
2. Roast Mediterranean vegetables
3. Prepare herb dressing
4. Combine all components
5. Garnish with lemon wedges',
    now()
  );

-- High protein, medium carb, low fat recipes
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
    'Lentil and Chicken Power Bowl',
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
    375,
    35,
    42,
    8,
    12,
    'published',
    '1. Cook red lentils until tender
2. Grill seasoned chicken breast
3. Steam mixed vegetables
4. Combine in bowl
5. Top with fresh herbs',
    now()
  ),
  (
    'White Fish and Chickpea Stew',
    'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
    40,
    1,
    15,
    25,
    40,
    'medium',
    false,
    true,
    true,
    'dinner',
    365,
    34,
    45,
    7,
    10,
    'published',
    '1. Sauté aromatics and spices
2. Add chickpeas and tomatoes
3. Simmer with fish stock
4. Add white fish pieces
5. Cook until fish is flaky',
    now()
  );

-- Add ingredients for new recipes
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
SELECT 
  r.id,
  'Cod Fillet',
  7,
  'oz'
FROM recipes r
WHERE r.title = 'Poached Cod with Asian Greens';

-- Add nutrients for new recipes
INSERT INTO recipe_nutrients (recipe_id, name, amount, unit)
SELECT 
  r.id,
  'Protein',
  35,
  'g'
FROM recipes r
WHERE r.title = 'Poached Cod with Asian Greens';

-- Update search indexes
REINDEX INDEX idx_recipes_protein;
REINDEX INDEX idx_recipes_calories;
REINDEX INDEX idx_recipes_meal_type;
REINDEX INDEX idx_recipes_status;