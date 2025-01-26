// Nutrient data per 100g
export const nutrientData: Record<string, {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  fiber: number;
}> = {
  // Meats & Proteins
  'chicken breast': { protein: 31, calories: 165, carbs: 0, fat: 3.6, fiber: 0 },
  'ground beef': { protein: 26, calories: 250, carbs: 0, fat: 17, fiber: 0 },
  'salmon': { protein: 25, calories: 208, carbs: 0, fat: 13, fiber: 0 },
  'tofu': { protein: 8, calories: 76, carbs: 1.9, fat: 4.8, fiber: 0.3 },
  
  // Vegetables
  'spinach': { protein: 2.9, calories: 23, carbs: 3.6, fat: 0.4, fiber: 2.2 },
  'broccoli': { protein: 2.8, calories: 34, carbs: 7, fat: 0.4, fiber: 2.6 },
  'sweet potato': { protein: 1.6, calories: 86, carbs: 20, fat: 0.1, fiber: 3 },
  
  // Grains
  'quinoa': { protein: 4.4, calories: 120, carbs: 21, fat: 1.9, fiber: 2.8 },
  'brown rice': { protein: 2.6, calories: 111, carbs: 23, fat: 0.9, fiber: 1.8 },
  'oats': { protein: 16.9, calories: 389, carbs: 66, fat: 6.9, fiber: 10.6 },

  // Legumes
  'lentils': { protein: 9, calories: 116, carbs: 20, fat: 0.4, fiber: 7.9 },
  'chickpeas': { protein: 8.9, calories: 164, carbs: 27, fat: 2.6, fiber: 7.6 },
  'black beans': { protein: 8.9, calories: 132, carbs: 23, fat: 0.5, fiber: 8.7 },

  // Dairy
  'greek yogurt': { protein: 10, calories: 59, carbs: 3.6, fat: 0.4, fiber: 0 },
  'cottage cheese': { protein: 11, calories: 98, carbs: 3.4, fat: 4.3, fiber: 0 },
  'eggs': { protein: 13, calories: 155, carbs: 1.1, fat: 11, fiber: 0 },

  // Default values for unknown ingredients
  'default': { protein: 5, calories: 100, carbs: 10, fat: 5, fiber: 2 }
};

export const findNearestIngredient = (ingredientName: string): string => {
  const normalizedName = ingredientName.toLowerCase();
  
  // Direct match
  if (nutrientData[normalizedName]) {
    return normalizedName;
  }

  // Find closest match
  const ingredients = Object.keys(nutrientData);
  for (const ingredient of ingredients) {
    if (normalizedName.includes(ingredient) || ingredient.includes(normalizedName)) {
      return ingredient;
    }
  }

  return 'default';
};

export const calculateIngredientNutrition = (
  ingredientName: string,
  amount: number,
  unit: string
) => {
  const matchedIngredient = findNearestIngredient(ingredientName);
  const baseNutrients = nutrientData[matchedIngredient];

  // Convert to grams if necessary
  let grams = amount;
  if (unit === 'oz') {
    grams = amount * 28.35; // Convert oz to g
  } else if (unit === 'cup') {
    grams = amount * 128; // Approximate conversion
  } else if (unit === 'tbsp') {
    grams = amount * 15;
  } else if (unit === 'tsp') {
    grams = amount * 5;
  }

  // Calculate nutrients based on amount
  const multiplier = grams / 100; // nutrient data is per 100g
  return {
    protein: baseNutrients.protein * multiplier,
    calories: baseNutrients.calories * multiplier,
    carbs: baseNutrients.carbs * multiplier,
    fat: baseNutrients.fat * multiplier,
    fiber: baseNutrients.fiber * multiplier
  };
};