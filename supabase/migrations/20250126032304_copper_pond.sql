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
    'White Fish and Spinach Skillet',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
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
    240,
    36,
    10,
    6,
    3,
    'published',
    '1. Season cod fillets with herbs and lemon
2. Heat skillet over medium heat
3. Cook fish for 4-5 minutes per side
4. Add spinach and cook until wilted
5. Serve with lemon wedges',
    now()
  ),
  (
    'Lean Turkey and Zucchini Noodles',
    'https://images.unsplash.com/photo-1556761223-4c4282c73f77',
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
    265,
    34,
    12,
    7,
    4,
    'published',
    '1. Spiralize zucchini into noodles
2. Brown lean ground turkey
3. Add garlic and Italian herbs
4. Cook zucchini noodles until tender
5. Combine and top with fresh basil',
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
    'Mediterranean Chicken Thighs with Olives',
    'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b',
    40,
    1,
    10,
    30,
    40,
    'medium',
    false,
    true,
    true,
    'dinner',
    330,
    35,
    8,
    16,
    3,
    'published',
    '1. Season chicken thighs with Mediterranean herbs
2. Brown chicken skin-side down
3. Add olives and cherry tomatoes
4. Simmer until chicken is cooked through
5. Garnish with fresh herbs',
    now()
  ),
  (
    'Mackerel with Roasted Brussels Sprouts',
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
    345,
    33,
    12,
    17,
    5,
    'published',
    '1. Halve Brussels sprouts and season
2. Roast sprouts at 400°F for 20 minutes
3. Season mackerel fillets
4. Pan-sear mackerel until crispy
5. Serve with roasted vegetables',
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
    'Lean Beef and Black Bean Bowl',
    'https://images.unsplash.com/photo-1513442542250-854d436a73f2',
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
    385,
    36,
    44,
    8,
    12,
    'published',
    '1. Cook black beans with spices
2. Grill lean beef strips
3. Prepare brown rice
4. Combine with diced tomatoes
5. Top with fresh cilantro',
    now()
  ),
  (
    'Tilapia with Sweet Potato Mash',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
    30,
    1,
    10,
    20,
    30,
    'easy',
    false,
    true,
    true,
    'dinner',
    350,
    35,
    38,
    7,
    5,
    'published',
    '1. Boil and mash sweet potatoes
2. Season tilapia fillets
3. Pan-fry fish until flaky
4. Season mash with herbs
5. Serve with steamed greens',
    now()
  );

-- Add ingredients for new recipes
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
SELECT 
  r.id,
  'White Fish Fillet',
  7,
  'oz'
FROM recipes r
WHERE r.title = 'White Fish and Spinach Skillet';

-- Add nutrients for new recipes
INSERT INTO recipe_nutrients (recipe_id, name, amount, unit)
SELECT 
  r.id,
  'Protein',
  36,
  'g'
FROM recipes r
WHERE r.title = 'White Fish and Spinach Skillet';

-- Update search indexes
REINDEX INDEX idx_recipes_protein;
REINDEX INDEX idx_recipes_calories;
REINDEX INDEX idx_recipes_meal_type;
REINDEX INDEX idx_recipes_status;