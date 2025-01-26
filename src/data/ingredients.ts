import { Ingredient } from '../types/recipe';

interface IngredientMetadata {
  name: string;
  category: string;
  unit: string;
  aliases: string[];
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
}

export const ingredients: IngredientMetadata[] = [
  // Meats & Proteins
  { 
    name: 'Chicken Breast', 
    category: 'Meats & Proteins', 
    unit: 'oz', 
    aliases: ['boneless chicken breast', 'skinless chicken breast'],
    isVegetarian: false,
    isGlutenFree: true,
    isDairyFree: true
  },
  { 
    name: 'Ground Beef', 
    category: 'Meats & Proteins', 
    unit: 'lb', 
    aliases: ['minced beef', 'hamburger meat'],
    isVegetarian: false,
    isGlutenFree: true,
    isDairyFree: true
  },
  { 
    name: 'Salmon', 
    category: 'Meats & Proteins', 
    unit: 'oz', 
    aliases: ['fresh salmon', 'salmon fillet'],
    isVegetarian: false,
    isGlutenFree: true,
    isDairyFree: true
  },
  { 
    name: 'Tofu', 
    category: 'Meats & Proteins', 
    unit: 'oz', 
    aliases: ['bean curd', 'soybean curd'],
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true
  },
  
  // Dairy & Eggs
  { 
    name: 'Greek Yogurt', 
    category: 'Dairy & Eggs', 
    unit: 'cup', 
    aliases: ['plain greek yogurt', 'yogurt'],
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: false
  },
  { 
    name: 'Eggs', 
    category: 'Dairy & Eggs', 
    unit: 'large', 
    aliases: ['fresh eggs', 'whole eggs'],
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true
  },
  { 
    name: 'Cheddar Cheese', 
    category: 'Dairy & Eggs', 
    unit: 'oz', 
    aliases: ['sharp cheddar', 'mild cheddar'],
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: false
  },
  
  // Grains & Pasta
  { 
    name: 'Quinoa', 
    category: 'Grains & Pasta', 
    unit: 'cup', 
    aliases: ['white quinoa', 'cooked quinoa'],
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true
  },
  { 
    name: 'Brown Rice', 
    category: 'Grains & Pasta', 
    unit: 'cup', 
    aliases: ['whole grain rice', 'cooked brown rice'],
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true
  },
  { 
    name: 'Whole Wheat Pasta', 
    category: 'Grains & Pasta', 
    unit: 'oz', 
    aliases: ['whole grain pasta', 'wheat pasta'],
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true
  },
  
  // Vegetables
  { 
    name: 'Spinach', 
    category: 'Vegetables', 
    unit: 'cup', 
    aliases: ['baby spinach', 'fresh spinach'],
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true
  },
  { 
    name: 'Broccoli', 
    category: 'Vegetables', 
    unit: 'cup', 
    aliases: ['broccoli florets', 'fresh broccoli'],
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true
  },
  { 
    name: 'Sweet Potato', 
    category: 'Vegetables', 
    unit: 'medium', 
    aliases: ['yam', 'orange sweet potato'],
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true
  }
];

export const findIngredient = (name: string): IngredientMetadata | undefined => {
  const normalizedName = name.toLowerCase();
  return ingredients.find(ing => 
    ing.name.toLowerCase() === normalizedName ||
    ing.aliases.some(alias => alias.toLowerCase() === normalizedName)
  );
};

export const calculateDietaryTags = (ingredientNames: string[]) => {
  let isVegetarian = true;
  let isGlutenFree = true;
  let isDairyFree = true;

  for (const name of ingredientNames) {
    const ingredient = findIngredient(name);
    if (ingredient) {
      if (!ingredient.isVegetarian) isVegetarian = false;
      if (!ingredient.isGlutenFree) isGlutenFree = false;
      if (!ingredient.isDairyFree) isDairyFree = false;
    }
  }

  return {
    isVegetarian,
    isGlutenFree,
    isDairyFree
  };
};