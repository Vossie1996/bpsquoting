
import React, { useState } from 'react';

export interface FormData {
  pacdoraLink: string;
  length: number;
  width: number;
  height: number;
}

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [pacdoraLink, setPacdoraLink] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!pacdoraLink.trim()) {
      setFormError('Pacdora product link is required.');
      return;
    }
    try {
      new URL(pacdoraLink); // Basic URL validation
    } catch (_) {
      // Allow non-URL strings if user might paste just an ID
      // More robust validation can be added based on expected link patterns
      if(!pacdoraLink.includes('/') && !pacdoraLink.includes('.')){
         // assume it's an ID
      } else {
        setFormError('Please enter a valid Pacdora product link or Model ID.');
        return;
      }
    }

    const numLength = parseFloat(length);
    const numWidth = parseFloat(width);
    const numHeight = parseFloat(height);

    if (isNaN(numLength) || numLength <= 0) {
      setFormError('Please enter a valid positive number for length.');
      return;
    }
    if (isNaN(numWidth) || numWidth <= 0) {
      setFormError('Please enter a valid positive number for width.');
      return;
    }
    if (isNaN(numHeight) || numHeight <= 0) {
      setFormError('Please enter a valid positive number for height.');
      return;
    }

    onSubmit({ 
      pacdoraLink: pacdoraLink.trim(), 
      length: numLength, 
      width: numWidth, 
      height: numHeight 
    });
  };

  const commonInputClass = "mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm">
          {formError}
        </div>
      )}
      <div>
        <label htmlFor="pacdoraLink" className={labelClass}>
          Pacdora Product Link or Model ID
        </label>
        <input
          type="text"
          id="pacdoraLink"
          value={pacdoraLink}
          onChange={(e) => setPacdoraLink(e.target.value)}
          className={commonInputClass}
          placeholder="e.g., https://app.pacdora.com/editor/design?id=XYZ123 or XYZ123"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="length" className={labelClass}>Length (mm)</label>
          <input
            type="number"
            id="length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className={commonInputClass}
            placeholder="e.g., 100"
            required
            min="0.1"
            step="any"
          />
        </div>
        <div>
          <label htmlFor="width" className={labelClass}>Width (mm)</label>
          <input
            type="number"
            id="width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className={commonInputClass}
            placeholder="e.g., 80"
            required
            min="0.1"
            step="any"
          />
        </div>
        <div>
          <label htmlFor="height" className={labelClass}>Height (mm)</label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={commonInputClass}
            placeholder="e.g., 50"
            required
            min="0.1"
            step="any"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
      >
        {isLoading ? 'Calculating...' : 'Calculate Flat Size'}
      </button>
    </form>
  );
};
