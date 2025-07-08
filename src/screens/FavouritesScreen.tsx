import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useFavourites } from '../FavouritesContext';
import { products } from '../products';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStack';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FavouritesScreen = () => {
  const { favourites, isFavourite, toggleFavourite } = useFavourites();
  const favouriteProducts = products.filter(p => favourites.includes(p.id));
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList, 'ProductDetails'>>();

  if (favouriteProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>You have no favourites yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favouriteProducts}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: SCREEN_WIDTH * 0.06 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => (navigation as any).navigate('Home', { screen: 'ProductDetails', params: { product: item } })}
          >
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <TouchableOpacity onPress={() => toggleFavourite(item.id)}>
                  <Text style={{ fontSize: 22, color: isFavourite(item.id) ? '#E53935' : '#222' }}>{isFavourite(item.id) ? '♥' : '♡'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FC',
  },
  text: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 18,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  category: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  desc: {
    fontSize: 13,
    color: '#444',
    marginTop: 4,
  },
});

export default FavouritesScreen; 