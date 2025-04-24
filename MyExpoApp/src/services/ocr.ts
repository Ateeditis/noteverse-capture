
import { OCRResult } from '@/lib/types';

const DEMO_MODE = true; // Set to false to use actual OCR API

// This is a mock OCR service for demo purposes
// In a real app, this would connect to Google Cloud Vision API or similar
export async function extractTextFromImage(imageData: string): Promise<OCRResult> {
  if (DEMO_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return dummy text for demo purposes
    return {
      text: "Meeting Notes - Q3 Planning\n\n1. Revenue targets: $2.5M for Q3\n2. New product launch in August\n3. Hiring plan: 5 engineers, 2 designers\n4. Marketing budget increased by 15%\n5. Customer retention focus areas:\n   - Improve onboarding experience\n   - Enhance support response times\n   - Launch loyalty program\n6. Key metrics to track:\n   - Conversion rate (target: 3.5%)\n   - Churn rate (target: < 2%)\n   - NPS (target: > 45)\n7. Next meeting: July 15th, 10am",
      confidence: 0.94
    };
  }
  
  try {
    // In a real implementation, you would:
    // 1. Send the image data to an OCR API
    // 2. Parse the response
    // 3. Return the extracted text

    // Example with Google Cloud Vision API (pseudocode)
    // const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     requests: [{
    //       image: { content: imageData.split(',')[1] },
    //       features: [{ type: 'TEXT_DETECTION' }]
    //     }]
    //   })
    // });
    
    // const result = await response.json();
    // return {
    //   text: result.responses[0].fullTextAnnotation.text,
    //   confidence: result.responses[0].textAnnotations[0].confidence
    // };

    throw new Error('OCR service not implemented');
  } catch (error) {
    console.error('OCR service error:', error);
    throw new Error('Failed to extract text from image');
  }
}
