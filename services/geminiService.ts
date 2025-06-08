import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';

// Initialize the GoogleGenAI client
// The API key is expected to be available as process.env.API_KEY in the execution environment.
// For this client-side demo, it's injected via a script tag in index.html.
let ai: GoogleGenAI | null = null;
let geminiInitializationError: string | null = null;

// Ensure process and process.env exist, especially in browser environments without full Node.js polyfills
if (typeof process === 'undefined') {
  // @ts-ignore
  window.process = {};
}
if (typeof process.env === 'undefined') {
  // @ts-ignore
  process.env = {};
}
// Use a placeholder if API_KEY is not set by the script in index.html, to avoid runtime errors on initialization.
const apiKey = process.env.API_KEY || "MISSING_API_KEY_PLACEHOLDER";


try {
    if (apiKey === "MISSING_API_KEY_PLACEHOLDER" || !apiKey) {
        geminiInitializationError = "Gemini API Key is not available (process.env.API_KEY). AI features will be disabled.";
        console.warn(geminiInitializationError);
    } else {
        ai = new GoogleGenAI({ apiKey: apiKey });
    }
} catch (error: any) {
    console.error("Failed to initialize GoogleGenAI:", error);
    geminiInitializationError = `Failed to initialize GoogleGenAI: ${error.message || 'Unknown error'}`;
    // Handle initialization error, perhaps by disabling Gemini features
}


export const generateQuoteSummary = async (
  length: number,
  width: number,
  height: number,
  flatLength: number,
  flatWidth: number,
  totalArea: number,
  modelId: string
): Promise<string> => {
  if (geminiInitializationError) {
    return geminiInitializationError;
  }
  if (!ai) {
    return "Gemini AI client is not initialized. Summary generation failed.";
  }
  // Check again before making the call, in case the placeholder was used.
  if (apiKey === "MISSING_API_KEY_PLACEHOLDER" || !apiKey) {
     return "Gemini API Key is missing or invalid. Summary cannot be generated.";
  }

  const prompt = `
You are a helpful assistant for a packaging company called BioPack Solutions.
A sales team member has just calculated dimensions for a custom box using a Pacdora model.
The Pacdora Model ID is: ${modelId}
The box input dimensions are: Length=${length}mm, Width=${width}mm, Height=${height}mm.
The calculated flat (unfolded) dimensions are: Flat Length=${flatLength.toFixed(2)}mm, Flat Width=${flatWidth.toFixed(2)}mm.
The total design area for the material is: ${totalArea.toFixed(2)}mm².

Please provide a brief, encouraging, and professional summary for the sales team member. 
Mention the efficiency or suitability of these dimensions if appropriate in a positive tone. 
Keep it concise, about 2-3 sentences.
Example tone: "Excellent! The box design (Model: ${modelId}) with dimensions ${length}x${width}x${height}mm translates to an efficient flat size of ${flatLength.toFixed(2)}x${flatWidth.toFixed(2)}mm, utilizing ${totalArea.toFixed(2)}mm² of material. This looks like a well-optimized design for your client's needs."
Do not repeat the input values verbatim unless it flows naturally.
Focus on a positive affirmation and the implication of the calculated area.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL, 
        contents: prompt,
        config: {
            temperature: 0.6, 
            topP: 0.9,
            topK: 30,
        }
    });
    
    const text = response.text;
    if (text) {
      return text.trim();
    } else {
      // Check for specific block reasons if available in the response
      const blockReason = response.candidates?.[0]?.finishReason;
      if (blockReason === 'SAFETY' || blockReason === 'OTHER') {
        return `AI summary could not be generated due to content policy (${blockReason}). Please review prompt or try again.`;
      }
      return "AI summary could not be generated at this time (empty response).";
    }
  } catch (error: any) {
    console.error('Error generating content with Gemini:', error);
    if (error.message && (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID'))) {
        return "Failed to generate AI summary: The provided Gemini API Key is invalid or not authorized. Please check your configuration.";
    }
     if (error.message && error.message.includes('permission denied')) {
        return "Failed to generate AI summary: Permission denied. This might be due to API key restrictions or billing issues.";
    }
    return `Failed to generate AI summary: ${error.message || 'Unknown error'}`;
  }
};