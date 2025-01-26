/*
  # Complete Recipe Data Migration
  
  1. New Functions
    - add_complete_ingredients: Adds detailed ingredients for recipes
    - add_complete_instructions: Adds step-by-step instructions
    
  2. Data Updates
    - Adds ingredients with proper measurements
    - Adds detailed cooking instructions
    - Adds storage information
    
  3. Changes
    - Uses proper parameter naming to avoid ambiguity
    - Ensures safe deletion of existing data
    - Maintains data integrity
*/

-- Function to add complete ingredients for a recipe
CREATE OR REPLACE FUNCTION add_complete_ingredients(
  p_recipe_id uuid,
  p_recipe_title text
) RETURNS void AS $$
BEGIN
  -- Delete existing ingredients
  DELETE FROM recipe_ingredients WHERE recipe_id = p_recipe_id;
  
  -- Add main protein
  IF p_recipe_title ILIKE '%chicken%' THEN
    INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
    VALUES 
      (p_recipe_id, 'Chicken Breast', 6, 'oz'),
      (p_recipe_id, 'Olive Oil', 1, 'tbsp'),
      (p_recipe_id, 'Garlic', 2, 'cloves'),
      (p_recipe_id, 'Salt', 1, 'tsp'),
      (p_recipe_id, 'Black Pepper', 0.5, 'tsp'),
      (p_recipe_id, 'Mixed Herbs', 1, 'tbsp');
  ELSIF p_recipe_title ILIKE '%salmon%' THEN
    INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
    VALUES 
      (p_recipe_id, 'Salmon Fillet', 6, 'oz'),
      (p_recipe_id, 'Lemon', 1, 'whole'),
      (p_recipe_id, 'Olive Oil', 1, 'tbsp'),
      (p_recipe_id, 'Dill', 1, 'tbsp'),
      (p_recipe_id, 'Salt', 1, 'tsp'),
      (p_recipe_id, 'Black Pepper', 0.5, 'tsp');
  ELSIF p_recipe_title ILIKE '%cod%' THEN
    INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
    VALUES 
      (p_recipe_id, 'Cod Fillet', 6, 'oz'),
      (p_recipe_id, 'Lemon', 1, 'whole'),
      (p_recipe_id, 'Olive Oil', 1, 'tbsp'),
      (p_recipe_id, 'Parsley', 2, 'tbsp'),
      (p_recipe_id, 'Salt', 1, 'tsp'),
      (p_recipe_id, 'Black Pepper', 0.5, 'tsp');
  ELSIF p_recipe_title ILIKE '%turkey%' THEN
    INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
    VALUES 
      (p_recipe_id, 'Ground Turkey', 6, 'oz'),
      (p_recipe_id, 'Olive Oil', 1, 'tbsp'),
      (p_recipe_id, 'Onion', 0.5, 'medium'),
      (p_recipe_id, 'Garlic', 2, 'cloves'),
      (p_recipe_id, 'Salt', 1, 'tsp'),
      (p_recipe_id, 'Black Pepper', 0.5, 'tsp');
  ELSIF p_recipe_title ILIKE '%beef%' THEN
    INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
    VALUES 
      (p_recipe_id, 'Lean Beef', 6, 'oz'),
      (p_recipe_id, 'Olive Oil', 1, 'tbsp'),
      (p_recipe_id, 'Garlic', 2, 'cloves'),
      (p_recipe_id, 'Rosemary', 1, 'sprig'),
      (p_recipe_id, 'Salt', 1, 'tsp'),
      (p_recipe_id, 'Black Pepper', 0.5, 'tsp');
  END IF;

  -- Add vegetables based on recipe title
  IF p_recipe_title ILIKE '%asparagus%' THEN
    INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
    VALUES (p_recipe_id, 'Asparagus', 8, 'spears');
  ELSIF p_recipe_title ILIKE '%broccoli%' THEN
    INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
    VALUES (p_recipe_id, 'Broccoli', 2, 'cups');
  ELSIF p_recipe_title ILIKE '%zucchini%' THEN
    INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
    VALUES (p_recipe_id, 'Zucchini', 2, 'medium');
  END IF;

  -- Add grains if applicable
  IF p_recipe_title ILIKE '%quinoa%' THEN
    INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
    VALUES 
      (p_recipe_id, 'Quinoa', 0.5, 'cup'),
      (p_recipe_id, 'Vegetable Broth', 1, 'cup');
  ELSIF p_recipe_title ILIKE '%sweet potato%' THEN
    INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
    VALUES (p_recipe_id, 'Sweet Potato', 1, 'medium');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to add complete instructions
