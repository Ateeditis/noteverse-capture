
import React from "react";
import { useNotes } from "@/hooks/useNotes";
import Header from "@/components/Header";
import NoteView from "@/components/NoteView";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Snackbar, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const ViewNote = ({ route, navigation }) => {
  const { id } = route.params;
  const { notes, deleteNote } = useNotes();

  const note = notes.find((note) => note.id === id);
  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const handleDelete = (id) => {
    deleteNote(id);
    onToggleSnackBar();
    navigation.navigate("Index");
  };

  if (!note) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Note not found" showBackButton navigation={navigation} />
        <View style={styles.mainContent}>
          <View style={styles.centerContent}>
            <Text style={styles.title}>Note not found</Text>
            <Text style={styles.subtitle}>
              The note you're looking for doesn't exist or has been deleted.
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Index")}
            >
              Back to Notes
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={note.title} showBackButton navigation={navigation} />

      <ScrollView style={styles.mainContent}>
        <View style={styles.maxWidthContainer}>
          <NoteView
            note={note}
            showFullContent
            showActions
            onDelete={handleDelete}
          />
        </View>
      </ScrollView>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={2000}
      >
        Note deleted
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  maxWidthContainer: {
    maxWidth: "100%",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
    textAlign: "center",
  },
});

export default ViewNote;
