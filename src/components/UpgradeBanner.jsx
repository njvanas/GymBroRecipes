import React, { useEffect, useState } from 'react';
import { get } from 'idb-keyval';

const UpgradeBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkTier = async () => {
      const stored = await get('user');
      if (!stored || stored.is_paid === false) {
        setVisible(true);
      }
    };
    checkTier();
  }, []);

  const handleUpgrade = () => {
    // TODO: Replace with Stripe/PayPal checkout
    alert('Redirecting to payment flow...');
  };

  if (!visible) return null;

  return (
    <div className="bg-blue-600/20 text-blue-400 p-4 text-center">
      <p className="mb-2">Upgrade to enable cloud sync and automatic backups.</p>
      <div className="space-x-2">
        <button
          onClick={handleUpgrade}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          Upgrade Now
        </button>
        <button
          onClick={() => setVisible(false)}
          className="text-sm underline text-gray-300"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default UpgradeBanner;
