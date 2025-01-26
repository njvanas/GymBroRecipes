import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { Filters } from './components/Filters';
import { RecipeCard } from './components/RecipeCard';
import { MealPlanner } from './components/MealPlanner';
import { ShoppingList } from './components/ShoppingList';
import { UserProfile } from './components/profile/UserProfile';
import { RecipeSubmission } from './components/recipe/RecipeSubmission';
import { AuthModal } from './components/auth/AuthModal';
import { useRecipeStore } from './store/recipeStore';

function App() {
  const { recipes, favorites, userProfile, loadUserProfile } = useRecipeStore();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  React.useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  // Only show first 10 recipes
  const displayedRecipes = recipes.slice(0, 10);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Toaster position="top-right" />
          <Header onAuthClick={() => setShowAuthModal(true)} />
          
          <main className="max-w-7xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <div className="flex flex-col items-center gap-6">
                  <SearchBar />
                  <Filters />

                  {displayedRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                      {displayedRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">
                        Enter ingredients above to find matching recipes
                      </p>
                    </div>
                  )}

                  {favorites.length > 0 && (
                    <div className="w-full mt-12">
                      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Favorite Recipes
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {favorites.map((recipe) => (
                          <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              } />
              <Route path="/meal-plan" element={<MealPlanner />} />
              <Route path="/shopping" element={<ShoppingList />} />
              <Route path="/profile/*" element={
                userProfile ? <UserProfile /> : <Navigate to="/" />
              } />
              <Route path="/submit" element={
                userProfile ? <RecipeSubmission /> : <Navigate to="/" />
              } />
            </Routes>
          </main>

          {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;