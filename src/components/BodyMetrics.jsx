import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import { createClient } from '@supabase/supabase-js';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card, CardHeader, CardContent } from './ui/Card';
import { MetricsIcon, WeightIcon, PlusIcon } from './ui/icons';
import { useToast } from './ui/Toast';
import LoadingSpinner from './ui/LoadingSpinner';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function loadUser() {
      try {
        const stored = await get('user');
        setUser(stored || { is_paid: false });
      } catch (error) {
        console.error('Error loading user:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [toast]);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    try {
      if (!user || !user.is_paid || !supabase) {
        const local = (await get('body_metrics')) || [];
        setEntries(local);
      } else {
        const { data, error } = await supabase
          .from('body_metrics')
          .select('*')
          .order('date', { ascending: false });
        if (error) throw error;
        setEntries(data);
      }
    } catch (err) {
      console.error('Error loading metrics', err);
      toast.error('Failed to load body metrics');
    }
  };

  const saveEntry = async () => {
    if (!weight) {
      toast.error('Please enter your weight');
      return;
    }

    setSaving(true);
    const entry = {
      date: new Date().toISOString(),
      weight: Number(weight) || 0,
      body_fat_pct: Number(bodyFat) || 0,
      chest: Number(chest) || 0,
      waist: Number(waist) || 0,
      arms: Number(arms) || 0,
      thighs: Number(thighs) || 0,
    };

    try {
      if (!user || !user.is_paid || !supabase) {
        const existing = (await get('body_metrics')) || [];
        await set('body_metrics', [...existing, entry]);
        toast.success('Body metrics saved locally');
      } else {
        const { error } = await supabase.from('body_metrics').insert([entry]);
        if (error) throw error;
        toast.success('Body metrics saved to cloud');
      }

      setWeight('');
      setBodyFat('');
      setChest('');
      setWaist('');
      setArms('');
      setThighs('');
      loadEntries();
    } catch (err) {
      console.error('Error saving metrics', err);
      toast.error('Failed to save body metrics');
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
          <MetricsIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          Body Metrics
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Track your body composition and measurements. Monitor weight, body fat percentage, and key measurements over time.
        </p>
      </div>

      {/* Metrics Input Form */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PlusIcon className="w-6 h-6 text-purple-500" />
            Record Measurements
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                type="number"
                label="Weight (kg)"
                placeholder="70.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-center text-lg font-semibold"
                leftIcon={WeightIcon}
              />
              <Input
                type="number"
                label="Body Fat %"
                placeholder="15.2"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="text-center text-lg font-semibold"
              />
              <Input
                type="number"
                label="Chest (cm)"
                placeholder="100"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
                className="text-center text-lg font-semibold"
              />
            </div>
            <div className="space-y-4">
              <Input
                type="number"
                label="Waist (cm)"
                placeholder="80"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="text-center text-lg font-semibold"
              />
              <Input
                type="number"
                label="Arms (cm)"
                placeholder="35"
                value={arms}
                onChange={(e) => setArms(e.target.value)}
                className="text-center text-lg font-semibold"
              />
              <Input
                type="number"
                label="Thighs (cm)"
                placeholder="55"
                value={thighs}
                onChange={(e) => setThighs(e.target.value)}
                className="text-center text-lg font-semibold"
              />
            </div>
          </div>

          <Button
            onClick={saveEntry}
            disabled={!weight}
            loading={saving}
            className="w-full py-4 text-lg font-bold"
          >
            <MetricsIcon className="w-6 h-6 mr-2" />
            Save Measurements
          </Button>
        </CardContent>
      </Card>

      {/* Past Entries */}
      {entries.length > 0 && (
        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MetricsIcon className="w-6 h-6 text-blue-500" />
                Measurement History ({filteredEntries.length})
              </h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field w-auto min-w-[150px]"
              >
                <option value="all">All Time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredEntries.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-sm">
                      <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-lg font-medium">
                        {entry.weight} kg
                      </span>
                      {entry.body_fat_pct > 0 && (
                        <span className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-lg font-medium">
                          {entry.body_fat_pct}% BF
                        </span>
                      )}
                      {entry.chest > 0 && (
                        <span className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded-lg font-medium">
                          Chest: {entry.chest}cm
                        </span>
                      )}
                      {entry.waist > 0 && (
                        <span className="bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded-lg font-medium">
                          Waist: {entry.waist}cm
                        </span>
                      )}
                      {entry.arms > 0 && (
                        <span className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded-lg font-medium">
                          Arms: {entry.arms}cm
                        </span>
                      )}
                      {entry.thighs > 0 && (
                        <span className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-lg font-medium">
                          Thighs: {entry.thighs}cm
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BodyMetrics;