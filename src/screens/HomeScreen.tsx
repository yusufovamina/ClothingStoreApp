import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, FlatList, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStack';
import { products } from '../products';
import { useFavourites } from '../FavouritesContext';

const userPhoto = require('../../assets/images/1.png'); // Placeholder for user photo

const categories = [
  { label: 'All Items', icon: '◯', value: 'all' },
  { label: 'Dress', icon: '👗', value: 'Dress' },
  { label: 'T-Shirt', icon: '👕', value: 'T-Shirt' },
  { label: 'Polo', icon: '🧑‍💼', value: 'Polo' },
];

const priceRanges = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under $100', value: 'under100' },
  { label: '$100 - $200', value: '100to200' },
  { label: 'Over $200', value: 'over200' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = SCREEN_WIDTH * 0.035;
const CARD_WIDTH = (SCREEN_WIDTH - 3 * CARD_MARGIN) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const { isFavourite, toggleFavourite } = useFavourites();

  // Filter products by category, search, and price
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesPrice = true;
    if (selectedPrice === 'under100') matchesPrice = product.price < 100;
    else if (selectedPrice === '100to200') matchesPrice = product.price >= 100 && product.price <= 200;
    else if (selectedPrice === 'over200') matchesPrice = product.price > 200;
    return matchesCategory && matchesSearch && matchesPrice;
  });

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
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {/* Filter Bar: Categories + Price */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={cat.label}
              style={[styles.categoryBtn, selectedCategory === cat.value && styles.categoryBtnActive]}
              onPress={() => setSelectedCategory(cat.value)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat.value && styles.categoryTextActive]}>{cat.icon} {cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.priceFilterBtn} onPress={() => setShowPriceModal(true)}>
          <Text style={styles.priceFilterText}>{priceRanges.find(r => r.value === selectedPrice)?.label || 'All Prices'}</Text>
        </TouchableOpacity>
      </View>
      {/* Price Filter Modal */}
      <Modal visible={showPriceModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowPriceModal(false)}>
          <View style={styles.priceModal}>
            {priceRanges.map(range => (
              <TouchableOpacity
                key={range.value}
                style={[styles.priceModalOption, selectedPrice === range.value && styles.priceModalOptionActive]}
                onPress={() => { setSelectedPrice(range.value); setShowPriceModal(false); }}
              >
                <Text style={[styles.priceModalText, selectedPrice === range.value && styles.priceModalTextActive]}>{range.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Product Cards - vertical grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: CARD_MARGIN }}
        contentContainerStyle={styles.products}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
            <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
            <TouchableOpacity style={styles.favoriteBtn} onPress={() => toggleFavourite(item.id)}>
              <Text style={{ fontSize: 18, color: isFavourite(item.id) ? '#E53935' : '#222' }}>{isFavourite(item.id) ? '♥' : '♡'}</Text>
            </TouchableOpacity>
            <View style={styles.cardOverlay}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardCategory}>{item.category}</Text>
              <View style={styles.cardRow}>
                <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
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
    paddingHorizontal: SCREEN_WIDTH * 0.05,
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
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: (SCREEN_WIDTH * 0.12) / 2,
    marginLeft: 10,
  },
  searchContainer: {
    marginVertical: 16,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
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
    paddingLeft: SCREEN_WIDTH * 0.05,
    gap: 10,
  },
  categoryBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: SCREEN_WIDTH * 0.045,
    paddingVertical: SCREEN_WIDTH * 0.025,
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
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    gap: 8,
  },
  priceFilterBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  priceFilterText: {
    color: '#222',
    fontWeight: '500',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    minWidth: 200,
    elevation: 3,
  },
  priceModalOption: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  priceModalOptionActive: {
    backgroundColor: '#222',
  },
  priceModalText: {
    fontSize: 16,
    color: '#222',
  },
  priceModalTextActive: {
    color: '#fff',
    fontWeight: 'bold',
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
    backgroundColor: 'rgba(255,255,255,0.97)',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    minHeight: 80,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
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