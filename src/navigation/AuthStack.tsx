import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../CartContext';
import SplashScreen from '../screens/Onboarding/SplashScreen';
import LoginScreen from '../screens/Onboarding/LoginScreen';
import RegisterScreen from '../screens/Onboarding/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login">
        {props => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {props => <RegisterScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
} 