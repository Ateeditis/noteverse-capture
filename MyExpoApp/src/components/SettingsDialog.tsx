
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Modal,
  Portal,
  Appbar,
  Button,
  Switch,
  Divider,
  List,
  SegmentedButtons,
  Snackbar,
  ToggleButton,
} from 'react-native-paper';
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';

import { useTheme } from './ThemeProvider';

interface SettingsDialogProps {
  visible: boolean;
  onDismiss: () => void;
  className?: string;
}

const SettingsDialog = ({ visible, onDismiss, className }: SettingsDialogProps) => {
  const { theme, toggleTheme } = useTheme();
  const [highQualityCamera, setHighQualityCamera] = useState(true);
  const [autoSaveNotes, setAutoSaveNotes] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [value, setValue] = useState('general');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.Content title="Settings" titleStyle={styles.appbarTitle} />
          <Appbar.Action
            icon="close"
            onPress={onDismiss}
          />
        </Appbar.Header>

        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          density="medium"
          style={styles.tabList}
          buttons={[
            { value: 'general', label: 'General' },
            { value: 'camera', label: 'Camera' },
            { value: 'notes', label: 'Notes' },
          ]}
        />

        <View style={styles.contentContainer}>
          {value === 'general' && (
            <View style={styles.tabContent}>
              <List.Item
                title="Theme"
                left={(props) =>
                  theme === 'light' ? (
                    <MaterialIcons name="light-mode" size={24} color="black" {...props} />
                  ) : (
                    <MaterialIcons name="dark-mode" size={24} color="black" {...props} />
                  )
                }
                right={() => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 8, color: 'grey' }}>Light</Text>
                    <Switch value={theme === 'dark'} onValueChange={handleThemeToggle} />
                    <Text style={{ marginLeft: 8, color: 'grey' }}>Dark</Text>
                  </View>
                )}
              />
              <Divider />
              <List.Item
                title="App Version"
                left={(props) => <MaterialIcons name="info-outline" size={24} color="black" {...props} />}
                right={() => <Text style={{ color: 'grey' }}>1.0.0</Text>}
              />
            </View>
          )}
          {value === 'camera' && (
            <View style={styles.tabContent}>
              <List.Item
                title="High Quality Camera"
                left={(props) => <Feather name="camera" size={24} color="black" {...props} />}
                right={() => <Switch value={highQualityCamera} onValueChange={setHighQualityCamera} />}
              />
              <Text style={styles.mutedText}>
                Enabling high quality will use more storage but provide better OCR results
              </Text>
              <Divider />
              <Text style={styles.subheading}>Camera Grid Overlay</Text>
              <View style={styles.toggleGroupContainer}>
                <ToggleButton.Group onValueChange={() => {}} value="">
                  <ToggleButton value="ruleOfThirds" icon={() => <View />} label="Rule of thirds" />
                  <ToggleButton value="none" icon={() => <View />} label="None" />
                  <ToggleButton value="grid" icon={() => <View />} label="Grid" />
                </ToggleButton.Group>
              </View>
            </View>
          )}
          {value === 'notes' && (
            <View style={styles.tabContent}>
              <List.Item
                title="Auto-save notes"
                left={(props) => <MaterialCommunityIcons name="content-save-outline" size={24} color="black" {...props} />}
                right={() => <Switch value={autoSaveNotes} onValueChange={setAutoSaveNotes} />}
              />
              <Divider />
              <List.Item
                title="Confirm before deleting"
                left={(props) => <MaterialCommunityIcons name="trash-can-outline" size={24} color="black" {...props} />}
                right={() => <Switch value={confirmDelete} onValueChange={setConfirmDelete} />}
              />
              <Divider />
              <Button
                mode="contained"
                buttonColor="red"
                style={{marginTop: 10}}
                onPress={() => {
                  onToggleSnackBar();
                }}
              >
                Delete All Notes
              </Button>
            </View>
          )}
        </View>
      </Modal>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        duration={2000}
      >
        This would delete all notes in a real app
      </Snackbar>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 0,
    margin: 20,
    borderRadius: 10,
  },
  appbar: {
    backgroundColor: 'white',
  },
  appbarTitle: {
    fontWeight: 'bold',
  },
  tabList: {
    margin: 10,
  },
  contentContainer: {
    padding: 10,
  },
  tabContent: {
    gap: 10,
  },
  mutedText: {
    fontSize: 12,
    color: 'gray',
    paddingHorizontal: 16,
  },
  subheading: {
    fontWeight: 'bold',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  toggleGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
});

export default SettingsDialog;

import { useTheme } from '@/components/ThemeProvider';

interface SettingsDialogProps {
  className?: string;
}

const SettingsDialog = ({ className }: SettingsDialogProps) => {
  const { theme, toggleTheme } = useTheme();
  const [highQualityCamera, setHighQualityCamera] = React.useState(true);
  const [autoSaveNotes, setAutoSaveNotes] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(true);
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-full"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </SheetTitle>
        </SheetHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
            <TabsTrigger value="camera" className="flex-1">Camera</TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>Theme</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Light</span>
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                <span className="text-sm text-muted-foreground">Dark</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>App Version</span>
              </div>
              <span className="text-sm text-muted-foreground">1.0.0</span>
            </div>
          </TabsContent>
          
          <TabsContent value="camera" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span>High Quality Camera</span>
              </div>
              <Switch 
                checked={highQualityCamera} 
                onCheckedChange={setHighQualityCamera} 
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Enabling high quality will use more storage but provide better OCR results
            </p>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Camera Grid Overlay</h3>
              <div className="flex flex-wrap gap-2">
                <Toggle pressed>Rule of thirds</Toggle>
                <Toggle>None</Toggle>
                <Toggle>Grid</Toggle>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Auto-save notes</span>
              </div>
              <Switch 
                checked={autoSaveNotes} 
                onCheckedChange={setAutoSaveNotes} 
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                <span>Confirm before deleting</span>
              </div>
              <Switch 
                checked={confirmDelete} 
                onCheckedChange={setConfirmDelete} 
              />
            </div>
            
            <Separator />
            
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                toast.error("This would delete all notes in a real app");
              }}
            >
              Delete All Notes
            </Button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDialog;
