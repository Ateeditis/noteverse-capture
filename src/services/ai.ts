
import { AIResult } from '@/lib/types';
import { pipeline } from '@huggingface/transformers';

const DEMO_MODE = false; // Set to false to use the actual LLM

// Model configuration
const MODEL_ID = 'MBZUAI/LaMini-Flan-T5-248M';

// Global reference to the model pipeline
let textGenerationPipeline: any = null;

// Function to load the model on demand
const loadModel = async () => {
  if (!textGenerationPipeline) {
    console.log('Loading text generation model...');
    try {
      textGenerationPipeline = await pipeline('text2text-generation', MODEL_ID);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load the language model');
    }
  }
  return textGenerationPipeline;
};

// This function generates a structured note from input text
export async function generateNoteFromText(text: string): Promise<AIResult> {
  if (DEMO_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a title from the text content
    let title = "Q3 Planning Meeting Summary";
    
    // Return structured content for demo purposes
    return {
      title,
      content: `# Q3 Planning Meeting Summary

## Financial Goals
- Revenue target: $2.5M for Q3
- Marketing budget increased by 15%

## Product Development
- New product launch scheduled for August
- Focus on improving the onboarding experience

## Team Growth
- Hiring plan includes 5 engineers and 2 designers

## Customer Success Initiatives
- Enhance support response times
- Launch a new loyalty program

## Key Performance Indicators
- Target conversion rate: 3.5%
- Target churn rate: <2%
- Target NPS score: >45

## Follow-up
- Next planning meeting scheduled for July 15th at 10am
`
    };
  }
  
  try {
    // Load the model if not already loaded
    const model = await loadModel();
    
    // Create a prompt that instructs the model to generate a structured note
    const prompt = `
Create a structured note in Markdown format from the following text:
Format the note with a clear title, sections with headings, and bullet points for key information.
Text: ${text}
`;

    // Generate the note using the model
    const result = await model(prompt, {
      max_length: 1024,
      temperature: 0.3,
    });

    // Extract the generated text
    const generatedText = result[0].generated_text;
    
    // Extract a title from the first line of the content
    const lines = generatedText.split('\n').filter(line => line.trim() !== '');
    const title = lines.length > 0 
      ? lines[0].replace(/^#+ /, '').trim() 
      : 'Generated Note';

    return {
      title,
      content: generatedText,
    };
  } catch (error) {
    console.error('AI service error:', error);
    throw new Error('Failed to generate note from text');
  }
}
