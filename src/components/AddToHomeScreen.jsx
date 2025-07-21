import React, { useEffect, useState } from 'react';
import Button from './ui/Button';

const AddToHomeScreen = () => {
  const [prompt, setPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hidden = localStorage.getItem('a2hs-hide');
    if (hidden === '1') return;

    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    await prompt.userChoice;
    setVisible(false);
    localStorage.setItem('a2hs-hide', '1');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 flex justify-center z-20">
      <div className="bg-slate-800 text-white p-4 rounded shadow-lg flex flex-col sm:flex-row items-center gap-2">
        <span className="text-sm">Install this app for quick access.</span>
        <div className="flex gap-2">
          <Button onClick={install} aria-label="Install app" className="px-3 py-1 text-sm">Install</Button>
          <button
            className="text-xs underline"
            onClick={() => {
              setVisible(false);
              localStorage.setItem('a2hs-hide', '1');
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToHomeScreen;
