import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, setIsAuthenticated }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.0.133:3001/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const users = await response.json();
      if (users.length > 0) {
        await AsyncStorage.setItem('user', JSON.stringify(users[0]));
        setIsAuthenticated && setIsAuthenticated(true);
        // Можно сохранить пользователя в контекст или AsyncStorage, если нужно
      } else {
        Alert.alert('Login failed', 'Invalid email or password.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated blue blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <Animated.View style={[styles.form, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }] }>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Good to see you back! <Text style={{ fontSize: 18 }}>🖤</Text></Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#B0B0B0" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#B0B0B0" secureTextEntry value={password} onChangeText={setPassword} />
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Next'}</Text>
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
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
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