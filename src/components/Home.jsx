import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, MetricCard } from './ui/Card';
import { CaloriesIcon, WeightIcon, WorkoutIcon, WaterIcon } from './ui/icons';
import Button from './ui/Button';
import ProgressBar from './ui/ProgressBar';
import { useToast } from './ui/Toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ workouts: 0, meals: 0, metrics: 0, water: 0 });
  const [todayStats, setTodayStats] = useState({ calories: 0, water: 0, workouts: 0 });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function load() {
      try {
        const stored = await get('user');
        const u = stored || { is_paid: false };
        setUser(u);

        if (!u.is_paid || !supabase) {
          const workouts = (await get('workouts')) || [];
          const meals = (await get('nutrition_logs')) || [];
          const metrics = (await get('body_metrics')) || [];
          const water = (await get('water_logs')) || [];
          
          const today = new Date().toISOString().split('T')[0];
          const todayNutrition = meals.find(m => m.date === today);
          const todayWater = water.find(w => w.date === today);
          const todayWorkouts = workouts.filter(w => 
            new Date(w.date).toISOString().split('T')[0] === today
          );

          setStats({
            workouts: workouts.length,
            meals: meals.length,
            metrics: metrics.length,
            water: water.length,
          });

          setTodayStats({
            calories: todayNutrition?.calories || 0,
            water: todayWater?.amount || 0,
            workouts: todayWorkouts.length,
          });
        } else {
          try {
            const [{ count: w }, { count: n }, { count: m }] = await Promise.all([
              supabase.from('workouts').select('*', { count: 'exact', head: true }),
              supabase.from('nutrition_logs').select('*', { count: 'exact', head: true }),
              supabase.from('body_metrics').select('*', { count: 'exact', head: true }),
            ]);
            setStats({ workouts: w || 0, meals: n || 0, metrics: m || 0, water: 0 });
          } catch (err) {
            console.error('Failed to fetch stats', err);
            toast.error('Failed to load statistics');
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  const handleUpgrade = () => {
    toast.info('Upgrade feature coming soon!', 'Cloud Sync');
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'workout':
        navigate('/workout');
        toast.info('Ready to log your workout!');
        break;
      case 'meal':
        navigate('/nutrition');
        toast.info('Time to track your nutrition!');
        break;
      case 'water':
        navigate('/water');
        toast.info('Stay hydrated!');
        break;
      case 'weight':
        navigate('/metrics');
        toast.info('Track your progress!');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="text-center space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-1/2"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-gradient">
            Welcome Back!
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Track your fitness journey with precision. Monitor workouts, nutrition, and progress 
            all in one beautiful, offline-first app.
          </p>
        </div>

        {user && !user.is_paid && (
          <div className="inline-block">
            <Button onClick={handleUpgrade} size="lg" className="shadow-2xl">
              ✨ Upgrade for Cloud Sync
            </Button>
          </div>
        )}
      </div>

      {/* Today's Progress */}
      <Card className="animate-bounce-in">
        <CardContent>
          <h3 className="text-2xl font-bold mb-6 text-center">Today's Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CaloriesIcon className="text-orange-500" />
                <span className="font-medium">Calories</span>
              </div>
              <ProgressBar 
                value={todayStats.calories} 
                max={2000} 
                color="yellow"
                showLabel
                label={`${todayStats.calories} / 2000 kcal`}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <WaterIcon className="text-blue-500" />
                <span className="font-medium">Water</span>
              </div>
              <ProgressBar 
                value={todayStats.water} 
                max={2000} 
                color="blue"
                showLabel
                label={`${todayStats.water} / 2000 ml`}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <WorkoutIcon className="text-green-500" />
                <span className="font-medium">Workouts</span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {todayStats.workouts}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Workouts"
          value={stats.workouts}
          icon={WorkoutIcon}
          color="green"
          className="animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        />
        <MetricCard
          title="Nutrition Logs"
          value={stats.meals}
          icon={CaloriesIcon}
          color="yellow"
          className="animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        />
        <MetricCard
          title="Body Metrics"
          value={stats.metrics}
          icon={WeightIcon}
          color="purple"
          className="animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        />
        <MetricCard
          title="Water Logs"
          value={stats.water}
          icon={WaterIcon}
          color="blue"
          className="animate-slide-up"
          style={{ animationDelay: '0.4s' }}
        />
      </div>

      {/* Quick Actions */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <CardContent>
          <h3 className="text-2xl font-bold mb-6 text-center">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="secondary" 
              className="h-20 flex-col gap-2 hover:scale-105 transition-transform"
              onClick={() => handleQuickAction('workout')}
            >
              <WorkoutIcon className="w-6 h-6" />
              <span>Log Workout</span>
            </Button>
            <Button 
              variant="secondary" 
              className="h-20 flex-col gap-2 hover:scale-105 transition-transform"
              onClick={() => handleQuickAction('meal')}
            >
              <CaloriesIcon className="w-6 h-6" />
              <span>Add Meal</span>
            </Button>
            <Button 
              variant="secondary" 
              className="h-20 flex-col gap-2 hover:scale-105 transition-transform"
              onClick={() => handleQuickAction('water')}
            >
              <WaterIcon className="w-6 h-6" />
              <span>Log Water</span>
            </Button>
            <Button 
              variant="secondary" 
              className="h-20 flex-col gap-2 hover:scale-105 transition-transform"
              onClick={() => handleQuickAction('weight')}
            >
              <WeightIcon className="w-6 h-6" />
              <span>Record Weight</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <CardContent>
            <h3 className="text-xl font-bold mb-4">🏋️ Workout Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Log exercises, sets, reps, and weights. Track your strength progress over time 
              with detailed analytics and personal records.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Exercise database with search</li>
              <li>• RPE and volume tracking</li>
              <li>• Progress visualization</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <CardContent>
            <h3 className="text-xl font-bold mb-4">🥗 Nutrition Monitoring</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Track calories, macros, and meals. Search from a comprehensive food database 
              to make logging quick and accurate.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Calorie and macro tracking</li>
              <li>• Food database integration</li>
              <li>• Daily nutrition goals</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Notice */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="text-center">
          <h3 className="text-xl font-bold mb-2">🔒 Privacy First</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Your data stays on your device by default. No tracking, no ads, no data mining. 
            Upgrade for optional cloud sync with end-to-end encryption.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;