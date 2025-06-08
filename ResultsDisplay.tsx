
import React from 'react';
import { ChartIcon } from './IconComponents'; // Assuming you might want an icon

export interface CalculationResults {
  modelId: string;
  inputLength: number;
  inputWidth: number;
  inputHeight: number;
  flatLength: number;
  flatWidth: number;
  totalArea: number;
}

interface ResultsDisplayProps {
  results: CalculationResults;
  geminiMessage: string | null;
}

const ResultItem: React.FC<{ label: string; value: string | number; unit?: string; highlight?: boolean }> = ({ label, value, unit, highlight }) => (
  <div className={`p-4 rounded-lg ${highlight ? 'bg-emerald-500 text-white' : 'bg-emerald-50'}`}>
    <p className={`text-sm ${highlight ? 'text-emerald-100' : 'text-emerald-700'} font-medium`}>{label}</p>
    <p className={`text-2xl font-bold ${highlight ? 'text-white' : 'text-emerald-600'}`}>
      {value} <span className="text-sm font-normal">{unit}</span>
    </p>
  </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, geminiMessage }) => {
  return (
    <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-lg animate-fadeIn">
      <div className="flex items-center text-emerald-600 mb-4">
        <ChartIcon className="w-8 h-8 mr-3"/>
        <h2 className="text-2xl font-semibold">Calculation Results</h2>
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600"><strong>Pacdora Model ID:</strong> {results.modelId}</p>
        <p className="text-sm text-gray-600"><strong>Input Dimensions (L x W x H):</strong> {results.inputLength} x {results.inputWidth} x {results.inputHeight} mm</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ResultItem label="Flat Length" value={results.flatLength.toFixed(2)} unit="mm" />
        <ResultItem label="Flat Width" value={results.flatWidth.toFixed(2)} unit="mm" />
        <ResultItem label="Total Design Area" value={results.totalArea.toFixed(2)} unit="mm²" highlight />
      </div>

      {geminiMessage && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">AI Generated Summary:</h3>
          <p className="text-blue-600 whitespace-pre-wrap">{geminiMessage}</p>
        </div>
      )}
    </div>
  );
};

// Simple fade-in animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
