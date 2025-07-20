import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { get } from 'idb-keyval';
import Home from './components/Home';
import WorkoutPlanner from './components/WorkoutPlanner';
import NutritionTracker from './components/NutritionTracker';
import BodyMetrics from './components/BodyMetrics';
import ProgressPhotos from './components/ProgressPhotos';
import UpgradeBanner from './components/UpgradeBanner';
import Link from './components/ui/Link';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const stored = await get('user');
      setUser(stored || { is_paid: false });
      setLoading(false);
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-4 text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 bg-slate-900/50 backdrop-blur">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold md:text-4xl text-white">GymBroRecipes</h1>
            <nav className="space-x-4">
              <Link className="text-base font-medium text-gray-300 hover:text-blue-400 transition-colors" to="/">Home</Link>
              <Link className="text-base font-medium text-gray-300 hover:text-blue-400 transition-colors" to="/workout">Workouts</Link>
              <Link className="text-base font-medium text-gray-300 hover:text-blue-400 transition-colors" to="/nutrition">Nutrition</Link>
              <Link className="text-base font-medium text-gray-300 hover:text-blue-400 transition-colors" to="/metrics">Metrics</Link>
              <Link className="text-base font-medium text-gray-300 hover:text-blue-400 transition-colors" to="/photos">Photos</Link>
            </nav>
          </div>
        </header>

        <UpgradeBanner />

        <main className="flex-1 container mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workout" element={<WorkoutPlanner />} />
            <Route path="/nutrition" element={<NutritionTracker />} />
            <Route path="/metrics" element={<BodyMetrics />} />
            <Route path="/photos" element={<ProgressPhotos />} />
          </Routes>
        </main>

        <footer className="bg-slate-900/50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-400 text-center py-4">
          &copy; {new Date().getFullYear()} GymBroRecipes
        </footer>
      </div>
    </Router>
  );
}

export default App;