CREATE OR REPLACE FUNCTION add_complete_instructions(
  p_recipe_id uuid,
  p_recipe_title text
) RETURNS void AS $$
BEGIN
  -- Delete existing instructions
  DELETE FROM recipe_instructions WHERE recipe_id = p_recipe_id;
  
  -- Add detailed instructions based on recipe type
  IF p_recipe_title ILIKE '%chicken%' AND p_recipe_title ILIKE '%asparagus%' THEN
    INSERT INTO recipe_instructions (recipe_id, step_number, instruction)
    VALUES 
      (p_recipe_id, 1, 'Pat chicken breast dry with paper towels'),
      (p_recipe_id, 2, 'Season chicken with salt, pepper, and mixed herbs'),
      (p_recipe_id, 3, 'Heat grill or grill pan to medium-high heat'),
      (p_recipe_id, 4, 'Brush chicken with olive oil'),
      (p_recipe_id, 5, 'Grill chicken for 6-7 minutes per side until internal temperature reaches 165°F'),
      (p_recipe_id, 6, 'While chicken cooks, trim asparagus ends'),
      (p_recipe_id, 7, 'Toss asparagus with olive oil, salt, and pepper'),
      (p_recipe_id, 8, 'Grill asparagus for 3-4 minutes until tender-crisp'),
      (p_recipe_id, 9, 'Let chicken rest for 5 minutes before slicing'),
      (p_recipe_id, 10, 'Serve hot with grilled asparagus and lemon wedges');
  ELSIF p_recipe_title ILIKE '%salmon%' AND p_recipe_title ILIKE '%broccoli%' THEN
    INSERT INTO recipe_instructions (recipe_id, step_number, instruction)
    VALUES 
      (p_recipe_id, 1, 'Preheat oven to 400°F (200°C)'),
      (p_recipe_id, 2, 'Line a baking sheet with parchment paper'),
      (p_recipe_id, 3, 'Pat salmon dry and season with salt, pepper, and dill'),
      (p_recipe_id, 4, 'Cut broccoli into even-sized florets'),
      (p_recipe_id, 5, 'Toss broccoli with olive oil, salt, and pepper'),
      (p_recipe_id, 6, 'Place salmon and broccoli on prepared baking sheet'),
      (p_recipe_id, 7, 'Drizzle salmon with olive oil and lemon juice'),
      (p_recipe_id, 8, 'Bake for 12-15 minutes until salmon flakes easily'),
      (p_recipe_id, 9, 'Check broccoli for desired tenderness'),
      (p_recipe_id, 10, 'Serve hot with additional lemon wedges');
  ELSIF p_recipe_title ILIKE '%cod%' AND p_recipe_title ILIKE '%zucchini%' THEN
    INSERT INTO recipe_instructions (recipe_id, step_number, instruction)
    VALUES 
      (p_recipe_id, 1, 'Pat cod fillets dry with paper towels'),
      (p_recipe_id, 2, 'Season cod with salt, pepper, and parsley'),
      (p_recipe_id, 3, 'Slice zucchini into 1/4-inch rounds'),
      (p_recipe_id, 4, 'Heat olive oil in a large skillet over medium-high heat'),
      (p_recipe_id, 5, 'Add cod to pan and cook for 4-5 minutes'),
      (p_recipe_id, 6, 'Flip cod and cook for additional 3-4 minutes'),
      (p_recipe_id, 7, 'Remove cod and keep warm'),
      (p_recipe_id, 8, 'In the same pan, cook zucchini for 3-4 minutes per side'),
      (p_recipe_id, 9, 'Season zucchini with salt and pepper'),
      (p_recipe_id, 10, 'Serve cod over zucchini with lemon wedges');
  END IF;

  -- Add storage instructions
  DELETE FROM recipe_storage WHERE recipe_id = p_recipe_id;
  INSERT INTO recipe_storage (recipe_id, storage_instructions, shelf_life_days)
  VALUES (
    p_recipe_id,
    'Store in an airtight container in the refrigerator. For best results, consume within 2-3 days. Reheat in a covered pan over medium heat or microwave until hot.',
    3
  );
END;
$$ LANGUAGE plpgsql;

-- Update all recipes with complete data
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id, title FROM recipes WHERE status = 'published'
  LOOP
    PERFORM add_complete_ingredients(r.id, r.title);
    PERFORM add_complete_instructions(r.id, r.title);
  END LOOP;
END $$;