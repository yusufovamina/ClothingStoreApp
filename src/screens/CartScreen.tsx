import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import { useCart } from '../CartContext';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const paymentCard = {
  type: 'VISA',
  last4: '2143',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CartScreen() {
  const navigation = useNavigation();
  const { cart, removeFromCart, addToCart } = useCart();
  const insets = useSafeAreaInsets();
  const [modalProductId, setModalProductId] = useState<string | null>(null);

  const updateQty = (id: string, size?: string, color?: string, delta: number = 1) => {
    const item = cart.find(ci => ci.id === id && ci.size === size && ci.color === color);
    if (!item) return;
    if (item.quantity + delta <= 0) {
      removeFromCart(id, size, color);
    } else {
      addToCart(item, size, color, delta);
    }
  };

  // Group cart items by product id
  const groupedCart = Object.values(
    cart.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = { ...item, quantity: 0, breakdown: [] };
      }
      acc[item.id].quantity += item.quantity;
      acc[item.id].breakdown = acc[item.id].breakdown || [];
      acc[item.id].breakdown.push({ size: item.size, color: item.color, quantity: item.quantity });
      return acc;
    }, {} as Record<string, any>)
  );

  // Dynamic price calculations
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + (item.oldPrice ?? item.price) * item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = cart.reduce((sum, item) => sum + (((item.oldPrice ?? item.price) - item.price) * item.quantity), 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 + insets.bottom + 70 }} // 70px for tab bar
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBack} onPress={() => navigation.goBack()}><Text style={styles.headerBackIcon}>{'<'}</Text></TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle} numberOfLines={2} ellipsizeMode="tail">Checkout</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>
      {/* Cart Items */}
      <View style={styles.cartSection}>
        {groupedCart.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={item.image} style={styles.cartImage} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.cartTitle}>{item.title}</Text>
                <TouchableOpacity onPress={() => setModalProductId(item.id)} style={{ padding: 8 }}>
                  <Text style={{ fontSize: 22, color: '#888' }}>...</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cartCategory}>{item.category}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                {item.oldPrice && item.oldPrice !== item.price && (
                  <Text style={styles.oldPriceCart}>${(item.oldPrice * item.quantity).toFixed(2)}</Text>
                )}
                <Text style={styles.newPriceCart}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
              <Text style={styles.cartDescription}>{item.description}</Text>
              {item.breakdown.map((b: any, i: number) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                  <Text style={styles.cartCategory}>
                    {b.quantity} × {b.size || '-'} / {b.color || '-'}
                  </Text>
                  <View style={styles.qtyControl}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, b.size, b.color, -1)}>
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{b.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, b.size, b.color, 1)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cartMenu} onPress={() => removeFromCart(item.id, b.size, b.color)}>
                      <Text style={styles.cartMenuIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            {/* Modal for detailed info */}
            <Modal
              visible={modalProductId === item.id}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setModalProductId(null)}
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 24, width: '85%', maxWidth: 400 }}>
                  <Image source={item.image} style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 16 }} resizeMode="cover" />
                  <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>{item.title}</Text>
                  <Text style={{ fontSize: 15, color: '#888', marginBottom: 8 }}>{item.category}</Text>
                  <Text style={{ fontSize: 15, color: '#444', marginBottom: 8 }}>{item.description}</Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 8 }}>Variants:</Text>
                  {item.breakdown.map((b: any, i: number) => (
                    <Text key={i} style={{ fontSize: 15, color: '#222', marginBottom: 2 }}>
                      {b.quantity} × Size: {b.size || '-'}, Color: {b.color || '-'}
                    </Text>
                  ))}
                  <Text style={{ fontSize: 15, color: '#888', marginTop: 12 }}>Total: ${(item.price * item.quantity).toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => setModalProductId(null)} style={{ marginTop: 18, alignSelf: 'center', padding: 10, backgroundColor: '#222', borderRadius: 8 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        ))}
      </View>
      {/* Shipping Info */}
      <Text style={styles.sectionLabel}>Shipping Information</Text>
      <View style={styles.shippingBox}>
        <View style={styles.cardRow}>
          <View style={styles.cardIcon}><Text style={styles.cardIconText}>VISA</Text></View>
          <Text style={styles.cardNumber}>**** **** **** {paymentCard.last4}</Text>
        </View>
        <TouchableOpacity style={styles.cardDropdown}><Text style={styles.cardDropdownIcon}>⌄</Text></TouchableOpacity>
      </View>
      {/* Summary */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Total ({totalQty} items)</Text><Text style={styles.summaryValue}>${total.toFixed(2)}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Shipping Fee</Text><Text style={styles.summaryValue}>$0.00</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Discount</Text><Text style={styles.summaryValue}>-${discount.toFixed(2)}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Sub Total</Text><Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text></View>
      </View>
      {/* Pay Button */}
      <TouchableOpacity style={styles.payBtn}>
        <Text style={styles.payBtnText}>Pay</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FC',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SCREEN_WIDTH * 0.045,
    marginBottom: SCREEN_WIDTH * 0.045,
    marginHorizontal: SCREEN_WIDTH * 0.045,
  },
  headerBack: {
    width: SCREEN_WIDTH * 0.085,
    height: SCREEN_WIDTH * 0.085,
    borderRadius: (SCREEN_WIDTH * 0.085) / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  headerBackIcon: {
    fontSize: 20,
    color: '#222',
    fontWeight: 'bold',
  },
  headerTitleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    flexShrink: 1,
  },
  cartSection: {
    marginHorizontal: SCREEN_WIDTH * 0.045,
    marginBottom: SCREEN_WIDTH * 0.045,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: SCREEN_WIDTH * 0.035,
    padding: SCREEN_WIDTH * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  cartImage: {
    width: SCREEN_WIDTH * 0.16,
    height: SCREEN_WIDTH * 0.16,
    borderRadius: SCREEN_WIDTH * 0.03,
    marginRight: 12,
  },
  cartTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  cartCategory: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  cartPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  qtyBtn: {
    width: SCREEN_WIDTH * 0.075,
    height: SCREEN_WIDTH * 0.075,
    borderRadius: (SCREEN_WIDTH * 0.075) / 2,
    backgroundColor: '#F7F7FC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  qtyBtnText: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginHorizontal: SCREEN_WIDTH * 0.02,
  },
  cartMenu: {
    marginLeft: 6,
    padding: 4,
  },
  cartMenuIcon: {
    fontSize: 20,
    color: '#888',
  },
  sectionLabel: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginHorizontal: 18,
    marginBottom: 8,
  },
  shippingBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    backgroundColor: '#4A90E2',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
  },
  cardIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cardNumber: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
  cardDropdown: {
    marginLeft: 10,
  },
  cardDropdownIcon: {
    fontSize: 18,
    color: '#888',
  },
  summaryBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 18,
    padding: 14,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#888',
  },
  summaryValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
  payBtn: {
    backgroundColor: '#222',
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 10,
  },
  payBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  oldPriceCart: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  newPriceCart: {
    fontSize: 16,
    color: '#E53935',
    fontWeight: 'bold',
    marginRight: 8,
  },
  cartDescription: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
}); 