import { GoogleGenAI } from '@google/genai';

// Initialize the Google GenAI client
const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY!,
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
    model: 'gemini-2.0-flash',
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

/**
 * Generates streaming text using the Gemini model
 * @param prompt The input prompt
 * @param systemInstruction Optional system instruction
 * @returns AsyncGenerator that yields text chunks
 */
export async function* generateTextStream(prompt: string, systemInstruction?: string): AsyncGenerator<string> {
  // Prepare the parameters
  const params: any = {
    model: 'gemini-2.0-flash',
    contents: prompt,
  };

  // Add system instruction if provided
  if (systemInstruction) {
    params.config = { systemInstruction };
  }

  try {
    // Generate streaming content
    const stream = await genAI.models.generateContentStream(params);
    
    // Yield each chunk of text
    for await (const chunk of stream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error('Error generating streaming text:', error);
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

// Generate streaming text
for await (const chunk of generateTextStream(prompt, systemInstruction)) {
  process.stdout.write(chunk);
}
*/
