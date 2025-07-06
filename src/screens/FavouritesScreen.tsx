import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FavouritesScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Your favourites will appear here.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7FC',
    padding: 24,
  },
  text: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default FavouritesScreen; 