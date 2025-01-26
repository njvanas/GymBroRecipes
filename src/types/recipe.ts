// Add to existing types
export interface Recipe {
  id: string;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  difficultyLevel: string;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  mealType: string;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  fiberPerServing: number;
  instructions: string;
  avgRating?: number;
  reviewCount: number;
  nutrition: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  extendedIngredients: Array<{
    id: string;
    original: string;
    amount: number;
    unit: string;
  }>;
  proteinRatio: number;
  version: number;
  status: 'draft' | 'published' | 'archived';
}