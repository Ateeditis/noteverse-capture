
import { AIResult } from '@/lib/types';

const DEMO_MODE = true; // Set to false to use actual AI API

// This is a mock AI service for demo purposes
// In a real app, this would connect to OpenAI API or similar
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
    // In a real implementation, you would:
    // 1. Send the text to an AI API with a well-crafted prompt
    // 2. Parse the response
    // 3. Return the generated note

    // Example with OpenAI API (pseudocode)
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-3.5-turbo',
    //     messages: [
    //       {
    //         role: 'system',
    //         content: 'You are a helpful assistant that creates well-structured notes from text. Extract key information, organize it into sections, and format it using Markdown.'
    //       },
    //       {
    //         role: 'user',
    //         content: text
    //       }
    //     ],
    //     temperature: 0.3
    //   })
    // });
    
    // const result = await response.json();
    // const content = result.choices[0].message.content;
    
    // // Extract a title from the first line of the content
    // const title = content.split('\n')[0].replace(/^#+ /, '');
    
    // return { content, title };

    throw new Error('AI service not implemented');
  } catch (error) {
    console.error('AI service error:', error);
    throw new Error('Failed to generate note from text');
  }
}
