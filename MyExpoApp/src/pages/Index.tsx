
import React, { useState, useEffect } from 'react';
import { extractTextFromImage } from '@/services/ocr';
import { generateNoteFromText } from '@/services/ai';
import { useNotes } from '@/hooks/useNotes';
import { Camera, CameraType } from 'expo-camera';
import NotesList from '@/components/NotesList';
import Header from '@/components/Header';
import NoteView from '@/components/NoteView';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snackbar, IconButton } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const errorSvg = () => {
  return (
    <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
      <Path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </Svg>
  );
};

const Index = () => {
  const { notes, loading, addNote, deleteNote } = useNotes();
  const navigation = useNavigation();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [processingState, setProcessingState] = useState<'idle' | 'ocr' | 'ai' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
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

    try {
      setIsCameraActive(false);
      setProcessingState('ocr');
      setErrorMessage(null);

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
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(message);
        setProcessingState('error');
      toast.error('Failed to process image');
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

  const handleImageCapture = async (imageData: string) => {
  
  };
  const handleDeleteNote = (id: string) => {
    deleteNote(id);
        setSnackbarVisible(true);
    toast.success('Note deleted');
  };

  const handleDiscardNote = () => {
    setGeneratedNote(null);
  };

  const handleRetry = () => {
    setProcessingState('idle');
    setErrorMessage(null);
    setIsCameraActive(true);
  };
  
    const onDismissSnackBar = () => setSnackbarVisible(false);

  // Display camera when active
  if (isCameraActive) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Capture Image" showBackButton />
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={CameraType.back}
          />
          <View style={styles.cameraControls}>
            <Button title="Capture" onPress={handleImageCapture} />
            <Button title="Cancel" onPress={handleCameraCancel} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  // Display error screen
  if (processingState === 'error') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Error Occurred" showBackButton />
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            {errorSvg()}
          </View>
          
          <Text style={styles.errorTitle}>Processing Error</Text>
          
          <Text style={styles.errorText}>
            {errorMessage || 'An error occurred while processing your image.'}
          </Text>

          <Button title="Try Again" onPress={handleRetry} />
        </View>
      </SafeAreaView>
    );
  }
  
  // Display processing screens
  if (processingState === 'ocr' || processingState === 'ai') {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title={
            processingState === 'ocr' ? 'Extracting Text' : 'Generating Note'
          }
          showBackButton
        />
        <View style={styles.processingContainer}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.spinner}
          />
          
          <Text style={styles.processingTitle}>
            {processingState === 'ocr' ? 'Extracting Text' : 'Generating Note'}
          </Text>
          
          <Text style={styles.processingText}>
            {processingState === 'ocr'
              ? 'Reading and extracting text from your image...'
              : 'Analyzing the text and creating a structured note...'} </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Display generated note preview
  if (generatedNote) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Preview Note" showBackButton />        
          <ScrollView style={styles.previewScroll} contentContainerStyle={styles.previewScrollContent}>
            <View style={styles.notePreviewContainer}>
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

              <View style={styles.previewActions}>
                <Button title="Discard" onPress={handleDiscardNote} />
                <Button title="Save Note" onPress={handleSaveNote} />
              </View>
            </View>
          </ScrollView>
      </SafeAreaView>
    );
  }

  // Display notes list (main screen)
  return (
    <SafeAreaView style={styles.container}>
      <Header title="NoteVerse" showActions />
        
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <NotesList
              notes={notes}
              isLoading={loading}
              onNewNote={handleNewNote}
              onDeleteNote={handleDeleteNote}
            />
      </ScrollView>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={onDismissSnackBar}
          style={styles.snackbar}
        >
          Note deleted
        </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1, padding: 16 },
  scrollContent: { maxWidth: 800, alignSelf: 'center' },
  cameraContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  camera: { width: '100%', height: '80%' },
  cameraControls: { flexDirection: 'row', marginTop: 20, gap: 10 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  errorIcon: { width: 64, height: 64, marginBottom: 24 },
  errorTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  errorText: { textAlign: 'center', marginBottom: 24, color: '#475569' },
  processingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  spinner: { marginBottom: 24 },
  processingTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  processingText: { textAlign: 'center' , color: '#475569' },
  notePreviewContainer: {maxWidth: 800, alignSelf: 'center'},
  previewActions: { marginTop: 24, flexDirection: 'row', gap: 10, justifyContent: 'center' },
  previewScroll: {flex: 1},
  previewScrollContent:{gap: 10}
});

export default Index;
