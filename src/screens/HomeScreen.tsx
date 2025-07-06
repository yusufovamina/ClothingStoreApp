import React from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const userPhoto = require('../../assets/images/1.png'); // Placeholder for user photo

const products = [
  {
    id: '1',
    title: 'Modern Light Clothes',
    category: 'T-Shirt',
    price: 212.99,
    rating: 5.0,
    image: require('../../assets/images/2.png'),
  },
  {
    id: '2',
    title: 'Light Dress Bless',
    category: 'Dress modern',
    price: 162.99,
    rating: 5.0,
    image: require('../../assets/images/1.png'),
  },
  {
    id: '3',
    title: 'Modern Light Clothes',
    category: 'T-Shirt',
    price: 212.99,
    rating: 5.0,
    image: require('../../assets/images/2.png'),
  },
  {
    id: '4',
    title: 'Light Dress Bless',
    category: 'Dress modern',
    price: 162.99,
    rating: 5.0,
    image: require('../../assets/images/1.png'),
  },
];

const categories = [
  { label: 'All Items', icon: '◯' },
  { label: 'Dress', icon: '👗' },
  { label: 'T-Shirt', icon: '👕' },
];

const CARD_MARGIN = 14;
const CARD_WIDTH = (Dimensions.get('window').width - 3 * CARD_MARGIN) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header with user photo */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>Hello, Welcome <Text style={styles.wave}>👋</Text></Text>
          <Text style={styles.username}>Albert Stevano</Text>
        </View>
        <Image source={userPhoto} style={styles.userPhoto} />
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search clothes ..."
          placeholderTextColor="#B0B0B0"
        />
      </View>
      {/* Categories - horizontal scroll */}
      <View style={{ height: 48, marginBottom: 18 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {categories.map((cat, idx) => (
            <TouchableOpacity key={cat.label} style={[styles.categoryBtn, idx === 0 && styles.categoryBtnActive]}>
              <Text style={[styles.categoryText, idx === 0 && styles.categoryTextActive]}>{cat.icon} {cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Product Cards - vertical grid */}
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: CARD_MARGIN }}
        contentContainerStyle={styles.products}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
            <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
            <TouchableOpacity style={styles.favoriteBtn}>
              <Text style={{ fontSize: 18, color: '#222' }}>♡</Text>
            </TouchableOpacity>
            <View style={styles.cardOverlay}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardCategory}>{item.category}</Text>
              <View style={styles.cardRow}>
                <Text style={styles.cardPrice}>${item.price}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.cardStar}>★</Text>
                  <Text style={styles.cardRating}>{item.rating}</Text>
                </View>
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
    paddingHorizontal: 0,
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  hello: {
    fontSize: 16,
    color: '#888',
  },
  wave: {
    fontSize: 16,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 2,
  },
  userPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 10,
  },
  searchContainer: {
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  categories: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    gap: 10,
  },
  categoryBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 0,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  categoryBtnActive: {
    backgroundColor: '#222',
  },
  categoryText: {
    color: '#222',
    fontWeight: '500',
    fontSize: 15,
  },
  categoryTextActive: {
    color: '#fff',
  },
  products: {
    paddingHorizontal: CARD_MARGIN,
    paddingBottom: 90,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 0,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    zIndex: 2,
  },
  cardOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  cardCategory: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  cardStar: {
    color: '#F5A623',
    fontSize: 14,
    marginRight: 2,
  },
  cardRating: {
    fontSize: 13,
    color: '#222',
    fontWeight: 'bold',
  },
});

export default HomeScreen; 