
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">
          Pacdora Quick Quote Calculator - For internal use.
        </p>
      </div>
    </footer>
  );
};
