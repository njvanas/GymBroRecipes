import React, { useEffect, useState } from 'react';
import { get } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';
import { Card, CardHeader, CardContent, MetricCard } from './ui/Card';
import { StatsIcon, TrendUpIcon, TrendDownIcon, CaloriesIcon, WeightIcon, WorkoutIcon, WaterIcon } from './ui/icons';
import Charts from './Charts';
import { useToast } from './ui/Toast';
import LoadingSpinner from './ui/LoadingSpinner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const Stats = () => {
  const [user, setUser] = useState(null);
  const [bodyMetrics, setBodyMetrics] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [waterLogs, setWaterLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    avgCalories: 0,
    currentWeight: 0,
    weightTrend: 0,
    avgWater: 0,
    totalVolume: 0,
  });
  const toast = useToast();

  useEffect(() => {
    async function loadUser() {
      try {
        const stored = await get('user');
        setUser(stored || { is_paid: false });
      } catch (error) {
        console.error('Error loading user:', error);
        toast.error('Failed to load user data');
      }
    }
    loadUser();
  }, [toast]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      if (!user || !user.is_paid || !supabase) {
        const metrics = (await get('body_metrics')) || [];
        const nutritionLogs = (await get('nutrition_logs')) || [];
        const workoutsLocal = (await get('workouts')) || [];
        const waterLogsLocal = (await get('water_logs')) || [];
        
        setBodyMetrics(metrics);
        setNutrition(nutritionLogs);
        setWorkouts(workoutsLocal);
        setWaterLogs(waterLogsLocal);
        calculateStats(metrics, nutritionLogs, workoutsLocal, waterLogsLocal);
      } else {
        const [{ data: m }, { data: n }, { data: w }] = await Promise.all([
          supabase.from('body_metrics').select('*'),
          supabase.from('nutrition_logs').select('*'),
          supabase.from('workouts').select('*'),
        ]);
        
        const waterLogsLocal = (await get('water_logs')) || [];
        
        setBodyMetrics(m || []);
        setNutrition(n || []);
        setWorkouts(w || []);
        setWaterLogs(waterLogsLocal);
        calculateStats(m || [], n || [], w || [], waterLogsLocal);
      }
    } catch (err) {
      console.error('Error loading data', err);
      toast.error('Failed to load statistics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (metrics, nutritionLogs, workoutLogs, waterLogs) => {
    // Calculate weight trend
    const sortedMetrics = [...metrics].sort((a, b) => new Date(a.date) - new Date(b.date));
    const currentWeight = sortedMetrics.length > 0 ? sortedMetrics[sortedMetrics.length - 1].weight : 0;
    
    let weightTrend = 0;
    if (sortedMetrics.length >= 2) {
      const recent = sortedMetrics.slice(-5); // Last 5 entries
      const older = sortedMetrics.slice(-10, -5); // Previous 5 entries
      if (recent.length > 0 && older.length > 0) {
        const recentAvg = recent.reduce((sum, m) => sum + m.weight, 0) / recent.length;
        const olderAvg = older.reduce((sum, m) => sum + m.weight, 0) / older.length;
        weightTrend = ((recentAvg - olderAvg) / olderAvg) * 100;
      }
    }

    // Calculate average calories
    const avgCalories = nutritionLogs.length > 0 
      ? Math.round(nutritionLogs.reduce((sum, log) => sum + (log.calories || 0), 0) / nutritionLogs.length)
      : 0;

    // Calculate total workout volume
    const totalVolume = workoutLogs.reduce((total, workout) => {
      if (Array.isArray(workout.exercises)) {
        return total + workout.exercises.reduce((workoutTotal, exercise) => {
          const sets = Number(exercise.sets) || 0;
          const reps = Number(exercise.reps) || 0;
          const weight = Number(exercise.weight) || 0;
          return workoutTotal + (sets * reps * weight);
        }, 0);
      }
      return total;
    }, 0);

    // Calculate average water intake
    const avgWater = waterLogs.length > 0
      ? Math.round(waterLogs.reduce((sum, log) => sum + (log.amount || 0), 0) / waterLogs.length)
      : 0;

    setStats({
      totalWorkouts: workoutLogs.length,
      avgCalories,
      currentWeight,
      weightTrend,
      avgWater,
      totalVolume: Math.round(totalVolume),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4">
          <StatsIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          Progress Statistics
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Visualize your fitness journey with comprehensive charts and key performance metrics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <MetricCard
          title="Total Workouts"
          value={stats.totalWorkouts}
          icon={WorkoutIcon}
          color="green"
        />
        <MetricCard
          title="Avg Calories"
          value={stats.avgCalories}
          unit="kcal"
          icon={CaloriesIcon}
          color="yellow"
        />
        <MetricCard
          title="Current Weight"
          value={stats.currentWeight}
          unit="kg"
          trend={stats.weightTrend}
          icon={WeightIcon}
          color="purple"
        />
        <MetricCard
          title="Avg Water"
          value={stats.avgWater}
          unit="ml"
          icon={WaterIcon}
          color="blue"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
              {stats.totalVolume}
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Total Volume (kg)</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Lifetime training volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {bodyMetrics.length}
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Body Measurements</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tracking sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {nutrition.length}
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Nutrition Logs</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Days tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <Charts
          bodyMetricsData={bodyMetrics}
          nutritionData={nutrition}
          workoutData={workouts}
        />
      </div>

      {/* Insights */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendUpIcon className="w-6 h-6 text-green-500" />
            Insights & Trends
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance Highlights
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {stats.totalWorkouts} total workouts completed
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {Math.round(stats.totalVolume / 1000)}kg total weight lifted
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  {bodyMetrics.length} body composition measurements
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Nutrition Summary
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  {stats.avgCalories} average daily calories
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  {nutrition.length} days of nutrition tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  {stats.avgWater}ml average daily water intake
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;