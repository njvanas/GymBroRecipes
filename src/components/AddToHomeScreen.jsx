import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import { Card, CardContent } from './ui/Card';

const AddToHomeScreen = () => {
  const [prompt, setPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const hidden = localStorage.getItem('a2hs-hide');
    if (hidden === '1') return;

    // Check if it's iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Show iOS instructions after a delay if on iOS
    if (iOS) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === 'accepted') {
      setVisible(false);
      localStorage.setItem('a2hs-hide', '1');
    }
  };

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem('a2hs-hide', '1');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 z-30 animate-slide-up">
      <Card className="shadow-2xl border-2 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📱</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Install GymBroRecipes
              </h3>
              {isIOS ? (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Tap the share button <span className="inline-block">📤</span> in Safari, 
                  then "Add to Home Screen" for the best experience.
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Install our app for quick access, offline support, and a native app experience.
                </p>
              )}
              <div className="flex gap-2">
                {!isIOS && (
                  <Button onClick={install} size="sm">
                    Install App
                  </Button>
                )}
                <Button onClick={dismiss} variant="ghost" size="sm">
                  Not now
                </Button>
              </div>
            </div>
            <button
              onClick={dismiss}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddToHomeScreen;