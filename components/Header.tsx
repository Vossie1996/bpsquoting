
import React from 'react';
import { BIOPACK_PRIMARY_GREEN } from '../constants'; // For potential direct style usage if needed

// A simple SVG logo placeholder, you can replace this with an actual logo
const LogoPlaceholder: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="40" rx="8" fill={BIOPACK_PRIMARY_GREEN} />
    <text x="50" y="25" fontFamily="Arial, sans-serif" fontSize="16" fill="white" textAnchor="middle" dominantBaseline="middle">
      BioPack
    </text>
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* Replace with actual logo if available */}
          {/* <img src="/biopack-logo.png" alt="BioPack Solutions Logo" className="h-10 mr-3" /> */}
          <LogoPlaceholder className="h-10 w-auto mr-3" />
          <span className="text-2xl font-semibold text-gray-700">Quote Automation</span>
        </div>
        <nav>
          {/* Add navigation links if needed */}
          {/* <a href="#" className="text-gray-600 hover:text-emerald-600 px-3 py-2">Home</a> */}
        </nav>
      </div>
    </header>
  );
};
