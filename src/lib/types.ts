
export interface Note {
  id: string;
  content: string;
  title: string;
  timestamp: number;
  sourceText?: string;
  sourceImageUrl?: string;
}

export interface OCRResult {
  text: string;
  confidence?: number;
}

export interface AIResult {
  content: string;
  title: string;
}
