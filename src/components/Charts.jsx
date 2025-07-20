import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Charts = ({ bodyMetricsData = [], nutritionData = [], workoutData = [] }) => {
  const weightData = [...bodyMetricsData]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      weight: Number(entry.weight) || 0,
    }));

  const caloriesData = [...nutritionData]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      calories: Number(entry.calories) || 0,
    }));

  const strengthData = workoutData
    .map((workout) => {
      const maxSquat = Array.isArray(workout.exercises)
        ? workout.exercises.reduce((max, ex) => {
            if (ex.exercise === 'Squat') {
              const w = Number(ex.weight) || 0;
              return w > max ? w : max;
            }
            return max;
          }, 0)
        : 0;
      if (!maxSquat) return null;
      return {
        date: new Date(workout.date).toLocaleDateString(),
        squat: maxSquat,
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="grid gap-4 md:grid-cols-2 dark:text-white">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Weight Over Time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weightData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Calories Over Time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={caloriesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow md:col-span-2">
        <h3 className="font-semibold mb-2">Best Squat Weight Over Time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={strengthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="squat" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
