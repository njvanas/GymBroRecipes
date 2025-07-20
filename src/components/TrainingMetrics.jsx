import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';

const calculate1RM = (weight, reps) => {
  const w = Number(weight) || 0;
  const r = Number(reps) || 0;
  if (!w || !r) return 0;
  return Math.round(w * (1 + r / 30));
};

const TrainingMetrics = ({ exercises = [] }) => {
  if (!exercises.length) return null;

  const totalVolume = exercises.reduce((acc, ex) => {
    const sets = Number(ex.sets) || 0;
    const reps = Number(ex.reps) || 0;
    const weight = Number(ex.weight) || 0;
    return acc + sets * reps * weight;
  }, 0);

  const best1RM = exercises.reduce((max, ex) => {
    const est = calculate1RM(ex.weight, ex.reps);
    return est > max ? est : max;
  }, 0);

  const avgRPE = (
    exercises.reduce((acc, ex) => acc + (Number(ex.rpe) || 0), 0) /
    exercises.length
  ).toFixed(1);

  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold md:text-2xl">Training Metrics</h2>
      </CardHeader>
      <CardContent>
        <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-100">
          Total Volume: {totalVolume} kg
        </p>
        <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-100">
          Best Estimated 1RM: {best1RM} kg
        </p>
        <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-100">
          Avg RPE: {avgRPE}
        </p>
      </CardContent>
    </Card>
  );
};

export default TrainingMetrics;
