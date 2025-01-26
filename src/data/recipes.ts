import { Recipe } from '../types/recipe';

export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Greek Yogurt Protein Bowl",
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38",
    readyInMinutes: 10,
    servings: 1,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    totalTimeMinutes: 10,
    difficultyLevel: "easy",
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: false,
    mealType: "breakfast",
    caloriesPerServing: 350,
    proteinPerServing: 28,
    carbsPerServing: 35,
    fatPerServing: 12,
    fiberPerServing: 6,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 350, unit: "kcal" },
        { name: "Protein", amount: 28, unit: "g" },
        { name: "Carbohydrates", amount: 35, unit: "g" },
        { name: "Fat", amount: 12, unit: "g" },
        { name: "Fiber", amount: 6, unit: "g" }
      ]
    },
    extendedIngredients: [
      { id: 1, original: "1 cup Greek yogurt", amount: 1, unit: "cup" },
      { id: 2, original: "1 scoop protein powder", amount: 1, unit: "scoop" },
      { id: 3, original: "1/2 cup mixed berries", amount: 0.5, unit: "cup" },
      { id: 4, original: "1/4 cup granola", amount: 0.25, unit: "cup" },
      { id: 5, original: "1 tbsp honey", amount: 1, unit: "tbsp" }
    ],
    instructions: "1. Add Greek yogurt to a bowl\n2. Mix in protein powder until smooth\n3. Top with berries and granola\n4. Drizzle with honey",
    storageInstructions: "Best consumed immediately. If needed, store without granola for up to 24 hours.",
    shelfLifeDays: 1
  },
  {
    id: 2,
    title: "Grilled Chicken and Quinoa Bowl",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
    readyInMinutes: 25,
    servings: 1,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTimeMinutes: 25,
    difficultyLevel: "medium",
    isVegetarian: false,
    isGlutenFree: true,
    isDairyFree: true,
    mealType: "lunch",
    caloriesPerServing: 450,
    proteinPerServing: 40,
    carbsPerServing: 45,
    fatPerServing: 15,
    fiberPerServing: 8,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 450, unit: "kcal" },
        { name: "Protein", amount: 40, unit: "g" },
        { name: "Carbohydrates", amount: 45, unit: "g" },
        { name: "Fat", amount: 15, unit: "g" },
        { name: "Fiber", amount: 8, unit: "g" }
      ]
    },
    extendedIngredients: [
      { id: 1, original: "6 oz chicken breast", amount: 6, unit: "oz" },
      { id: 2, original: "1/2 cup quinoa, cooked", amount: 0.5, unit: "cup" },
      { id: 3, original: "1 cup mixed vegetables", amount: 1, unit: "cup" },
      { id: 4, original: "1 tbsp olive oil", amount: 1, unit: "tbsp" },
      { id: 5, original: "Seasonings to taste", amount: 1, unit: "serving" }
    ],
    instructions: "1. Season chicken breast with herbs and spices\n2. Grill chicken for 6-7 minutes per side\n3. Cook quinoa according to package instructions\n4. Steam mixed vegetables\n5. Combine all ingredients in a bowl",
    storageInstructions: "Store in an airtight container. Can be meal prepped for up to 3 days.",
    shelfLifeDays: 3
  },
  {
    id: 3,
    title: "Tofu Scramble with Vegetables",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    readyInMinutes: 20,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    totalTimeMinutes: 20,
    difficultyLevel: "easy",
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    mealType: "breakfast",
    caloriesPerServing: 280,
    proteinPerServing: 25,
    carbsPerServing: 15,
    fatPerServing: 18,
    fiberPerServing: 5,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 280, unit: "kcal" },
        { name: "Protein", amount: 25, unit: "g" },
        { name: "Carbohydrates", amount: 15, unit: "g" },
        { name: "Fat", amount: 18, unit: "g" },
        { name: "Fiber", amount: 5, unit: "g" }
      ]
    },
    extendedIngredients: [
      { id: 1, original: "14 oz firm tofu, crumbled", amount: 14, unit: "oz" },
      { id: 2, original: "1 cup spinach", amount: 1, unit: "cup" },
      { id: 3, original: "1/2 bell pepper, diced", amount: 0.5, unit: "whole" },
      { id: 4, original: "1/4 onion, diced", amount: 0.25, unit: "whole" },
      { id: 5, original: "2 tbsp nutritional yeast", amount: 2, unit: "tbsp" },
      { id: 6, original: "1 tsp turmeric", amount: 1, unit: "tsp" }
    ],
    instructions: "1. Press tofu to remove excess water\n2. Crumble tofu into a bowl\n3. Heat pan with oil, add onions and peppers\n4. Add crumbled tofu, turmeric, and seasonings\n5. Cook until vegetables are soft\n6. Add spinach and nutritional yeast\n7. Cook until spinach wilts",
    storageInstructions: "Store in an airtight container in the refrigerator. Best consumed within 2 days.",
    shelfLifeDays: 2
  },
  {
    id: 4,
    title: "Baked Salmon with Roasted Vegetables",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    readyInMinutes: 30,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    totalTimeMinutes: 30,
    difficultyLevel: "medium",
    isVegetarian: false,
    isGlutenFree: true,
    isDairyFree: true,
    mealType: "dinner",
    caloriesPerServing: 420,
    proteinPerServing: 35,
    carbsPerServing: 25,
    fatPerServing: 22,
    fiberPerServing: 7,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 420, unit: "kcal" },
        { name: "Protein", amount: 35, unit: "g" },
        { name: "Carbohydrates", amount: 25, unit: "g" },
        { name: "Fat", amount: 22, unit: "g" },
        { name: "Fiber", amount: 7, unit: "g" }
      ]
    },
    extendedIngredients: [
      { id: 1, original: "8 oz salmon fillet", amount: 8, unit: "oz" },
      { id: 2, original: "2 cups broccoli florets", amount: 2, unit: "cup" },
      { id: 3, original: "1 cup cherry tomatoes", amount: 1, unit: "cup" },
      { id: 4, original: "2 tbsp olive oil", amount: 2, unit: "tbsp" },
      { id: 5, original: "2 cloves garlic, minced", amount: 2, unit: "clove" },
      { id: 6, original: "1 lemon", amount: 1, unit: "whole" }
    ],
    instructions: "1. Preheat oven to 400°F (200°C)\n2. Place salmon on baking sheet\n3. Toss vegetables with olive oil and garlic\n4. Arrange vegetables around salmon\n5. Season everything with salt and pepper\n6. Squeeze half lemon over salmon\n7. Bake for 18-20 minutes\n8. Serve with remaining lemon",
    storageInstructions: "Best consumed immediately. If storing, keep in an airtight container for up to 2 days.",
    shelfLifeDays: 2
  },
  {
    id: 5,
    title: "Turkey and Sweet Potato Skillet",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    readyInMinutes: 25,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTimeMinutes: 25,
    difficultyLevel: "easy",
    isVegetarian: false,
    isGlutenFree: true,
    isDairyFree: true,
    mealType: "lunch",
    caloriesPerServing: 380,
    proteinPerServing: 32,
    carbsPerServing: 30,
    fatPerServing: 16,
    fiberPerServing: 5,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 380, unit: "kcal" },
        { name: "Protein", amount: 32, unit: "g" },
        { name: "Carbohydrates", amount: 30, unit: "g" },
        { name: "Fat", amount: 16, unit: "g" },
        { name: "Fiber", amount: 5, unit: "g" }
      ]
    },
    extendedIngredients: [
      { id: 1, original: "1 lb ground turkey", amount: 1, unit: "lb" },
      { id: 2, original: "2 medium sweet potatoes, diced", amount: 2, unit: "medium" },
      { id: 3, original: "1 bell pepper, diced", amount: 1, unit: "whole" },
      { id: 4, original: "1 onion, diced", amount: 1, unit: "whole" },
      { id: 5, original: "2 cloves garlic, minced", amount: 2, unit: "clove" },
      { id: 6, original: "2 tbsp olive oil", amount: 2, unit: "tbsp" }
    ],
    instructions: "1. Heat olive oil in a large skillet\n2. Add diced sweet potatoes, cook until slightly softened\n3. Add onion and bell pepper, cook until vegetables are tender\n4. Add ground turkey and garlic\n5. Cook until turkey is browned and cooked through\n6. Season with salt, pepper, and preferred spices",
    storageInstructions: "Store in an airtight container in the refrigerator for up to 4 days. Great for meal prep.",
    shelfLifeDays: 4
  },
  {
    id: 6,
    title: "Chickpea and Spinach Curry",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
    readyInMinutes: 30,
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    totalTimeMinutes: 30,
    difficultyLevel: "medium",
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    mealType: "dinner",
    caloriesPerServing: 320,
    proteinPerServing: 26,
    carbsPerServing: 42,
    fatPerServing: 8,
    fiberPerServing: 12,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 320, unit: "kcal" },
        { name: "Protein", amount: 26, unit: "g" },
        { name: "Carbohydrates", amount: 42, unit: "g" },
        { name: "Fat", amount: 8, unit: "g" },
        { name: "Fiber", amount: 12, unit: "g" }
      ]
    },
    extendedIngredients: [
      { id: 1, original: "2 cans chickpeas, drained", amount: 2, unit: "can" },
      { id: 2, original: "4 cups fresh spinach", amount: 4, unit: "cup" },
      { id: 3, original: "1 onion, diced", amount: 1, unit: "whole" },
      { id: 4, original: "3 cloves garlic, minced", amount: 3, unit: "clove" },
      { id: 5, original: "2 tbsp curry powder", amount: 2, unit: "tbsp" },
      { id: 6, original: "1 can coconut milk", amount: 1, unit: "can" }
    ],
    instructions: "1. Sauté onion and garlic until translucent\n2. Add curry powder and toast for 1 minute\n3. Add chickpeas and coconut milk\n4. Simmer for 15 minutes\n5. Add spinach and cook until wilted\n6. Season with salt and pepper to taste",
    storageInstructions: "Store in an airtight container in the refrigerator for up to 5 days. Freezes well for up to 3 months.",
    shelfLifeDays: 5
  },
  {
    id: 7,
    title: "Protein Pancakes",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
    readyInMinutes: 20,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    totalTimeMinutes: 20,
    difficultyLevel: "easy",
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: false,
    mealType: "breakfast",
    caloriesPerServing: 290,
    proteinPerServing: 28,
    carbsPerServing: 25,
    fatPerServing: 10,
    fiberPerServing: 4,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 290, unit: "kcal" },
        { name: "Protein", amount: 28, unit: "g" },
        { name: "Carbohydrates", amount: 25, unit: "g" },
        { name: "Fat", amount: 10, unit: "g" },
        { name: "Fiber", amount: 4, unit: "g" }
      ]
    },
    extendedIngredients: [
      { id: 1, original: "1 cup oat flour", amount: 1, unit: "cup" },
      { id: 2, original: "2 scoops vanilla protein powder", amount: 2, unit: "scoop" },
      { id: 3, original: "2 large eggs", amount: 2, unit: "large" },
      { id: 4, original: "1/2 cup Greek yogurt", amount: 0.5, unit: "cup" },
      { id: 5, original: "1 tsp baking powder", amount: 1, unit: "tsp" },
      { id: 6, original: "1/4 cup almond milk", amount: 0.25, unit: "cup" }
    ],
    instructions: "1. Mix all dry ingredients in a bowl\n2. Whisk together wet ingredients in another bowl\n3. Combine wet and dry ingredients\n4. Heat non-stick pan over medium heat\n5. Pour batter to form pancakes\n6. Cook until bubbles form, then flip\n7. Cook other side until golden",
    storageInstructions: "Best served fresh. Can be stored in the refrigerator for up to 2 days. Reheat in toaster or microwave.",
    shelfLifeDays: 2
  }
];