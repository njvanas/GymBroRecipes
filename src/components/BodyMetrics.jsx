import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const BodyMetrics = () => {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [arms, setArms] = useState('');
  const [thighs, setThighs] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function loadUser() {
      const stored = await get('user');
      setUser(stored || { is_paid: false });
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user || !user.is_paid || !supabase) {
      const local = (await get('body_metrics')) || [];
      setEntries(local);
    } else {
      try {
        const { data, error } = await supabase
          .from('body_metrics')
          .select('*')
          .order('date', { ascending: false });
        if (error) throw error;
        setEntries(data);
      } catch (err) {
        console.error('Error loading metrics', err);
      }
    }
  };

  const saveEntry = async () => {
    const entry = {
      date: new Date().toISOString(),
      weight: Number(weight) || 0,
      body_fat_pct: Number(bodyFat) || 0,
      chest: Number(chest) || 0,
      waist: Number(waist) || 0,
      arms: Number(arms) || 0,
      thighs: Number(thighs) || 0,
    };
    if (!user || !user.is_paid || !supabase) {
      const existing = (await get('body_metrics')) || [];
      await set('body_metrics', [...existing, entry]);
    } else {
      try {
        const { error } = await supabase.from('body_metrics').insert([entry]);
        if (error) throw error;
      } catch (err) {
        console.error('Error saving metrics', err);
        return;
      }
    }
    setWeight('');
    setBodyFat('');
    setChest('');
    setWaist('');
    setArms('');
    setThighs('');
    loadEntries();
  };

  const filteredEntries = entries
    .filter((e) => {
      if (filter === 'all') return true;
      const days = Number(filter);
      const start = new Date();
      start.setDate(start.getDate() - days);
      return new Date(e.date) >= start;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-xl mx-auto space-y-4 dark:text-white">
      <h2 className="text-xl font-semibold">Body Metrics</h2>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border rounded p-2 dark:bg-gray-800"
        />
        <input
          type="number"
          placeholder="Body Fat %"
          value={bodyFat}
          onChange={(e) => setBodyFat(e.target.value)}
          className="border rounded p-2 dark:bg-gray-800"
        />
        <input
          type="number"
          placeholder="Chest"
          value={chest}
          onChange={(e) => setChest(e.target.value)}
          className="border rounded p-2 dark:bg-gray-800"
        />
        <input
          type="number"
          placeholder="Waist"
          value={waist}
          onChange={(e) => setWaist(e.target.value)}
          className="border rounded p-2 dark:bg-gray-800"
        />
        <input
          type="number"
          placeholder="Arms"
          value={arms}
          onChange={(e) => setArms(e.target.value)}
          className="border rounded p-2 dark:bg-gray-800"
        />
        <input
          type="number"
          placeholder="Thighs"
          value={thighs}
          onChange={(e) => setThighs(e.target.value)}
          className="border rounded p-2 dark:bg-gray-800"
        />
      </div>

      <button
        className="bg-blue-500 text-white rounded px-4 py-2 w-full"
        onClick={saveEntry}
        disabled={!weight}
      >
        Save Metrics
      </button>

      {entries.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Past Entries</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded p-1 dark:bg-gray-800"
            >
              <option value="all">All</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>
          <ul className="space-y-1">
            {filteredEntries.map((e, idx) => (
              <li
                key={idx}
                className="flex justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                <span>{new Date(e.date).toLocaleDateString()}</span>
                <span>{e.weight}kg / {e.body_fat_pct}% BF</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BodyMetrics;
