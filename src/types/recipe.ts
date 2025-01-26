export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  nutrition: {
    nutrients: {
      name: string;
      amount: number;
      unit: string;
    }[];
  };
  instructions: string;
  extendedIngredients: {
    id: number;
    original: string;
    amount: number;
    unit: string;
  }[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  difficultyLevel: string;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  fiberPerServing: number;
  storageInstructions: string;
  shelfLifeDays: number;
}

export interface RecipeFilters {
  ingredients: string[];
  minProtein?: number;
  maxCalories?: number;
  diet?: string;
}

export interface Ingredient {
  name: string;
  category: string;
  unit: string;
  aliases: string[];
}

export interface AutocompleteState {
  isOpen: boolean;
  highlightedIndex: number;
  inputValue: string;
  selectedIngredients: string[];
}

export interface RecipeInstruction {
  id: string;
  recipeId: string;
  stepNumber: number;
  instruction: string;
}

export interface RecipeStorage {
  id: string;
  recipeId: string;
  storageInstructions: string;
  shelfLifeDays: number;
}