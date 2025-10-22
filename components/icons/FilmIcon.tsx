import React from 'react';

export const FilmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75v3.75m-3.75-3.75v3.75m-3.75-3.75v3.75m9.75-12v1.5m-3.75-1.5v1.5m-3.75-1.5v1.5m11.25-1.5v1.5M4.5 6.75h15v10.5h-15V6.75z" />
  </svg>
);