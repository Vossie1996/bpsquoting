
import { PacdoraDimensionResults } from '../types';
import { PACDORA_APP_ID, PACDORA_APP_KEY } from '../constants';

export interface PacdoraParams {
  modelId: string;
  length: number;
  width: number;
  height: number;
}

/**
 * MOCK FUNCTION: Simulates fetching flat dimensions from Pacdora.
 * In a real application, this function would make an HTTP request to the Pacdora API
 * using the PACDORA_APP_ID and PACDORA_APP_KEY.
 * The calculation logic here is a placeholder and highly simplified.
 */
export const mockGetFlatDimensions = async (
  params: PacdoraParams
): Promise<PacdoraDimensionResults> => {
  const { modelId, length, width, height } = params;

  console.log(`Mock Pacdora API call for modelId: ${modelId}`);
  console.log(`Using (mocked) Pacdora App ID: ${PACDORA_APP_ID}`);
  console.log(`Using (mocked) Pacdora App Key: ${PACDORA_APP_KEY}`);

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

  // Placeholder calculation logic. This is NOT ACCURATE for real-world scenarios
  // and depends heavily on the actual box style (modelId).
  // This is a very generic approximation.
  let flatLength: number;
  let flatWidth: number;

  // Example: a very basic estimation, might vary wildly based on actual box type
  // For a very simple box, flat length might be L + H + H + small flap, width might be W + H + H
  // This could be made slightly more "intelligent" if modelId hints at a type.
  if (modelId.toLowerCase().includes('mailer') || modelId.toLowerCase().includes('folder')) {
    flatLength = length + (height * 2.5) + (width * 0.5); // Highly arbitrary
    flatWidth = width + (height * 2) + 20; // 20mm for a generic tuck/flap
  } else if (modelId.toLowerCase().includes('rsc') || modelId.toLowerCase().includes('shipping')) { // Regular Slotted Carton
    flatLength = (length + width) * 2 + Math.max(20, width * 0.08); // (L+W)*2 + glue flap
    flatWidth = width + height; // This is actually for blank height, simplified
  } else { // Generic fallback
    flatLength = length + (height * 2) + Math.max(15, length*0.1); // Length + 2xHeight + small margin/flap
    flatWidth = width + (height * 2) + Math.max(15, width*0.1); // Width + 2xHeight + small margin/flap
  }
  
  // Ensure positive values and some sanity check
  flatLength = Math.max(length + height, flatLength);
  flatWidth = Math.max(width + height, flatWidth);

  // Simulate a potential error for certain model IDs or conditions
  if (modelId === "error_test_id") {
    throw new Error("Simulated Pacdora API error: Invalid model ID.");
  }

  return {
    flatLength: parseFloat(flatLength.toFixed(2)),
    flatWidth: parseFloat(flatWidth.toFixed(2)),
  };
};
