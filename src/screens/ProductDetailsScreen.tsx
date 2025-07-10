import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useCart } from '../CartContext';
import { useFavourites } from '../FavouritesContext';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeStack';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../CartContext';

export default function ProductDetailsScreen() {
  const { addToCart } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();
  const route = useRoute<RouteProp<HomeStackParamList, 'ProductDetails'>>();
  const product = route.params.product;
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes ? product.sizes[0] : 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors ? product.colors[0] : '#000');
  const [quantity, setQuantity] = useState<number>(1);
  const [readMore, setReadMore] = useState(false);
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice,
        rating: product.rating,
        image: product.image,
        description: product.description,
        sizes: product.sizes,
        colors: product.colors,
      },
      selectedSize,
      selectedColor,
      quantity
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Image and overlay buttons */}
      <View style={[styles.imageWrapperLarge, { backgroundColor: colors.card }]}>
        <Image source={product.image} style={styles.imageLarge} resizeMode="cover" />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteBtn} onPress={() => toggleFavourite(product.id)}>
          <Text style={{ fontSize: 22, color: isFavourite(product.id) ? '#E53935' : '#222' }}>{isFavourite(product.id) ? '♥' : '♡'}</Text>
        </TouchableOpacity>
      </View>
      {/* Info section */}
      <View style={[styles.infoSection, { backgroundColor: colors.card, shadowColor: colors.text }]}>
        {/* Title and quantity row */}
        <View style={styles.titleQtyRow}>
          <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>
          <View style={styles.qtyRowInline}>
            <TouchableOpacity style={[styles.qtyBtn, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={() => setQuantity(q => Math.max(1, q - 1))}>
              <Text style={[styles.qtyBtnText, { color: colors.text }]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.qtyText, { color: '#000' }]}>{quantity}</Text>
            <TouchableOpacity style={[styles.qtyBtn, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={() => setQuantity(q => q + 1)}>
              <Text style={[styles.qtyBtnText, { color: colors.text }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Rating and reviews */}
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={[styles.rating, { color: colors.text === '#fff' ? '#fff' : '#000' }]}>{product.rating}</Text>
          <Text style={styles.reviews}>({product.reviews?.toLocaleString() || '0'} reviews)</Text>
        </View>
        {/* Description */}
        <Text style={[styles.desc, { color: colors.textSecondary }]}>{product.description}</Text>
        {/* Size selector */}
        <View style={styles.selectorBlock}>
          <Text style={[styles.selectorLabel, { color: colors.text }]}>Choose Size</Text>
          <View style={styles.sizeRowBlock}>
            {(product.sizes || ['M']).map((size: string) => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeBtn, { backgroundColor: colors.card, borderColor: colors.border }, selectedSize === size && { backgroundColor: colors.accent }]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[styles.sizeText, { color: colors.text }, selectedSize === size && { color: colors.card }]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Color selector */}
        <View style={styles.selectorBlock}>
          <Text style={[styles.selectorLabel, { color: colors.text }]}>Color</Text>
          <View style={styles.colorRowBlock}>
            {(product.colors || ['#000']).map((color: string) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorCircle, { backgroundColor: color }, selectedColor === color && styles.colorCircleActive]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>
        {/* Add to Cart button */}
        <TouchableOpacity style={[styles.addToCartBtn, { backgroundColor: colors.accent }]} onPress={handleAddToCart}>
          <Text style={[styles.addToCartText, { color: colors.card }]}>{`Add to Cart | $${(product.price * quantity).toFixed(2)}`}</Text>
          {product.oldPrice && (
            <Text style={[styles.addToCartOldPrice, { color: colors.textSecondary }]}>{`$${(product.oldPrice * quantity).toFixed(2)}`}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FC',
  },
  imageWrapper: {
    marginTop: 18,
    marginHorizontal: 18,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 320,
    borderRadius: 24,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    zIndex: 2,
  },
  imageWrapperLarge: {
    marginTop: 18,
    marginHorizontal: 12,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    height: 380,
    backgroundColor: '#fff',
    elevation: 2,
  },
  imageLarge: {
    width: '100%',
    height: 380,
    borderRadius: 32,
  },
  backBtn: {
    position: 'absolute',
    top: 18,
    left: 18,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    zIndex: 2,
  },
  infoSection: {
    marginTop: 18,
    marginHorizontal: 24,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  star: {
    color: '#F5A623',
    fontSize: 16,
    marginRight: 2,
  },
  rating: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#4A90E2',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 10,
  },
  oldPrice: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  desc: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
  },
  readMore: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectorLabel: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginRight: 16,
    minWidth: 80,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeBtn: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  sizeBtnActive: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  sizeText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sizeTextActive: {
    color: '#fff',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
  },
  colorCircleActive: {
    borderColor: '#222',
    borderWidth: 2,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  qtyRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7FC',
    borderRadius: 18,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F7FC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  qtyBtnText: {
    fontSize: 22,
    color: '#222',
    fontWeight: 'bold',
  },
  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginHorizontal: 18,
  },
  addToCartBtn: {
    backgroundColor: '#222',
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginRight: 10,
  },
  addToCartOldPrice: {
    color: '#fff',
    fontSize: 15,
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  selectorBlock: {
    marginTop: 12,
    marginBottom: 4,
  },
  sizeRowBlock: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  colorRowBlock: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  titleQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
}); 