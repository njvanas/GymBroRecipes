import React, { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card, CardHeader, CardContent } from './ui/Card';
import { WaterIcon, PlusIcon } from './ui/icons';
import ProgressBar from './ui/ProgressBar';
import { useToast } from './ui/Toast';
import LoadingSpinner from './ui/LoadingSpinner';

const DAILY_GOAL = 2000; // ml
const QUICK_AMOUNTS = [250, 500, 750, 1000]; // ml

const WaterTracker = () => {
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadToday();
  }, []);

  const loadToday = async () => {
    try {
      const logs = (await get('water_logs')) || [];
      const today = new Date().toISOString().split('T')[0];
      const entry = logs.find((l) => l.date === today);
      setTotal(entry ? entry.amount : 0);
      
      // Load recent history
      const recentLogs = logs
        .filter(l => {
          const logDate = new Date(l.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return logDate >= weekAgo;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistory(recentLogs);
    } catch (error) {
      console.error('Error loading water data:', error);
      toast.error('Failed to load water intake data');
    } finally {
      setLoading(false);
    }
  };

  const saveAmount = async (ml) => {
    const amountToAdd = ml || Number(amount) || 0;
    if (!amountToAdd) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const logs = (await get('water_logs')) || [];
      const today = new Date().toISOString().split('T')[0];
      const idx = logs.findIndex((l) => l.date === today);
      
      if (idx >= 0) {
        logs[idx].amount += amountToAdd;
      } else {
        logs.push({ date: today, amount: amountToAdd });
      }
      
      await set('water_logs', logs);
      setAmount('');
      setTotal((t) => t + amountToAdd);
      toast.success(`Added ${amountToAdd}ml of water`);
      loadToday(); // Refresh history
    } catch (error) {
      console.error('Error saving water intake:', error);
      toast.error('Failed to save water intake');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const percentage = Math.min((total / DAILY_GOAL) * 100, 100);
  const isGoalReached = total >= DAILY_GOAL;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4">
          <WaterIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          Water Tracker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Stay hydrated throughout the day. Track your water intake and maintain optimal hydration levels.
        </p>
      </div>

      {/* Daily Progress */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <WaterIcon className="w-6 h-6 text-blue-500" />
            Today's Hydration
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {total}
              <span className="text-2xl text-gray-500 dark:text-gray-400 ml-2">ml</span>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              of {DAILY_GOAL}ml daily goal
            </p>
          </div>

          <ProgressBar
            value={total}
            max={DAILY_GOAL}
            color="blue"
            size="lg"
            className="mb-4"
          />

          <div className="text-center">
            {isGoalReached ? (
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full font-semibold">
                🎉 Daily goal achieved!
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                {DAILY_GOAL - total}ml remaining to reach your goal
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Buttons */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PlusIcon className="w-6 h-6 text-cyan-500" />
            Quick Add
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_AMOUNTS.map((ml) => (
              <Button
                key={ml}
                variant="secondary"
                onClick={() => saveAmount(ml)}
                className="h-20 flex-col gap-2 text-lg font-bold"
              >
                <WaterIcon className="w-6 h-6" />
                {ml}ml
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Amount */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <h2 className="text-2xl font-bold">Custom Amount</h2>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Enter amount in ml"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 text-center text-lg font-semibold"
              leftIcon={WaterIcon}
            />
            <Button
              onClick={() => saveAmount()}
              disabled={!amount}
              className="px-8"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent History */}
      {history.length > 0 && (
        <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <WaterIcon className="w-6 h-6 text-blue-500" />
              Recent History
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((entry, idx) => {
                const date = new Date(entry.date);
                const isToday = date.toDateString() === new Date().toDateString();
                const goalPercentage = Math.min((entry.amount / DAILY_GOAL) * 100, 100);
                
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                          {isToday ? 'Today' : date.toLocaleDateString()}
                        </span>
                        {entry.amount >= DAILY_GOAL && (
                          <span className="text-green-500 text-sm">🎯 Goal reached</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-lg font-bold text-blue-800 dark:text-blue-200">
                          {entry.amount}ml
                        </span>
                        <div className="flex-1 max-w-xs">
                          <ProgressBar
                            value={entry.amount}
                            max={DAILY_GOAL}
                            color="blue"
                            size="sm"
                          />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {Math.round(goalPercentage)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WaterTracker;