import React, { useEffect, useState } from 'react';
import { get } from 'idb-keyval';
import Button from './ui/Button';
import { useToast } from './ui/Toast';

const UpgradeBanner = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const checkTier = async () => {
      const stored = await get('user');
      const isDismissed = localStorage.getItem('upgrade-banner-dismissed') === 'true';
      
      if ((!stored || stored.is_paid === false) && !isDismissed) {
        setVisible(true);
      }
    };
    checkTier();
  }, []);

  const handleUpgrade = () => {
    toast.info('Upgrade feature coming soon! Cloud sync will enable automatic backups and multi-device access.', 'Coming Soon');
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('upgrade-banner-dismissed', 'true');
  };

  if (!visible || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-blue-200/20 dark:border-blue-800/20 animate-slide-up">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              ✨ Unlock cloud sync and automatic backups
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Access your data across all devices with secure cloud storage
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleUpgrade} size="sm">
              Upgrade Now
            </Button>
            <button
              onClick={handleDismiss}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeBanner;