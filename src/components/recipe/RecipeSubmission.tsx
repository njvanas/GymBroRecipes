import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, Plus, Minus, ChevronRight, ChevronLeft, Save, Loader, X } from 'lucide-react';
import { useRecipeStore } from '../../store/recipeStore';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { ingredients, calculateDietaryTags } from '../../data/ingredients';
import { calculateIngredientNutrition } from '../../data/nutrients';

const MAX_IMAGE_SIZE_MB = 2; // 2MB max file size
const MAX_IMAGE_DIMENSIONS = {
  width: 2048,
  height: 2048
};

interface RecipeFormData {
  title: string;
  image: File | null;
  imagePreview: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  instructions: string[];
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

const initialFormData: RecipeFormData = {
  title: '',
  image: null,
  imagePreview: '',
  prepTime: 15,
  cookTime: 20,
  servings: 2,
  ingredients: [],
  instructions: [''],
  mealType: 'dinner'
};

export const RecipeSubmission: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();
  const { updateRecipe } = useRecipeStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RecipeFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ingredientSearch, setIngredientSearch] = useState('');

  React.useEffect(() => {
    if (editId) {
      loadRecipe(editId);
    }
  }, [editId]);

  const loadRecipe = async (id: string) => {
    try {
      const { data: recipe, error } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            name, amount, unit
          ),
          recipe_instructions (
            step_number, instruction
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (recipe) {
        setFormData({
          title: recipe.title,
          image: null,
          imagePreview: recipe.image_url,
          prepTime: recipe.prep_time_minutes,
          cookTime: recipe.cook_time_minutes,
          servings: recipe.servings,
          ingredients: recipe.recipe_ingredients,
          instructions: recipe.instructions.split('\n').filter(Boolean),
          mealType: recipe.meal_type
        });
      }
    } catch (error: any) {
      toast.error('Failed to load recipe');
      console.error('Error loading recipe:', error);
    }
  };

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_IMAGE_SIZE_MB) {
        toast.error(`Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB`);
        resolve(false);
        return;
      }

      // Check dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width > MAX_IMAGE_DIMENSIONS.width || img.height > MAX_IMAGE_DIMENSIONS.height) {
          toast.error(`Image dimensions must be ${MAX_IMAGE_DIMENSIONS.width}x${MAX_IMAGE_DIMENSIONS.height} or smaller`);
          resolve(false);
          return;
        }
        resolve(true);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        toast.error('Invalid image file');
        resolve(false);
      };
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await validateImage(file);
    if (!isValid) {
      e.target.value = '';
      return;
    }

    setFormData(prev => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const calculateNutrition = (ingredients: { name: string; amount: number; unit: string }[]) => {
    let totalProtein = 0;
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    ingredients.forEach(ing => {
      const nutrition = calculateIngredientNutrition(ing.name, ing.amount, ing.unit);
      totalProtein += nutrition.protein;
      totalCalories += nutrition.calories;
      totalCarbs += nutrition.carbs;
      totalFat += nutrition.fat;
      totalFiber += nutrition.fiber;
    });

    // Per serving
    const perServing = formData.servings || 1;
    return {
      protein: Math.round(totalProtein / perServing),
      calories: Math.round(totalCalories / perServing),
      carbs: Math.round(totalCarbs / perServing),
      fat: Math.round(totalFat / perServing),
      fiber: Math.round(totalFiber / perServing)
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const nutrition = calculateNutrition(formData.ingredients);
      const dietaryTags = calculateDietaryTags(formData.ingredients.map(ing => ing.name));

      // Upload image if new one is selected
      let imageUrl = formData.imagePreview;
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('recipe-images')
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;
        imageUrl = data.path;
      }

      const recipeData = {
        title: formData.title,
        image_url: imageUrl,
        prep_time_minutes: Math.max(0, formData.prepTime) || 15,
        cook_time_minutes: Math.max(0, formData.cookTime) || 20,
        total_time_minutes: Math.max(0, formData.prepTime + formData.cookTime) || 35,
        servings: Math.max(1, formData.servings) || 2,
        is_vegetarian: dietaryTags.isVegetarian,
        is_gluten_free: dietaryTags.isGlutenFree,
        is_dairy_free: dietaryTags.isDairyFree,
        meal_type: formData.mealType,
        calories_per_serving: nutrition.calories,
        protein_per_serving: nutrition.protein,
        carbs_per_serving: nutrition.carbs,
        fat_per_serving: nutrition.fat,
        fiber_per_serving: nutrition.fiber,
        instructions: formData.instructions.join('\n'),
        author_id: user.id,
        status: 'published'
      };

      if (editId) {
        const { error: recipeError } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', editId);

        if (recipeError) throw recipeError;

        // Update ingredients
        await supabase
          .from('recipe_ingredients')
          .delete()
          .eq('recipe_id', editId);

        await supabase
          .from('recipe_ingredients')
          .insert(formData.ingredients.map(ing => ({
            recipe_id: editId,
            ...ing
          })));

      } else {
        const { error: recipeError, data: newRecipe } = await supabase
          .from('recipes')
          .insert(recipeData)
          .select()
          .single();

        if (recipeError) throw recipeError;

        // Add ingredients
        await supabase
          .from('recipe_ingredients')
          .insert(formData.ingredients.map(ing => ({
            recipe_id: newRecipe.id,
            ...ing
          })));
      }

      toast.success(editId ? 'Recipe updated successfully!' : 'Recipe submitted successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: '', amount: 0, unit: 'g' },
      ],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ''],
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  const filteredIngredients = ingredients
    .filter(ing => 
      ing.name.toLowerCase().includes(ingredientSearch.toLowerCase()) ||
      ing.aliases.some(alias => alias.toLowerCase().includes(ingredientSearch.toLowerCase()))
    )
    .slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editId ? 'Edit Recipe' : 'Submit Your Recipe'}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {step} of 3
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full ${
                    s === step
                      ? 'bg-green-500'
                      : s < step
                      ? 'bg-green-200 dark:bg-green-800'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recipe Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter recipe title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recipe Image
                <span className="text-sm text-gray-500 ml-2">
                  (Max {MAX_IMAGE_SIZE_MB}MB, {MAX_IMAGE_DIMENSIONS.width}x{MAX_IMAGE_DIMENSIONS.height}px)
                </span>
              </label>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                {formData.imagePreview ? (
                  <>
                    <img
                      src={formData.imagePreview}
                      alt="Recipe preview"
                      className="w-full h-full object-contain rounded-xl"
                    />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: '' }))}
                      className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <X size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-xl">
                    <Camera size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload image</span>
                    <span className="text-xs text-gray-400 mt-1">
                      Recommended: 16:9 ratio
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prep Time (mins)
                </label>
                <input
                  type="number"
                  value={formData.prepTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cook Time (mins)
                </label>
                <input
                  type="number"
                  value={formData.cookTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Servings
                </label>
                <input
                  type="number"
                  value={formData.servings}
                  onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ingredients
                </label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center gap-1 text-sm text-green-500 hover:text-green-600"
                >
                  <Plus size={16} />
                  Add Ingredient
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => {
                          setIngredientSearch(e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            ingredients: prev.ingredients.map((ing, i) =>
                              i === index ? { ...ing, name: e.target.value } : ing
                            ),
                          }));
                        }}
                        className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Ingredient name"
                        required
                      />
                      {ingredientSearch && index === formData.ingredients.length - 1 && (
                        <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-10">
                          {filteredIngredients.map(ing => (
                            <button
                              key={ing.name}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  ingredients: prev.ingredients.map((i, idx) =>
                                    idx === index ? { ...i, name: ing.name } : i
                                  ),
                                }));
                                setIngredientSearch('');
                              }}
                            >
                              {ing.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="number"
                      value={ingredient.amount}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        ingredients: prev.ingredients.map((ing, i) =>
                          i === index ? { ...ing, amount: parseFloat(e.target.value) || 0 } : ing
                        ),
                      }))}
                      className="w-24 px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Amount"
                      min="0"
                      step="0.1"
                      required
                    />
                    <select
                      value={ingredient.unit}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        ingredients: prev.ingredients.map((ing, i) =>
                          i === index ? { ...ing, unit: e.target.value } : ing
                        ),
                      }))}
                      className="w-24 px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="cup">cup</option>
                      <option value="tbsp">tbsp</option>
                      <option value="tsp">tsp</option>
                      <option value="oz">oz</option>
                      <option value="lb">lb</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <Minus size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Instructions
                </label>
                <button
                  type="button"
                  onClick={addInstruction}
                  className="flex items-center gap-1 text-sm text-green-500 hover:text-green-600"
                >
                  <Plus size={16} />
                  Add Step
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={instruction}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          instructions: prev.instructions.map((ins, i) =>
                            i === index ? e.target.value : ins
                          ),
                        }))}
                        className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder={`Step ${index + 1}`}
                        rows={2}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <Minus size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meal Type
              </label>
              <select
                value={formData.mealType}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  mealType: e.target.value as 'breakfast' | 'lunch' | 'dinner',
                }))}
                className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
          ) : (
            <div />
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Next
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={20} />
                  {editId ? 'Update Recipe' : 'Submit Recipe'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};