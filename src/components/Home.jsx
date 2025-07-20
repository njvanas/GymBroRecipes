import React, { useEffect, useState } from 'react';
import { get } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const Home = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ workouts: 0, meals: 0, metrics: 0 });

  useEffect(() => {
    async function load() {
      const stored = await get('user');
      const u = stored || { is_paid: false };
      setUser(u);

      if (!u.is_paid || !supabase) {
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
    <div className="space-y-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to GymBroRecipes</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Track workouts, meals and body metrics offline. Upgrade any time to sync your data securely across devices.
        </p>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
        <h3 className="font-medium mb-1 text-white">Your Stats</h3>
        <p>Workouts logged: {stats.workouts}</p>
        <p>Nutrition logs: {stats.meals}</p>
        <p>Body metric entries: {stats.metrics}</p>
      </div>

      {user && !user.is_paid && (
        <div className="text-center">
          <button
            onClick={() => alert('Redirecting to upgrade...')}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Upgrade for Cloud Sync
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
