import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

export async function calculatePRs(userId) {
  const { data, error } = await supabase
    .from('workout_exercises')
    .select('exercise_id, weight')
    .eq('user_id', userId);
  if (error) throw error;

  return data.reduce((acc, row) => {
    const current = acc[row.exercise_id] || 0;
    acc[row.exercise_id] = row.weight > current ? row.weight : current;
    return acc;
  }, {});
}
