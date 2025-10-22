import React from 'react';

export const DirectionsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m0 0v2.25m0-2.25h1.5M12 9.75V15m0 0v2.25m0-2.25h1.5m-1.5 0l3-3m-3 3l-3-3m-3-3v2.25m0-2.25h1.5m-1.5 0l3 3m-3-3l-3 3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
  </svg>
);