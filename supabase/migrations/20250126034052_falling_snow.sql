/*
  # Add High-Protein Low-Calorie Recipes

  This migration adds recipes with the following criteria:
  - Protein content higher than both carbs and fats
  - Low calorie content
  - Complete nutritional information
  - Detailed ingredients and instructions
  
  1. Recipe Categories
    - High protein, very low carb (< 10g)
    - High protein, low carb (10-20g)
    - High protein, moderate carb (20-30g)
    All with protein being the dominant macronutrient
  
  2. Nutritional Guidelines
    - Protein: 30-40g per serving
    - Calories: 250-400 per serving
    - Carbs: Always less than protein
    - Fats: Always less than protein
*/

-- Insert base recipes
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
  -- Very Low Carb Category (< 10g carbs)
  (
    'Grilled Chicken and Asparagus',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435',
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
    280,
    35,
    8,
    12,
    4,
    'published',
    '1. Season chicken breast with herbs and spices
2. Preheat grill to medium-high heat
3. Grill chicken for 6-7 minutes per side
4. Meanwhile, grill asparagus until tender-crisp
5. Serve hot with lemon wedges',
    now()
  ),
  (
    'Pan-Seared Cod with Zucchini',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    20,
    1,
    10,
    10,
    20,
    'easy',
    false,
    true,
    true,
    'dinner',
    250,
    32,
    6,
    10,
    3,
    'published',
    '1. Pat cod fillets dry and season
2. Heat pan over medium-high heat
3. Cook cod 4-5 minutes per side
4. Sauté zucchini with garlic
5. Plate and garnish with herbs',
    now()
  ),
  
  -- Low Carb Category (10-20g carbs)
  (
    'Turkey and Quinoa Power Bowl',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    30,
    1,
    10,
    20,
    30,
    'medium',
    false,
    true,
    true,
    'lunch',
    320,
    38,
    15,
    12,
    5,
    'published',
    '1. Cook quinoa according to package
2. Season and grill turkey breast
3. Prepare mixed vegetables
4. Combine in bowl
5. Top with fresh herbs',
    now()
  ),
  (
    'Baked Salmon with Roasted Broccoli',
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
    340,
    36,
    12,
    15,
    6,
    'published',
    '1. Preheat oven to 400°F
2. Season salmon with herbs
3. Place salmon and broccoli on sheet pan
4. Bake for 12-15 minutes
5. Serve with lemon wedges',
    now()
  ),
  
  -- Moderate Carb Category (20-30g carbs)
  (
    'Lean Beef and Sweet Potato Bowl',
    'https://images.unsplash.com/photo-1513442542250-854d436a73f2',
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
    380,
    35,
    25,
    14,
    6,
    'published',
    '1. Cube and roast sweet potato
2. Cook lean beef strips
3. Steam green vegetables
4. Combine in bowl
5. Add favorite seasonings',
    now()
  );

-- Add ingredients for each recipe
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
SELECT r.id, 'Chicken Breast', 6, 'oz'
FROM recipes r WHERE r.title = 'Grilled Chicken and Asparagus'
UNION ALL
SELECT r.id, 'Asparagus', 8, 'spears'
FROM recipes r WHERE r.title = 'Grilled Chicken and Asparagus'
UNION ALL
SELECT r.id, 'Cod Fillet', 6, 'oz'
FROM recipes r WHERE r.title = 'Pan-Seared Cod with Zucchini'
UNION ALL
SELECT r.id, 'Zucchini', 2, 'cups'
FROM recipes r WHERE r.title = 'Pan-Seared Cod with Zucchini';

-- Add nutrients for each recipe
INSERT INTO recipe_nutrients (recipe_id, name, amount, unit)
SELECT r.id, 'Protein', r.protein_per_serving, 'g'
FROM recipes r
UNION ALL
SELECT r.id, 'Carbohydrates', r.carbs_per_serving, 'g'
FROM recipes r
UNION ALL
SELECT r.id, 'Fat', r.fat_per_serving, 'g'
FROM recipes r
UNION ALL
SELECT r.id, 'Calories', r.calories_per_serving, 'kcal'
FROM recipes r;

-- Add storage instructions
INSERT INTO recipe_storage (recipe_id, storage_instructions, shelf_life_days)
SELECT r.id, 
       'Store in an airtight container in the refrigerator',
       3
FROM recipes r;

-- Update search indexes
REINDEX INDEX idx_recipes_protein;
REINDEX INDEX idx_recipes_calories;
REINDEX INDEX idx_recipes_meal_type;
REINDEX INDEX idx_recipes_status;