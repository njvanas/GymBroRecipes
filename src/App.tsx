import React from 'react';
import { Toaster } from 'react-hot-toast';
import { SearchBar } from './components/SearchBar';
import { Filters } from './components/Filters';
import { RecipeCard } from './components/RecipeCard';
import { useRecipeStore } from './store/recipeStore';
import { ChefHat } from 'lucide-react';

function App() {
  const { recipes, favorites } = useRecipeStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <ChefHat className="text-green-500" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">
              Healthy Recipe Finder
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Find protein-rich recipes with ingredients you have at home
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          <SearchBar />
          <Filters />

          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Enter ingredients above to find matching recipes
              </p>
            </div>
          )}

          {favorites.length > 0 && (
            <div className="w-full mt-12">
              <h2 className="text-xl font-semibold mb-4">Favorite Recipes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;