
import React from 'react';
import { Appbar, IconButton, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import SettingsDialog from './SettingsDialog';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showActions?: boolean;
  className?: string;
  
}

const Header: React.FC<HeaderProps> = ({
  title = 'NoteVerse',
  showBackButton = false,
  showActions = false,
  className,
}) => {
  const navigation = useNavigation();

  return (
    <Appbar.Header style={[styles.header, className]}>
      {showBackButton && (
        <Appbar.Action
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
      )}
      <Appbar.Content
        title={title}
        titleStyle={showBackButton ? styles.titleSmall : styles.titleLarge}
      />
      {showActions && (
        <View style={styles.actionsContainer}>
          <Appbar.Action icon="share" style={styles.button} />
           <SettingsDialog />
        </View>
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    zIndex: 10,
  },
  titleLarge: {
    fontWeight: '500',
  },
  titleSmall: {
    fontWeight: '500',
    fontSize:18
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button:{
    margin:0
  }
});

export default Header;
