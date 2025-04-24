import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotFound = () => {  
  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      route.name
    );
  }, [route.name]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Oops! Page not found</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Index')}>
          <Text style={styles.link}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: { fontSize: 40, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 20, color: 'gray', marginBottom: 16 },
  link: { color: 'blue', textDecorationLine: 'underline' },
});

export default NotFound;
