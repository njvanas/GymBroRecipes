import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function isAuthenticated() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.log('User not authenticated');
    return null;
  }
  return data.user;
}

export async function syncWorkoutToCloud(data) {
  const user = await isAuthenticated();
  if (!user) return;
  const { error } = await supabase.from('workouts').insert([data]);
  if (error) {
    console.error('Failed to sync workout', error);
  } else {
    console.log('Workout synced successfully');
  }
}

export async function syncNutritionToCloud(data) {
  const user = await isAuthenticated();
  if (!user) return;
  const { error } = await supabase.from('nutrition_logs').insert([data]);
  if (error) {
    console.error('Failed to sync nutrition log', error);
  } else {
    console.log('Nutrition log synced successfully');
  }
}

export async function syncMetricsToCloud(data) {
  const user = await isAuthenticated();
  if (!user) return;
  const { error } = await supabase.from('body_metrics').insert([data]);
  if (error) {
    console.error('Failed to sync metrics', error);
  } else {
    console.log('Metrics synced successfully');
  }
}
