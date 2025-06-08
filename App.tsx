import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputForm, FormData } from './components/InputForm';
import { ResultsDisplay, CalculationResults } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { mockGetFlatDimensions, PacdoraParams } from './services/pacdoraService';
import { generateQuoteSummary } from './services/geminiService';
import { PacdoraIcon } from './components/IconComponents';
import { PACDORA_APP_ID, PACDORA_APP_KEY } from './constants'; // Import constants

const App: React.FC = () => {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [geminiMessage, setGeminiMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const extractPacdoraModelId = (link: string): string | null => {
    try {
      const url = new URL(link);
      // Try to get 'id' query parameter
      const queryId = url.searchParams.get('id');
      if (queryId) return queryId;

      // Try to get last path segment if it looks like an ID (e.g., alphanumeric)
      const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);
      if (pathSegments.length > 0) {
        const lastSegment = pathSegments[pathSegments.length - 1];
        // Basic check if it might be an ID (e.g., not 'design', 'editor', 'detail')
        if (lastSegment && /^[a-zA-Z0-9-_]+$/.test(lastSegment) && !['design', 'editor', 'detail', 'solution'].includes(lastSegment.toLowerCase())) {
          return lastSegment;
        }
        // Check for specific path structures if known (e.g. /solution/detail/MODEL_ID)
        if(pathSegments.includes('detail') && pathSegments.indexOf('detail') < pathSegments.length -1){
            return pathSegments[pathSegments.indexOf('detail') + 1];
        }
      }
      return null;
    } catch (e) {
      console.error("Invalid URL format:", e);
      // Fallback: attempt to extract from a non-standard URL string if possible
      const parts = link.split('/');
      const potentialId = parts.pop() || parts.pop(); // try last two segments
      if (potentialId && potentialId.length > 5 && /^[a-zA-Z0-9-_]+$/.test(potentialId)) return potentialId; 
      return null;
    }
  };

  const handleSubmit = useCallback(async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setGeminiMessage(null);

    const modelId = extractPacdoraModelId(data.pacdoraLink);

    if (!modelId) {
      setError("Could not extract a valid Pacdora Model ID from the link. Please ensure the link is correct (e.g., 'https://app.pacdora.com/editor/design?id=XYZ123' or 'https://app.pacdora.com/solution/detail/ABC456') or enter the Model ID directly if the link format is not recognized.");
      setIsLoading(false);
      return;
    }
    
    // Simulate a slight delay for API calls
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const pacdoraParams: PacdoraParams = {
        modelId,
        length: data.length,
        width: data.width,
        height: data.height,
      };
      
      const flatDimensions = await mockGetFlatDimensions(pacdoraParams);
      const totalArea = parseFloat((flatDimensions.flatLength * flatDimensions.flatWidth).toFixed(2));
      
      const currentResults = {
        modelId: modelId,
        inputLength: data.length,
        inputWidth: data.width,
        inputHeight: data.height,
        flatLength: flatDimensions.flatLength,
        flatWidth: flatDimensions.flatWidth,
        totalArea: totalArea,
      };
      setResults(currentResults);

      // Generate Gemini summary
      try {
        // Ensure API_KEY is available for Gemini service
        if (!process.env.API_KEY || process.env.API_KEY === "MISSING_API_KEY" || process.env.API_KEY === "AIzaSyBYx8RIST_ENVxVZpseWGESqKlBXHDEmRk_PLACEHOLDER") { // Check for placeholder too
            setGeminiMessage("Gemini API Key is not configured correctly. AI summary cannot be generated.");
        } else {
            const summary = await generateQuoteSummary(
              currentResults.inputLength,
              currentResults.inputWidth,
              currentResults.inputHeight,
              currentResults.flatLength,
              currentResults.flatWidth,
              currentResults.totalArea,
              modelId
            );
            setGeminiMessage(summary);
        }
      } catch (geminiError) {
        console.error("Gemini API error:", geminiError);
        setGeminiMessage("Could not generate quote summary. Please check Gemini API configuration and ensure the API key is valid.");
        // Non-fatal error for Gemini, still show Pacdora results
      }

    } catch (e: any) {
      console.error("Calculation error:", e);
      setError(e.message || "An unexpected error occurred during calculation.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
          <div className="flex items-center justify-center mb-6 text-emerald-600">
            <PacdoraIcon className="w-12 h-12 mr-3" />
            <h1 className="text-3xl font-bold text-center">Pacdora Quick Quote</h1>
          </div>
          <p className="text-center text-gray-600 mb-8">
            Enter the Pacdora product link (or Model ID) and box dimensions to estimate the flat size and total material area.
          </p>
          
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />

          {isLoading && <LoadingSpinner />}
          
          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {results && !isLoading && (
            <ResultsDisplay results={results} geminiMessage={geminiMessage} />
          )}
          
          <div className="mt-8 p-4 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md text-sm">
            <p className="font-semibold">Important Notes:</p>
            <ul className="list-disc list-inside ml-4">
              <li>This calculator uses a <strong className="font-medium">mock Pacdora API service</strong> for demonstration. Results are illustrative.</li>
              <li>Actual flat dimensions depend on the specific Pacdora model and dieline.</li>
              <li>The Gemini API Key is injected directly for this demo. In a production environment, ensure it's securely managed.</li>
              <li>The Pacdora API keys (APP ID: <code className="bg-yellow-100 p-0.5 rounded text-xs">{PACDORA_APP_ID}</code>, App Key: <code className="bg-yellow-100 p-0.5 rounded text-xs">{PACDORA_APP_KEY}</code>) are configured and noted by the mock service in this version. For a live integration, the Pacdora API would need to be called directly.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;