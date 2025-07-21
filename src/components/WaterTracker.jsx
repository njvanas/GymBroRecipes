import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card, CardHeader, CardContent } from './ui/Card';

const DAILY_GOAL = 2000; // ml

const WaterTracker = () => {
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadToday();
  }, []);

  const loadToday = async () => {
    const logs = (await get('water_logs')) || [];
    const today = new Date().toISOString().split('T')[0];
    const entry = logs.find((l) => l.date === today);
    setTotal(entry ? entry.amount : 0);
  };

  const saveAmount = async () => {
    const ml = Number(amount) || 0;
    if (!ml) return;
    const logs = (await get('water_logs')) || [];
    const today = new Date().toISOString().split('T')[0];
    const idx = logs.findIndex((l) => l.date === today);
    if (idx >= 0) {
      logs[idx].amount += ml;
    } else {
      logs.push({ date: today, amount: ml });
    }
    await set('water_logs', logs);
    setAmount('');
    setTotal((t) => t + ml);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-3xl font-bold md:text-4xl text-center">Water Intake</h1>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold md:text-2xl">Log Water</h2>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            type="number"
            aria-label="Water amount in ml"
            placeholder="Amount (ml)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button onClick={saveAmount} aria-label="Add water">Add</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold md:text-2xl">Today's Total</h2>
        </CardHeader>
        <CardContent>
          <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-100">
            {total} ml / {DAILY_GOAL} ml
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterTracker;
