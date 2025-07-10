import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FavouritesScreen from './src/screens/FavouritesScreen';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './src/CartContext';
import HomeStack from './src/navigation/HomeStack';
import { CartProvider, OrdersProvider, ThemeProvider } from './src/CartContext';
import { FavouritesProvider } from './src/FavouritesContext';
import AuthStack from './src/navigation/AuthStack';
import React, { useState } from 'react';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <FavouritesProvider>
        <OrdersProvider>
          <CartProvider>
            <AppWithTheme />
          </CartProvider>
        </OrdersProvider>
      </FavouritesProvider>
    </ThemeProvider>
  );
}

function AppWithTheme() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { colors } = useTheme();
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: [styles.tabBar, { backgroundColor: colors.card }],
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Cart') {
                iconName = focused ? 'cart' : 'cart-outline';
              } else if (route.name === 'Favourites') {
                iconName = focused ? 'heart' : 'heart-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }
              return <Ionicons name={iconName} size={28} color={color} />;
            },
            tabBarActiveTintColor: colors.text,
            tabBarInactiveTintColor: colors.textSecondary,
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Cart" component={CartScreen} />
          <Tab.Screen name="Favourites" component={FavouritesScreen} />
          <Tab.Screen name="Profile">
            {props => <ProfileScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <AuthStack setIsAuthenticated={setIsAuthenticated} />
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 18,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 0,
    zIndex: 10,
  },
});
