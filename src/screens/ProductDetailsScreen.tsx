import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

const defaultProduct = {
  id: '2',
  title: 'Light Dress Bless',
  category: 'Dress modern',
  price: 162.99,
  oldPrice: 190.99,
  rating: 5.0,
  reviews: 7932,
  image: require('../../assets/images/1.png'),
  description:
    'Its simple and elegant shape makes it perfect for those of you who like you who want minimalist clothes.',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['#000', '#E5C9A8', '#D9D9D9'],
};

export default function ProductDetailsScreen() {
  const route = useRoute();
  const product = route.params?.product || defaultProduct;
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : '#000');
  const [quantity, setQuantity] = useState(1);
  const [readMore, setReadMore] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Image and favorite icon */}
      <View style={styles.imageWrapper}>
        <Image source={product.image} style={styles.image} resizeMode="cover" />
        <TouchableOpacity style={styles.favoriteBtn}>
          <Text style={{ fontSize: 22, color: '#222' }}>♡</Text>
        </TouchableOpacity>
      </View>
      {/* Title, rating, reviews, price */}
      <View style={styles.infoSection}>
        <Text style={styles.title}>{product.title}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviews}>({product.reviews?.toLocaleString() || '0'} reviews)</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.oldPrice}>${product.oldPrice}</Text>
        </View>
        {/* Description */}
        <Text style={styles.desc} numberOfLines={readMore ? undefined : 2}>
          {product.description}
          {!readMore && (
            <Text style={styles.readMore} onPress={() => setReadMore(true)}> Read More...</Text>
          )}
        </Text>
        {/* Size selector */}
        <View style={styles.selectorRow}>
          <Text style={styles.selectorLabel}>Choose Size</Text>
          <View style={styles.sizeRow}>
            {(product.sizes || ['M']).map((size) => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnActive]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Color selector */}
        <View style={styles.selectorRow}>
          <Text style={styles.selectorLabel}>Color</Text>
          <View style={styles.colorRow}>
            {(product.colors || ['#000']).map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorCircle, { backgroundColor: color }, selectedColor === color && styles.colorCircleActive]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>
        {/* Quantity selector */}
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        {/* Add to Cart button */}
        <TouchableOpacity style={styles.addToCartBtn}>
          <Text style={styles.addToCartText}>Add to Cart | ${product.price}</Text>
          <Text style={styles.addToCartOldPrice}>${product.oldPrice}</Text>
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
}); 