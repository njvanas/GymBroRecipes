import React from 'react';
import { get, set } from 'idb-keyval';
import Button from './ui/Button';
import { Card, CardHeader, CardContent } from './ui/Card';

const ExportImport = () => {
  const handleExport = async () => {
    const data = {
      workouts: (await get('workouts')) || [],
      nutrition_logs: (await get('nutrition_logs')) || [],
      body_metrics: (await get('body_metrics')) || [],
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gymbro-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (json.workouts) await set('workouts', json.workouts);
      if (json.nutrition_logs) await set('nutrition_logs', json.nutrition_logs);
      if (json.body_metrics) await set('body_metrics', json.body_metrics);
      alert('Data imported');
    } catch (err) {
      alert('Invalid file');
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold md:text-4xl text-center">Export / Import</h1>
      <Card className="mt-4">
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={handleExport} aria-label="Export data">
            Export Data
          </Button>
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            aria-label="Import file"
            className="w-full text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-100"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportImport;
