
import React, { useState } from 'react';
import { Snackbar } from 'react-native-paper';
import { IconButton, Button } from 'react-native-paper';
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { toggleTheme, theme } = useTheme();
  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const themeName = theme.dark ? 'light' : 'dark';

  return (
    <>
      <IconButton
        icon={theme.dark ? 'lightbulb-on-outline' : 'moon'}
        mode="contained-tonal"
        size={30}
        onPress={() => {
          toggleTheme();
          onToggleSnackBar();
        }}
        accessibilityLabel="Toggle theme"
      />
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
        style={{ backgroundColor: theme.colors.primary }}
      >
        {`Theme changed to ${themeName} mode`}
      </Snackbar>
    </>
  );
}

export default ThemeToggle;
