import React from 'react';

const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`border rounded px-3 py-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${className}`}
    {...props}
  />
));

Input.displayName = 'Input';
export default Input;
