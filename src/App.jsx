import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { get } from 'idb-keyval';
import { ToastProvider } from './components/ui/Toast';
import { TopNavigation, BottomNavigation } from './components/ui/Navigation';
import { 
  HomeIcon, 
  WorkoutIcon, 
  NutritionIcon, 
  WaterIcon, 
  MetricsIcon, 
  PhotosIcon, 
  StatsIcon 
} from './components/ui/icons';
import Home from './components/Home';
import WorkoutPlanner from './components/WorkoutPlanner';
import NutritionTracker from './components/NutritionTracker';
import BodyMetrics from './components/BodyMetrics';
import ProgressPhotos from './components/ProgressPhotos';
import Stats from './components/Stats';
import WaterTracker from './components/WaterTracker';
import UpgradeBanner from './components/UpgradeBanner';
import AddToHomeScreen from './components/AddToHomeScreen';
import ExportImport from './components/ExportImport';
import { PageLoader } from './components/ui/LoadingSpinner';

const navigationItems = [
  { to: '/', icon: HomeIcon, label: 'Home' },
  { to: '/workout', icon: WorkoutIcon, label: 'Workouts' },
  { to: '/nutrition', icon: NutritionIcon, label: 'Nutrition' },
  { to: '/water', icon: WaterIcon, label: 'Water' },
  { to: '/metrics', icon: MetricsIcon, label: 'Metrics' },
  { to: '/photos', icon: PhotosIcon, label: 'Photos' },
  { to: '/stats', icon: StatsIcon, label: 'Stats' },
  { to: '/export', icon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
    </svg>
  ), label: 'Export' },
];

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const stored = await get('user');
        setUser(stored || { is_paid: false });
      } catch (error) {
        console.error('Error loading user data:', error);
        setUser({ is_paid: false });
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <ToastProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
          {/* Header */}
          <header className="sticky top-0 z-30 glass-effect border-b border-gray-200/20 dark:border-gray-700/20">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-gradient">
                    GymBroRecipes
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your fitness journey starts here
                  </p>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden sm:block">
                  <TopNavigation items={navigationItems} />
                </div>
              </div>
            </div>
          </header>

          {/* Upgrade Banner */}
          <UpgradeBanner />
          
          {/* Add to Home Screen Prompt */}
          <AddToHomeScreen />

          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-6 pb-20 sm:pb-6">
            <div className="animate-fade-in">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/workout" element={<WorkoutPlanner />} />
                <Route path="/nutrition" element={<NutritionTracker />} />
                <Route path="/water" element={<WaterTracker />} />
                <Route path="/metrics" element={<BodyMetrics />} />
                <Route path="/photos" element={<ProgressPhotos />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/export" element={<ExportImport />} />
              </Routes>
            </div>
          </main>

          {/* Mobile Bottom Navigation */}
          <BottomNavigation items={navigationItems} />

          {/* Footer */}
          <footer className="hidden sm:block bg-white/50 dark:bg-gray-900/50 border-t border-gray-200/20 dark:border-gray-700/20 text-center py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} GymBroRecipes - Track. Progress. Achieve.
            </p>
          </footer>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;