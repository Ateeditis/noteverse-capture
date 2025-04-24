
import React from 'react';
import NoteView from '@/components/NoteView';
import { Note } from '@/lib/types';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { PlusCircleIcon } from 'react-native-heroicons/outline';
import { useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

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
    return (<View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
      <Text>Loading notes...</Text>
    </View>
    );
  }

  const theme = useTheme()

  return (
    <View style={{ width: '100%', flex:1}} >
      {notes.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <TouchableOpacity
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: theme.colors.secondary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}
            onClick={onNewNote}
            aria-label="Create new note"
          >
          <PlusCircleIcon color={theme.colors.onSecondary} size={32} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 8 }}>No notes yet</Text>
          <Text style={{ marginBottom: 24, maxWidth: '80%', textAlign: 'center' }}>
            Capture notes from images, whiteboards, documents, and more with just a tap.
          </Text>
          <Button 
            icon={{ uri: 'plus' }}
            mode="contained" 
            onPress={onNewNote}
            labelStyle={{ color: theme.colors.onPrimary }}
            style={{ gap: 8, paddingHorizontal: 10, paddingVertical: 12 }}
          >
            Create New Note
          </Button>
        </View>
      ) : (
        <View>
          <View style={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 10, 
            backgroundColor: theme.colors.background, 
            backdropFilter: 'blur(5px)', 
            paddingVertical: 8, 
            flexDirection: 'row',
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingHorizontal: 16 
          }}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>
              {notes.length > 1 ? `${notes.length} Notes` : '1 Note'}
            </Text>
            <Button
              mode="contained-tonal"
              onPress={onNewNote}
              style={{ gap: 4 }}
              labelStyle={{color: theme.colors.onSecondaryContainer}}
            >
            <PlusCircleIcon color={theme.colors.onSecondaryContainer} size={16}/>
              New
            </Button>
          </View>
          <ScrollView contentContainerStyle={{ gap: 16, padding: 16 }}>
            {notes.map((note) => (
              <NoteView 
                key={note.id} 
                note={note} 
                onDelete={onDeleteNote} 
              />
            ))}
          </ScrollView>
        </View> 
      )}
    </View>
  );
};

export default NotesList;
  