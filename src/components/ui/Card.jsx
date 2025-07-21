import React from 'react';

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`card-content ${className}`} {...props}>
      {children}
    </div>
  );
}

export function MetricCard({ title, value, unit, trend, icon: Icon, color = 'blue', className = '' }) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    purple: 'text-purple-600 dark:text-purple-400',
  };

  return (
    <div className={`metric-card ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        {Icon && <Icon className={`w-5 h-5 ${colorClasses[color]}`} />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
        {unit && <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${
          trend > 0 ? 'text-green-600 dark:text-green-400' : 
          trend < 0 ? 'text-red-600 dark:text-red-400' : 
          'text-gray-500 dark:text-gray-400'
        }`}>
          {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );
}