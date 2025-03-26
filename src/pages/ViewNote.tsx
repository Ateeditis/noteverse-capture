
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useNotes } from '@/hooks/useNotes';
import Header from '@/components/Header';
import NoteView from '@/components/NoteView';

const ViewNote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, deleteNote } = useNotes();
  
  const note = notes.find(note => note.id === id);
  
  const handleDelete = (id: string) => {
    deleteNote(id);
    toast.success('Note deleted');
    navigate('/');
  };
  
  if (!note) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Note not found" showBackButton />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-3">Note not found</h2>
            <p className="text-muted-foreground mb-6">
              The note you're looking for doesn't exist or has been deleted.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Back to Notes
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header title={note.title} showBackButton />
      
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          <NoteView 
            note={note}
            showFullContent
            showActions
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewNote;
