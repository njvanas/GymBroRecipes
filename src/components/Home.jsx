import React, { useEffect, useState } from 'react';
import { get } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Home = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ workouts: 0, meals: 0, metrics: 0 });

  useEffect(() => {
    async function load() {
      const stored = await get('user');
      const u = stored || { is_paid: false };
      setUser(u);

      if (!u.is_paid) {
        const workouts = (await get('workouts')) || [];
        const meals = (await get('nutrition_logs')) || [];
        const metrics = (await get('body_metrics')) || [];
        setStats({
          workouts: workouts.length,
          meals: meals.length,
          metrics: metrics.length,
        });
      } else {
        try {
          const [{ count: w }, { count: n }, { count: m }] = await Promise.all([
            supabase.from('workouts').select('*', { count: 'exact', head: true }),
            supabase
              .from('nutrition_logs')
              .select('*', { count: 'exact', head: true }),
            supabase
              .from('body_metrics')
              .select('*', { count: 'exact', head: true }),
          ]);
          setStats({ workouts: w || 0, meals: n || 0, metrics: m || 0 });
        } catch (err) {
          console.error('Failed to fetch stats', err);
        }
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Welcome to GymBroRecipes</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Track workouts, meals and body metrics offline. Upgrade any time to sync
        your data securely across devices.
      </p>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <h3 className="font-medium mb-1">Your Stats</h3>
        <p>Workouts logged: {stats.workouts}</p>
        <p>Nutrition logs: {stats.meals}</p>
        <p>Body metric entries: {stats.metrics}</p>
      </div>

      {user && !user.is_paid && (
        <div className="text-center">
          <button
            onClick={() => alert('Redirecting to upgrade...')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Upgrade for Cloud Sync
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
