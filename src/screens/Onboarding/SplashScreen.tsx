import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing } from 'react-native';

const logo = require('../../../assets/images/icon.png');

export default function SplashScreen({ navigation }: any) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 100, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
    ]).start(() => navigation.navigate('Register'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <View style={styles.logoCircle}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
      </View>
      <Text style={styles.title}>Shoppe</Text>
      <Text style={styles.subtitle}>Beautiful eCommerce UI Kit{"\n"}for your online store</Text>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Let's get started</Text>
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.secondaryText}>I already have an account →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F2F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#1769FF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginBottom: 18,
    shadowColor: '#1769FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryBtn: {
    marginTop: 8,
  },
  secondaryText: {
    color: '#1769FF',
    fontSize: 15,
    fontWeight: '500',
  },
}); 