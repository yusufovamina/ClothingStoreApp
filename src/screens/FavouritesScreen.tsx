import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useFavourites } from '../FavouritesContext';
import { products } from '../products';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStack';
import { useTheme } from '../CartContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FavouritesScreen = () => {
  const { favourites, isFavourite, toggleFavourite } = useFavourites();
  const favouriteProducts = products.filter(p => favourites.includes(p.id));
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList, 'ProductDetails'>>();
  const { colors } = useTheme();

  if (favouriteProducts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={[styles.text, { color: colors.textSecondary }]}>You have no favourites yet.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 18, textAlign: 'center' }]}>Favourites</Text>
      <FlatList
        data={favouriteProducts}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: SCREEN_WIDTH * 0.04, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}
            onPress={() => (navigation as any).navigate('Home', { screen: 'ProductDetails', params: { product: item } })}
            activeOpacity={0.92}
          >
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
              <Text style={[styles.title, { color: colors.text, fontSize: 17 }]} numberOfLines={1}>{item.title}</Text>
              <Text style={[styles.category, { color: colors.textSecondary, fontSize: 14 }]} numberOfLines={1}>{item.category}</Text>
              <Text style={[styles.desc, { color: colors.textSecondary, fontSize: 13 }]} numberOfLines={2}>{item.description}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>{`$${item.price.toFixed(2)}`}</Text>
                {item.rating && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Text style={{ color: '#F5A623', fontSize: 15 }}>★</Text>
                    <Text style={{ color: colors.text, fontSize: 14 }}>{item.rating}</Text>
                  </View>
                )}
                <TouchableOpacity onPress={() => toggleFavourite(item.id)} style={{ marginLeft: 'auto' }}>
                  <Text style={{ fontSize: 22, color: isFavourite(item.id) ? colors.danger : colors.text }}>{isFavourite(item.id) ? '♥' : '♡'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
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