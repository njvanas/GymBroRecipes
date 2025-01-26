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
    'Lean Tuna Steak with Green Beans',
    'https://images.unsplash.com/photo-1501595091296-3aa970afb3ff',
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
    270,
    38,
    12,
    8,
    4,
    'published',
    '1. Season tuna steak with salt, pepper, and lemon
2. Heat grill pan over high heat
3. Sear tuna for 2-3 minutes per side for medium-rare
4. Steam green beans until tender-crisp
5. Serve tuna with green beans',
    now()
  ),
  (
    'Shrimp and Cauliflower Rice Bowl',
    'https://images.unsplash.com/photo-1551248429-40975aa4de74',
    20,
    1,
    10,
    10,
    20,
    'easy',
    false,
    true,
    true,
    'lunch',
    260,
    32,
    15,
    7,
    5,
    'published',
    '1. Pulse cauliflower in food processor until rice-sized
2. Sauté cauliflower rice until tender
3. Cook shrimp with garlic and herbs
4. Combine and season with lemon juice
5. Garnish with fresh herbs',
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
    'Greek Style Lamb Skewers with Zucchini',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    35,
    1,
    15,
    20,
    35,
    'medium',
    false,
    true,
    true,
    'dinner',
    340,
    35,
    12,
    18,
    4,
    'published',
    '1. Cut lamb into 1-inch cubes
2. Marinate with olive oil, lemon, and herbs
3. Thread onto skewers with zucchini pieces
4. Grill for 4-5 minutes per side
5. Rest for 5 minutes before serving',
    now()
  ),
  (
    'Almond-Crusted Cod with Roasted Vegetables',
    'https://images.unsplash.com/photo-1559847844-5315695dadae',
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
    310,
    32,
    14,
    15,
    5,
    'published',
    '1. Coat cod fillets with crushed almonds
2. Prepare mixed vegetables for roasting
3. Bake cod at 400°F for 15-18 minutes
4. Roast vegetables until tender
5. Serve with lemon wedges',
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
    'Chicken and Sweet Potato Power Bowl',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
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
    370,
    35,
    42,
    8,
    6,
    'published',
    '1. Cube and roast sweet potato
2. Grill seasoned chicken breast
3. Steam broccoli until bright green
4. Combine in bowl with quinoa
5. Top with fresh herbs',
    now()
  ),
  (
    'Turkey and Brown Rice Stir-Fry',
    'https://images.unsplash.com/photo-1512058564366-18510be2db19',
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
    360,
    34,
    40,
    9,
    5,
    'published',
    '1. Cook brown rice according to package
2. Stir-fry turkey with garlic and ginger
3. Add mixed vegetables
4. Combine with rice
5. Season with low-sodium soy sauce',
    now()
  );

-- Add ingredients for new recipes
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
SELECT 
  r.id,
  'Tuna Steak',
  6,
  'oz'
FROM recipes r
WHERE r.title = 'Lean Tuna Steak with Green Beans';

-- Add nutrients for new recipes
INSERT INTO recipe_nutrients (recipe_id, name, amount, unit)
SELECT 
  r.id,
  'Protein',
  38,
  'g'
FROM recipes r
WHERE r.title = 'Lean Tuna Steak with Green Beans';

-- Update search indexes
REINDEX INDEX idx_recipes_protein;
REINDEX INDEX idx_recipes_calories;
REINDEX INDEX idx_recipes_meal_type;
REINDEX INDEX idx_recipes_status;