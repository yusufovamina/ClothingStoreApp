import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Easing } from 'react-native';

export default function RegisterScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
    ]).start();
  }, []);

  const handlePhotoPress = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 0.85, duration: 100, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <Animated.View style={[styles.form, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }] }>
        <Text style={styles.title}>Create{' '}Account</Text>
        <Animated.View style={{ alignItems: 'center', marginBottom: 24, transform: [{ scale: bounceAnim }] }}>
          <TouchableOpacity style={styles.photoCircle} onPress={handlePhotoPress} activeOpacity={0.7}>
            <Text style={styles.photoIcon}>📷</Text>
          </TouchableOpacity>
        </Animated.View>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#B0B0B0" keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#B0B0B0" secureTextEntry />
        <View style={styles.phoneRow}>
          <View style={styles.flag}><Text style={styles.flagText}>🇬🇧</Text></View>
          <TextInput style={styles.phoneInput} placeholder="Your number" placeholderTextColor="#B0B0B0" keyboardType="phone-pad" />
        </View>
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blob1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    backgroundColor: '#1769FF',
    borderRadius: 110,
    opacity: 0.18,
    zIndex: 0,
  },
  blob2: {
    position: 'absolute',
    top: 120,
    left: -80,
    width: 180,
    height: 180,
    backgroundColor: '#1769FF',
    borderRadius: 90,
    opacity: 0.12,
    zIndex: 0,
  },
  form: {
    width: '90%',
    backgroundColor: 'transparent',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  photoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#1769FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  photoIcon: {
    fontSize: 28,
    color: '#1769FF',
  },
  input: {
    width: '100%',
    backgroundColor: '#F2F6FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#222',
    marginBottom: 16,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F2F6FF',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  flag: {
    marginRight: 8,
  },
  flagText: {
    fontSize: 22,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 14,
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
  cancelBtn: {
    marginTop: 8,
  },
  cancelText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '500',
  },
}); 