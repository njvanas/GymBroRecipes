import React from 'react';
import { Link } from 'react-router-dom';

const UpgradeBanner = () => (
  <div className="bg-yellow-200 text-yellow-800 p-4 text-center">
    <p className="mb-2">Unlock cloud sync and more features!</p>
    <Link to="/upgrade" className="underline font-medium">Upgrade Now</Link>
  </div>
);

export default UpgradeBanner;
