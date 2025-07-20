import React, { useEffect, useState } from 'react';
import { get } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';
import Charts from './Charts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const Stats = () => {
  const [user, setUser] = useState(null);
  const [bodyMetrics, setBodyMetrics] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    async function loadUser() {
      const stored = await get('user');
      setUser(stored || { is_paid: false });
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user || !user.is_paid || !supabase) {
      const metrics = (await get('body_metrics')) || [];
      const nutritionLogs = (await get('nutrition_logs')) || [];
      const workoutsLocal = (await get('workouts')) || [];
      setBodyMetrics(metrics);
      setNutrition(nutritionLogs);
      setWorkouts(workoutsLocal);
    } else {
      try {
        const [{ data: m }, { data: n }, { data: w }] = await Promise.all([
          supabase.from('body_metrics').select('*'),
          supabase.from('nutrition_logs').select('*'),
          supabase.from('workouts').select('*'),
        ]);
        setBodyMetrics(m || []);
        setNutrition(n || []);
        setWorkouts(w || []);
      } catch (err) {
        console.error('Error loading data', err);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold md:text-4xl text-center">Progress Stats</h1>
      <Charts
        bodyMetricsData={bodyMetrics}
        nutritionData={nutrition}
        workoutData={workouts}
      />
    </div>
  );
};

export default Stats;
