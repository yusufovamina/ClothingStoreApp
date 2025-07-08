import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProductListScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>For this Figma demo, use the Home and Cart tabs to see the main flows.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7FC',
    padding: SCREEN_WIDTH * 0.06,
  },
  text: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default ProductListScreen; 