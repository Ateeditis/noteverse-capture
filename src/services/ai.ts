import { AIResult } from '@/lib/types'; // Assuming AIResult might need adjustment for JSON
import { pipeline, Pipeline } from '@huggingface/transformers';

// Adjust AIResult type if needed to better fit JSON output
// Example:
// export interface AIResult {
//   title: string;
//   structuredContent: Record<string, any>; // Or a more specific type for your expected JSON
//   originalContent?: string; // Keep raw generated markdown if needed
//   uncertainties?: string[];
// }

const DEMO_MODE = false; // Set to false to use the actual LLM

// --- Model and Caching ---
const MODEL_ID = 'MBZUAI/LaMini-Flan-T5-248M'; // Small model suitable for client-side (with limitations)
let textGenerationPipeline: Pipeline | null = null;
// Simple in-memory cache for the current session
const generationCache = new Map<string, AIResult>();

// --- Model Loading ---
const loadModel = async (): Promise<Pipeline> => {
  // Race condition prevention: If multiple calls happen while loading, only load once.
  if (!loadModel.promise) {
      if (textGenerationPipeline) {
          // Already loaded
          loadModel.promise = Promise.resolve(textGenerationPipeline);
      } else {
          console.log(`Loading client-side model: ${MODEL_ID}...`);
          loadModel.promise = new Promise(async (resolve, reject) => {
              try {
                  // Use xenova's fork prefix for browser usage
                  const model_path = `Xenova/${MODEL_ID}`;
                  textGenerationPipeline = await pipeline('text2text-generation', model_path, {
                      // Optional: Specify quantization/precision for potentially faster loading/inference
                      // quantized: true, // Check compatibility with the specific model
                  });
                  console.log('Client-side model loaded successfully');
                  resolve(textGenerationPipeline);
              } catch (error) {
                  console.error('Error loading client-side model:', error);
                  textGenerationPipeline = null; // Ensure it's null on failure
                  loadModel.promise = null; // Reset promise to allow retries
                  reject(new Error('Failed to load the language model'));
              }
          });
      }
  }
  return loadModel.promise;
};
// Add a static property to the function object to hold the promise
loadModel.promise = null as Promise<Pipeline> | null;


// --- Note Generation Function ---
export async function generateNoteFromText(ocrText: string): Promise<AIResult> {
  const cacheKey = ocrText; // Use the input text as the cache key

  // Check cache first
  if (!DEMO_MODE && generationCache.has(cacheKey)) {
    console.log('Returning cached result for:', cacheKey.substring(0, 50) + '...');
    return generationCache.get(cacheKey)!;
  }

  if (DEMO_MODE) {
    console.log("Running in DEMO_MODE");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Shorter delay for demo

    // Demo output using a structured format
    const demoResult: AIResult = {
      title: "Q3 Planning Meeting (Demo)",
      structuredContent: {
        "Financial Goals": [
          "Revenue target: $2.5M for Q3",
          "Marketing budget increased by 15%"
        ],
        "Product Development": [
          "New product launch scheduled for August",
          "Focus on improving the onboarding experience"
        ],
        "Team Growth": [
          "Hiring plan includes 5 engineers and 2 designers"
        ],
        // ... add other sections similarly
      },
      uncertainties: ["Demo data, not from actual LLM"]
    };
    // Cache the demo result too, why not
    generationCache.set(cacheKey, demoResult);
    return demoResult;
  }

  // --- Actual LLM Processing ---
  try {
    console.log("Loading/Getting client-side model instance...");
    const model = await loadModel(); // Ensure model is loaded

    // **Step 6 (Guide): Refine the LLM Prompt for OCR & JSON Output**
    const prompt = `
Context: You are processing text extracted from an image using OCR. This text might contain errors (like '1' vs 'l', '0' vs 'O', 'S' vs '5', spacing issues).
Task: Analyze the following OCR text. Correct obvious OCR errors. Extract the key information and structure it logically. Generate a concise title. Output the result ONLY as a JSON object with the following format:
{
  "title": "A concise title summarizing the content",
  "structuredContent": {
    "Section Heading 1": ["Bullet point 1", "Bullet point 2"],
    "Section Heading 2": ["Details here", "More details"],
    "...": ["..."]
  },
  "uncertainties": ["List any significant assumptions or corrections made, e.g., 'Corrected '1tem' to 'Item'", "Could not determine date", "Possible typo in vendor name"]
}

Strict Instructions:
- Your entire output MUST be a single valid JSON object. Do not include any text before or after the JSON.
- If the text is too short or nonsensical, return JSON with an empty title, empty structuredContent, and an uncertainty note.
- Infer logical section headings based on the content.
- Correct common OCR mistakes silently unless the correction significantly changes meaning, then note it in uncertainties.

OCR Text:
\`\`\`
${ocrText}
\`\`\`

JSON Output:
`; // The model should continue generating the JSON from here

    console.log("Generating note with client-side model...");
    // Generate the note using the model
    const result = await model(prompt, {
      max_length: 512,       // Adjust based on expected output size and model limits
      min_length: 50,        // Encourage more detailed output
      temperature: 0.4,      // Slightly creative but mostly factual
      num_beams: 3,          // Beam search can improve quality slightly
      early_stopping: true, // Stop when EOS token is generated
      // skip_special_tokens: true, // Usually true for generation tasks
    });

    // Extract the generated text
    let generatedText = result[0].generated_text;
    console.log("Raw generated text:", generatedText);

    // **Step 7 (Guide): Handle Structured Data (JSON)**
    let parsedResult: any;
    try {
        // Clean potential markdown code fences if the model added them
        generatedText = generatedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        parsedResult = JSON.parse(generatedText);

        if (!parsedResult.title || typeof parsedResult.structuredContent !== 'object') {
           throw new Error("Generated JSON is missing required fields (title, structuredContent).");
        }

    } catch (jsonError) {
        console.error('Failed to parse generated JSON:', jsonError);
        console.error('Problematic generated text:', generatedText);
        // Fallback: Try to provide *something* even if JSON fails
        return {
             title: "Processing Error",
             structuredContent: { "Error": "Failed to process AI response correctly.", "RawOutput": generatedText.substring(0, 500) + "..." },
             uncertainties: ["Failed to parse LLM output as valid JSON."]
        };
    }

    // Construct the final AIResult object from the parsed JSON
    const finalResult: AIResult = {
        title: parsedResult.title || "Generated Note", // Fallback title
        structuredContent: parsedResult.structuredContent || {}, // Fallback content
        uncertainties: parsedResult.uncertainties || [], // Fallback uncertainties
    };

    // Cache the successful result
    generationCache.set(cacheKey, finalResult);

    return finalResult;

  } catch (error: any) {
    console.error('AI service error (client-side):', error);
    // Provide a structured error response
    throw new Error(`AI Generation Failed: ${error.message || 'Unknown error'}`);
    // Or return an AIResult indicating failure:
    // return {
    //   title: "Error",
    //   structuredContent: {"Error": `AI Generation Failed: ${error.message || 'Unknown error'}`},
    //   uncertainties: ["Processing failed"]
    // };
  }
}
