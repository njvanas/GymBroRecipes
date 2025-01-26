import React, { useState, useEffect } from 'react';
import { User, Dumbbell, Target, UtensilsCrossed, Save, Loader } from 'lucide-react';
import { useRecipeStore } from '../../store/recipeStore';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { UserRecipes } from './UserRecipes';
import { AccountSettings } from './AccountSettings';

const FITNESS_GOALS = [
  'Build Muscle',
  'Lose Fat',
  'Maintain Weight',
  'Improve Performance',
  'General Health'
];

const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo'
];

export const UserProfile = () => {
  const { userProfile, setUserProfile } = useRecipeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'recipes'>('profile');
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    fitnessGoals: userProfile?.fitnessGoals || [],
    dietaryRestrictions: userProfile?.dietaryRestrictions || [],
    proteinTarget: userProfile?.proteinTarget || 150,
    calorieTarget: userProfile?.calorieTarget || 2000
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFormData({
            displayName: profile.display_name,
            fitnessGoals: profile.fitness_goals,
            dietaryRestrictions: profile.dietary_restrictions,
            proteinTarget: profile.protein_target,
            calorieTarget: profile.calorie_target
          });
        }
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          display_name: formData.displayName,
          fitness_goals: formData.fitnessGoals,
          dietary_restrictions: formData.dietaryRestrictions,
          protein_target: formData.proteinTarget,
          calorie_target: formData.calorieTarget
        });

      if (error) throw error;

      setUserProfile({
        id: user.id,
        displayName: formData.displayName,
        fitnessGoals: formData.fitnessGoals,
        dietaryRestrictions: formData.dietaryRestrictions,
        proteinTarget: formData.proteinTarget,
        calorieTarget: formData.calorieTarget,
        preferredTheme: userProfile?.preferredTheme || 'light',
        measurementSystem: userProfile?.measurementSystem || 'metric',
        languagePreference: userProfile?.languagePreference || 'en'
      });

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter(g => g !== goal)
        : [...prev.fitnessGoals, goal]
    }));
  };

  const toggleDiet = (diet: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(diet)
        ? prev.dietaryRestrictions.filter(d => d !== diet)
        : [...prev.dietaryRestrictions, diet]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <User className="text-green-500" size={32} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
      </div>

      <div className="mb-8 border-b dark:border-gray-800">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-green-500 text-green-500'
                : 'border-transparent text-gray-600 dark:text-gray-400'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'account'
                ? 'border-green-500 text-green-500'
                : 'border-transparent text-gray-600 dark:text-gray-400'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'recipes'
                ? 'border-green-500 text-green-500'
                : 'border-transparent text-gray-600 dark:text-gray-400'
            }`}
          >
            Recipes
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Your display name"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Dumbbell size={20} className="text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Fitness Goals
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {FITNESS_GOALS.map(goal => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    formData.fitnessGoals.includes(goal)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={20} className="text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Dietary Restrictions
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {DIETARY_RESTRICTIONS.map(diet => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => toggleDiet(diet)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    formData.dietaryRestrictions.includes(diet)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target size={20} className="text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Daily Targets
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Protein Target (g)
                </label>
                <input
                  type="number"
                  value={formData.proteinTarget}
                  onChange={(e) => setFormData(prev => ({ ...prev, proteinTarget: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calorie Target
                </label>
                <input
                  type="number"
                  value={formData.calorieTarget}
                  onChange={(e) => setFormData(prev => ({ ...prev, calorieTarget: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </form>
      )}

      {activeTab === 'account' && <AccountSettings />}
      {activeTab === 'recipes' && <UserRecipes />}
    </div>
  );
};