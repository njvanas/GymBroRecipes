import React from 'react';

const Button = React.forwardRef(({ className = '', ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white text-base font-medium px-4 py-2 transition-colors disabled:opacity-50 disabled:pointer-events-none ${className}`}
    {...props}
  />
));

Button.displayName = 'Button';
export default Button;
