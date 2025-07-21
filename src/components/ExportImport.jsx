import React, { useState } from 'react';
import { get, set } from 'idb-keyval';
import Button from './ui/Button';
import { Card, CardHeader, CardContent } from './ui/Card';
import { useToast } from './ui/Toast';
import LoadingSpinner from './ui/LoadingSpinner';

const ExportImport = () => {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const toast = useToast();

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = {
        workouts: (await get('workouts')) || [],
        nutrition_logs: (await get('nutrition_logs')) || [],
        body_metrics: (await get('body_metrics')) || [],
        water_logs: (await get('water_logs')) || [],
        user: (await get('user')) || {},
        exported_at: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gymbro-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      
      // Validate the data structure
      if (!json.version) {
        throw new Error('Invalid backup file format');
      }

      // Import data with confirmation
      if (json.workouts) await set('workouts', json.workouts);
      if (json.nutrition_logs) await set('nutrition_logs', json.nutrition_logs);
      if (json.body_metrics) await set('body_metrics', json.body_metrics);
      if (json.water_logs) await set('water_logs', json.water_logs);
      if (json.user) await set('user', json.user);
      
      toast.success(`Data imported successfully! Imported ${Object.keys(json).length - 2} data categories.`);
      
      // Refresh the page to reflect imported data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('Import failed:', err);
      toast.error('Invalid backup file or import failed');
    } finally {
      setImporting(false);
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          Data Management
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Export your data for backup or import from a previous backup. Keep your fitness data safe and portable.
        </p>
      </div>

      {/* Export Section */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Export Data
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              What gets exported:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• All workout logs and exercise data</li>
              <li>• Nutrition logs and meal tracking</li>
              <li>• Body metrics and measurements</li>
              <li>• Water intake logs</li>
              <li>• User preferences and settings</li>
            </ul>
          </div>
          
          <Button
            onClick={handleExport}
            loading={exporting}
            size="lg"
            className="w-full"
          >
            {exporting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Exporting Data...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export All Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Import Data
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
              ⚠️ Important Notes:
            </h3>
            <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
              <li>• Importing will merge with existing data</li>
              <li>• Only import files exported from GymBroRecipes</li>
              <li>• The app will refresh after successful import</li>
              <li>• Make sure to export current data first as backup</li>
            </ul>
          </div>

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-green-400 dark:hover:border-green-500 transition-colors">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select backup file to import
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Choose a JSON backup file exported from GymBroRecipes
            </p>
            
            <input
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              disabled={importing}
              className="hidden"
              id="import-file"
            />
            <label htmlFor="import-file">
              <Button
                as="span"
                variant="success"
                loading={importing}
                className="cursor-pointer"
              >
                {importing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Importing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Choose File to Import
                  </>
                )}
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardContent className="text-center py-6">
          <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
            Your Data, Your Control
          </h3>
          <p className="text-green-800 dark:text-green-200 max-w-2xl mx-auto">
            All data export and import happens locally on your device. Your fitness data never leaves your control 
            and is not sent to any external servers during this process.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportImport;