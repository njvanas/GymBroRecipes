import React from 'react';

export function Card({ className = '', ...props }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded shadow ${className}`} {...props} />
  );
}

export function CardHeader({ className = '', ...props }) {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 px-4 py-2 ${className}`} {...props} />
  );
}

export function CardContent({ className = '', ...props }) {
  return <div className={`p-4 ${className}`} {...props} />;
}
