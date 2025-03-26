
import React, { useState } from 'react';
import { toast } from 'sonner';
import { extractTextFromImage } from '@/services/ocr';
import { generateNoteFromText } from '@/services/ai';
import { useNotes } from '@/hooks/useNotes';
import CameraComponent from '@/components/Camera';
import NotesList from '@/components/NotesList';
import Header from '@/components/Header';
import NoteView from '@/components/NoteView';

const Index = () => {
  const { notes, loading, addNote, deleteNote } = useNotes();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [processingState, setProcessingState] = useState<'idle' | 'ocr' | 'ai'>('idle');
  const [generatedNote, setGeneratedNote] = useState<{
    content: string;
    title: string;
    sourceText: string;
    sourceImageUrl: string;
  } | null>(null);

  const handleNewNote = () => {
    setIsCameraActive(true);
  };

  const handleCameraCancel = () => {
    setIsCameraActive(false);
  };

  const handleImageCapture = async (imageData: string) => {
    try {
      setIsCameraActive(false);
      setProcessingState('ocr');

      // Extract text from image
      const ocrResult = await extractTextFromImage(imageData);
      
      setProcessingState('ai');
      
      // Generate note from text
      const aiResult = await generateNoteFromText(ocrResult.text);
      
      // Set the generated note
      setGeneratedNote({
        content: aiResult.content,
        title: aiResult.title,
        sourceText: ocrResult.text,
        sourceImageUrl: imageData,
      });
      
      setProcessingState('idle');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
      setProcessingState('idle');
    }
  };

  const handleSaveNote = () => {
    if (generatedNote) {
      const newNote = addNote({
        content: generatedNote.content,
        title: generatedNote.title,
        timestamp: Date.now(),
        sourceText: generatedNote.sourceText,
        sourceImageUrl: generatedNote.sourceImageUrl,
      });
      
      setGeneratedNote(null);
      toast.success('Note saved successfully');
    }
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    toast.success('Note deleted');
  };

  const handleDiscardNote = () => {
    setGeneratedNote(null);
  };
  
  // Display camera when active
  if (isCameraActive) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Capture Image" showBackButton />
        <div className="flex-1 flex items-center justify-center p-4">
          <CameraComponent
            onCapture={handleImageCapture}
            onCancel={handleCameraCancel}
          />
        </div>
      </div>
    );
  }
  
  // Display processing screens
  if (processingState === 'ocr' || processingState === 'ai') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title={processingState === 'ocr' ? 'Extracting Text' : 'Generating Note'} showBackButton />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          
          <h2 className="text-xl font-medium mb-3">
            {processingState === 'ocr' ? 'Extracting Text' : 'Generating Note'}
          </h2>
          
          <p className="text-muted-foreground max-w-md">
            {processingState === 'ocr' 
              ? 'Reading and extracting text from your image...'
              : 'Analyzing the text and creating a structured note...'}
          </p>
        </div>
      </div>
    );
  }
  
  // Display generated note preview
  if (generatedNote) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Preview Note" showBackButton />
        
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-2xl mx-auto">
            <NoteView 
              note={{
                id: 'preview',
                content: generatedNote.content,
                title: generatedNote.title,
                timestamp: Date.now(),
              }}
              showFullContent
              showActions
            />
            
            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={handleDiscardNote}
                className="px-6 py-2 border border-border rounded-lg font-medium"
              >
                Discard
              </button>
              
              <button
                onClick={handleSaveNote}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Display notes list (main screen)
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="NoteVerse" showActions />
      
      <main className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          <NotesList
            notes={notes}
            isLoading={loading}
            onNewNote={handleNewNote}
            onDeleteNote={handleDeleteNote}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
