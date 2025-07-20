import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { get } from 'idb-keyval';
import Home from './components/Home';
import WorkoutPlanner from './components/WorkoutPlanner';
import NutritionTracker from './components/NutritionTracker';
import BodyMetrics from './components/BodyMetrics';
import UpgradeBanner from './components/UpgradeBanner';

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
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">GymBroRecipes</h1>
          <nav className="space-x-4">
            <Link className="hover:underline" to="/">Home</Link>
            <Link className="hover:underline" to="/workout">Workouts</Link>
            <Link className="hover:underline" to="/nutrition">Nutrition</Link>
            <Link className="hover:underline" to="/metrics">Metrics</Link>
          </nav>
        </header>

        {!user.is_paid && <UpgradeBanner />}

        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workout" element={<WorkoutPlanner />} />
            <Route path="/nutrition" element={<NutritionTracker />} />
            <Route path="/metrics" element={<BodyMetrics />} />
          </Routes>
        </main>

        <footer className="bg-gray-100 text-center p-4 text-sm">
          &copy; {new Date().getFullYear()} GymBroRecipes
        </footer>
      </div>
    </Router>
  );
}

export default App;
