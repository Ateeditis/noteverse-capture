
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NoteView from '@/components/NoteView';
import { Note } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NotesListProps {
  notes: Note[];
  onNewNote: () => void;
  onDeleteNote?: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  onNewNote,
  onDeleteNote,
  isLoading = false,
  className,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-fade-in">
          <div 
            className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={onNewNote}
            role="button"
            aria-label="Create new note"
          >
            <PlusCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No notes yet</h3>
          <p className="text-muted-foreground mb-6 max-w-xs">
            Capture notes from images, whiteboards, documents, and more with just a tap.
          </p>
          <Button onClick={onNewNote} className="gap-2 px-5 py-6">
            <PlusCircle className="h-5 w-5" />
            Create New Note
          </Button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="sticky top-16 z-10 bg-background/80 backdrop-blur-sm py-2 flex justify-between items-center">
            <h2 className="text-xl font-medium">
              {notes.length > 1 
                ? `${notes.length} Notes` 
                : '1 Note'}
            </h2>
            <Button onClick={onNewNote} size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              New
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {notes.map((note) => (
              <NoteView 
                key={note.id} 
                note={note} 
                onDelete={onDeleteNote} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesList;
