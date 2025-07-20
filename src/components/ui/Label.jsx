import React from 'react';

const Label = ({ className = '', ...props }) => (
  <label
    className={`block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 ${className}`}
    {...props}
  />
);

export default Label;
