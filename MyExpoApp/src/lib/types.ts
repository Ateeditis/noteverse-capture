
export interface Note {
  id: string;
  content: string;
  title: string;
  timestamp: number;
  sourceText?: string;
  sourceImageUrl?: string;
  structuredContent?: Record<string, string[]>;
}

export interface OCRResult {
  text: string;
  confidence?: number;
}

export interface AIResult {
  title: string;
  structuredContent: Record<string, string[]>;
  uncertainties?: string[];
}
