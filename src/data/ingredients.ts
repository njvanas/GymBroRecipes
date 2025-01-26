import { Ingredient } from '../types/recipe';

export const ingredients: Ingredient[] = [
  // Meats & Proteins
  { name: 'Chicken Breast', category: 'Meats & Proteins', unit: 'oz', aliases: ['boneless chicken breast', 'skinless chicken breast'] },
  { name: 'Ground Beef', category: 'Meats & Proteins', unit: 'lb', aliases: ['minced beef', 'hamburger meat'] },
  { name: 'Salmon', category: 'Meats & Proteins', unit: 'oz', aliases: ['fresh salmon', 'salmon fillet'] },
  { name: 'Tofu', category: 'Meats & Proteins', unit: 'oz', aliases: ['bean curd', 'soybean curd'] },
  
  // Vegetables
  { name: 'Spinach', category: 'Vegetables', unit: 'cup', aliases: ['baby spinach', 'fresh spinach'] },
  { name: 'Broccoli', category: 'Vegetables', unit: 'cup', aliases: ['broccoli florets', 'fresh broccoli'] },
  { name: 'Sweet Potato', category: 'Vegetables', unit: 'medium', aliases: ['yam', 'orange sweet potato'] },
  
  // Fruits
  { name: 'Apple', category: 'Fruits', unit: 'medium', aliases: ['fresh apple', 'cooking apple'] },
  { name: 'Banana', category: 'Fruits', unit: 'medium', aliases: ['ripe banana', 'fresh banana'] },
  { name: 'Lemon', category: 'Fruits', unit: 'medium', aliases: ['fresh lemon', 'lemon juice'] },
  
  // Dairy & Eggs
  { name: 'Greek Yogurt', category: 'Dairy & Eggs', unit: 'cup', aliases: ['plain greek yogurt', 'yogurt'] },
  { name: 'Eggs', category: 'Dairy & Eggs', unit: 'large', aliases: ['fresh eggs', 'whole eggs'] },
  { name: 'Cheddar Cheese', category: 'Dairy & Eggs', unit: 'oz', aliases: ['sharp cheddar', 'mild cheddar'] },
  
  // Grains & Pasta
  { name: 'Quinoa', category: 'Grains & Pasta', unit: 'cup', aliases: ['white quinoa', 'cooked quinoa'] },
  { name: 'Brown Rice', category: 'Grains & Pasta', unit: 'cup', aliases: ['whole grain rice', 'cooked brown rice'] },
  { name: 'Whole Wheat Pasta', category: 'Grains & Pasta', unit: 'oz', aliases: ['whole grain pasta', 'wheat pasta'] },
  
  // Add more ingredients as needed...
];