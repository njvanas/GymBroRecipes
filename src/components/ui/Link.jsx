import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Link = React.forwardRef(({ className = '', ...props }, ref) => (
  <RouterLink
    ref={ref}
    className={`text-blue-600 dark:text-blue-400 hover:underline text-base font-medium ${className}`}
    {...props}
  />
));

Link.displayName = 'Link';
export default Link;
