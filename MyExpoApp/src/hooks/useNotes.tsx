
import { useState, useEffect } from 'react';
import { Note } from '@/lib/types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load notes from localStorage on component mount
    const loadNotes = () => {
      try {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes, loading]);

  const addNote = (note: Omit<Note, 'id'>) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(), // Generate a unique ID
    };

    setNotes(prevNotes => [newNote, ...prevNotes]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Omit<Note, 'id'>>) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id ? { ...note, ...updates } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  const getNoteById = (id: string) => {
    return notes.find(note => note.id === id);
  };

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    getNoteById
  };
}
