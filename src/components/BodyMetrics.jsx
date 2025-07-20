import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';
import Button from './ui/Button';
import Input from './ui/Input';
import Label from './ui/Label';
import { Card, CardHeader, CardContent } from './ui/Card';

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
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold md:text-4xl text-center">Body Metrics</h1>

      <Card className="mt-4">
        <CardContent className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            aria-label="Weight"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <Input
            type="number"
            aria-label="Body Fat %"
            placeholder="Body Fat %"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
          />
          <Input
            type="number"
            aria-label="Chest"
            placeholder="Chest"
            value={chest}
            onChange={(e) => setChest(e.target.value)}
          />
          <Input
            type="number"
            aria-label="Waist"
            placeholder="Waist"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
          />
          <Input
            type="number"
            aria-label="Arms"
            placeholder="Arms"
            value={arms}
            onChange={(e) => setArms(e.target.value)}
          />
          <Input
            type="number"
            aria-label="Thighs"
            placeholder="Thighs"
            value={thighs}
            onChange={(e) => setThighs(e.target.value)}
          />
        </CardContent>
      </Card>

      <Button
        className="mt-4 w-full"
        onClick={saveEntry}
        disabled={!weight}
        aria-label="Save Metrics"
      >
        Save Metrics
      </Button>

      {entries.length > 0 && (
        <Card className="mt-4">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-xl font-semibold md:text-2xl">Past Entries</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded p-1 dark:bg-gray-800"
            >
              <option value="all">All</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {filteredEntries.map((e, idx) => (
                <li
                  key={idx}
                  className="flex justify-between bg-slate-900/50 p-2 rounded border border-slate-700/50"
                >
                  <span>{new Date(e.date).toLocaleDateString()}</span>
                  <span>{e.weight}kg / {e.body_fat_pct}% BF</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BodyMetrics;
