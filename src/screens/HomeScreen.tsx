import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, FlatList, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStack';
import { products } from '../products';
import { useFavourites } from '../FavouritesContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const userPhoto = require('../../assets/images/1.png'); // Placeholder for user photo

const categories = [
  { label: 'All Items', icon: '◯', value: 'all' },
  { label: 'Dress', icon: '👗', value: 'Dress' },
  { label: 'T-Shirt', icon: '👕', value: 'T-Shirt' },
  { label: 'Polo', icon: '🧑‍💼', value: 'Polo' },
];

const priceRanges = [
  { value: 'all' },
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    AsyncStorage.getItem('user').then(userStr => {
      if (userStr) setUser(JSON.parse(userStr));
    });
  }, []);
  const suggestionResults = searchQuery.length > 0
    ? products.filter(product => product.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];
  const { isFavourite, toggleFavourite } = useFavourites();
  const { colors } = useTheme();

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

  // Store dynamic image heights by product id
  const [imageHeights, setImageHeights] = useState({});

  // Helper to get image height for a given product
  const getImageHeight = (item) => {
    if (imageHeights[item.id]) return imageHeights[item.id];
    // Default fallback height
    return CARD_WIDTH;
  };

  // Preload image sizes for all products
  useEffect(() => {
    filteredProducts.forEach(item => {
      if (!imageHeights[item.id]) {
        if (typeof item.image === 'number') {
          // Local image
          const img = Image.resolveAssetSource(item.image);
          if (img && img.width && img.height) {
            setImageHeights(h => ({ ...h, [item.id]: CARD_WIDTH * (img.height / img.width) }));
          }
        } else if (item.image && item.image.uri) {
          // Remote image
          Image.getSize(item.image.uri, (w, h) => {
            setImageHeights(heights => ({ ...heights, [item.id]: CARD_WIDTH * (h / w) }));
          }, () => {
            setImageHeights(heights => ({ ...heights, [item.id]: CARD_WIDTH }));
          });
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProducts]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with user photo */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.hello, { color: colors.textSecondary }]}>Hello, Welcome <Text style={styles.wave}>👋</Text></Text>
          <Text style={[styles.username, { color: colors.text }]}>{user ? user.username : '—'}</Text>
        </View>
        <Image source={user && user.photo && user.photo.startsWith('http') ? { uri: user.photo } : userPhoto} style={styles.userPhoto} />
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Search clothes ..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            setShowSuggestions(text.length > 0);
          }}
          onFocus={() => setShowSuggestions(searchQuery.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        {showSuggestions && suggestionResults.length > 0 && (
          <View style={[styles.suggestionsContainer, { backgroundColor: colors.card, borderColor: colors.textSecondary }]}>
            {suggestionResults.map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.suggestionItem}
                onPress={() => {
                  setShowSuggestions(false);
                  setSearchQuery('');
                  navigation.navigate('ProductDetails', { product });
                }}
              >
                <Image source={product.image} style={styles.suggestionImage} />
                <Text style={[styles.suggestionText, { color: colors.text }]}>{product.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {/* Filter Bar: Categories + Price */}
      <View style={[styles.filterBar, { backgroundColor: colors.background }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={cat.label}
              style={[styles.categoryBtn, { backgroundColor: colors.card }, selectedCategory === cat.value && { backgroundColor: colors.text }]}
              onPress={() => setSelectedCategory(cat.value)}
            >
              <Text style={[styles.categoryText, { color: colors.text }, selectedCategory === cat.value && { color: colors.card }]}>{cat.icon} {cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={[styles.priceFilterBtn, { backgroundColor: colors.card }]} onPress={() => setShowPriceModal(true)}>
          {(() => {
            const selected = priceRanges.find(r => r.value === selectedPrice);
            if (selected.value === 'all') {
              return <Icon name="dollar" size={18} color={colors.text === '#fff' ? '#fff' : '#000'} />;
            }
            if (selected.label) {
              return <Text style={[styles.priceFilterText, { color: colors.text === '#fff' ? '#fff' : '#000' }]}>{selected.label}</Text>;
            }
            return null;
          })()}
        </TouchableOpacity>
      </View>
      {/* Price Filter Modal */}
      <Modal visible={showPriceModal} transparent animationType="fade">
        <TouchableOpacity style={[styles.modalOverlay, { backgroundColor: colors.background + 'CC' }]} onPress={() => setShowPriceModal(false)}>
          <View style={[styles.priceModal, { backgroundColor: colors.card }]}>
            {priceRanges.map(range => (
              <TouchableOpacity
                key={range.value}
                style={[styles.priceModalOption, { backgroundColor: colors.card }, selectedPrice === range.value && { backgroundColor: colors.text }]}
                onPress={() => { setSelectedPrice(range.value); setShowPriceModal(false); }}
              >
                {range.value === 'all' ? (
                  <Icon name="dollar" size={18} color={selectedPrice === 'all' ? colors.card : colors.text} />
                ) : (
                  <Text style={[styles.priceModalText, { color: colors.text }, selectedPrice === range.value && { color: colors.card }]}>{range.label}</Text>
                )}
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
        renderItem={({ item }) => {
          const imgHeight = getImageHeight(item);
          return (
            <TouchableOpacity style={[styles.card, { height: imgHeight + 90, backgroundColor: colors.card }]} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
              <Image source={item.image} style={[styles.cardImage, { height: imgHeight }]} resizeMode="cover" />
              <TouchableOpacity style={[styles.favoriteBtn, { backgroundColor: colors.card }]} onPress={() => toggleFavourite(item.id)}>
                <Text style={{ fontSize: 18, color: isFavourite(item.id) ? colors.danger : colors.text }}>{isFavourite(item.id) ? '♥' : '♡'}</Text>
              </TouchableOpacity>
              <View style={[styles.cardOverlay, { backgroundColor: colors.card, shadowColor: colors.text }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.cardCategory, { color: colors.textSecondary }]}>{item.category}</Text>
                <View style={styles.cardRow}>
                  <Text style={[styles.cardPrice, { color: colors.text }]}>{`$${item.price.toFixed(2)}`}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.cardStar, { color: '#F5A623' }]}>★</Text>
                    <Text style={[styles.cardRating, { color: colors.text }]}>{item.rating}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
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
    backgroundColor: '#fff',
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 0,
  },
  cardImage: {
    width: '100%',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
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
  suggestionsContainer: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    zIndex: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  suggestionImage: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 10,
    resizeMode: 'cover',
  },
  suggestionText: {
    fontSize: 16,
    flexShrink: 1,
  },
});

export default HomeScreen; 