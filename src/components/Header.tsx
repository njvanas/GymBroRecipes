import React from 'react';
import { Dumbbell, Moon, Sun, User, Calendar, ShoppingBag, PlusCircle, Globe2, Scale } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useRecipeStore } from '../store/recipeStore';
import { useSettingsStore } from '../store/settingsStore';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onAuthClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { userProfile } = useRecipeStore();
  const { measurementSystem, language, setMeasurementSystem, setLanguage } = useSettingsStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Dumbbell className="text-green-500 dark:text-green-400 transition-transform group-hover:rotate-12" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gym Bro Recipes
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                High protein, low excuses
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition-all ${
                  isActive('/')
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Recipes
              </Link>
              <Link
                to="/meal-plan"
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  isActive('/meal-plan')
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Calendar size={18} />
                Meal Plan
              </Link>
              <Link
                to="/shopping"
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  isActive('/shopping')
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <ShoppingBag size={18} />
                Shopping List
              </Link>
              {userProfile && (
                <Link
                  to="/submit"
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    isActive('/submit')
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <PlusCircle size={18} />
                  Submit Recipe
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
                <Scale size={16} className="text-gray-500 dark:text-gray-400" />
                <select
                  value={measurementSystem}
                  onChange={(e) => setMeasurementSystem(e.target.value as 'metric' | 'imperial')}
                  className="bg-transparent text-sm text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
                >
                  <option value="metric">Metric</option>
                  <option value="imperial">Imperial</option>
                </select>
              </div>

              <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
                <Globe2 size={16} className="text-gray-500 dark:text-gray-400" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-sm text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
                >
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="text-gray-600 dark:text-gray-400" size={20} />
              ) : (
                <Sun className="text-gray-600 dark:text-gray-400" size={20} />
              )}
            </button>

            {userProfile ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {userProfile.displayName}
                </span>
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                  <User size={16} className="text-green-600 dark:text-green-300" />
                </div>
              </Link>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all hover:shadow-md active:shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};