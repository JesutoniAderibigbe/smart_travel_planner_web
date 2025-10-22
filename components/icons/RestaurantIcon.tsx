import React from 'react';

export const RestaurantIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214C14.053 4.435 12.597 4 11.25 4c-1.465 0-2.828.37-4.014.994M15.362 5.214L15 5.25v2.333M15.362 5.214a.75.75 0 01.75-.75h.386a.75.75 0 01.75.75v.386a.75.75 0 01-.75.75h-.386a.75.75 0 01-.75-.75v-.386z" />
  </svg>
);