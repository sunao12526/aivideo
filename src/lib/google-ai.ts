import { GoogleGenAI } from '@google/genai';

// Initialize the Google GenAI client
const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

/**
 * Generates text using the Gemini model
 * @param prompt The input prompt
 * @param systemInstruction Optional system instruction
 * @returns Generated text
 */
export async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
  // Prepare the parameters
  const params: any = {
    model: 'gemini-2.5-flash',
    contents: prompt,
  };

  // Add system instruction if provided
  if (systemInstruction) {
    params.config = { systemInstruction };
  }

  try {
    // Generate content
    const result = await genAI.models.generateContent(params);
    
    // Return the generated text
    return result.text || '';
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}

// Example usage
/*
const prompt = 'Explain quantum computing in simple terms';
const systemInstruction = 'You are a helpful assistant that explains complex topics in simple terms.';

// Generate text
const text = await generateText(prompt, systemInstruction);
console.log(text);

*/
