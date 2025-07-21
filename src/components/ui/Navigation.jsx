import React from 'react';
import { useLocation } from 'react-router-dom';
import Link from './Link';

const NavigationItem = ({ to, icon: Icon, label, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`nav-link ${isActive ? 'active' : ''} relative`}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden sm:inline">{label}</span>
      {badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
};

export const TopNavigation = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 overflow-x-auto">
      {items.map((item, index) => (
        <NavigationItem key={index} {...item} />
      ))}
    </nav>
  );
};

export const BottomNavigation = ({ items }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-40 sm:hidden">
      <div className="flex justify-around">
        {items.map((item, index) => (
          <NavigationItem key={index} {...item} />
        ))}
      </div>
    </nav>
  );
};

export default { TopNavigation, BottomNavigation };