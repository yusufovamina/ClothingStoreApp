import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const cartItems = [
  {
    id: '1',
    title: 'Modern light clothes',
    category: 'Dress modern',
    price: 212.99,
    image: require('../../assets/images/2.png'),
    qty: 4,
  },
  {
    id: '2',
    title: 'Modern light clothes',
    category: 'Dress modern',
    price: 162.99,
    image: require('../../assets/images/1.png'),
    qty: 1,
  },
];

const paymentCard = {
  type: 'VISA',
  last4: '2143',
};

export default function CartScreen() {
  const [items, setItems] = useState(cartItems);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBack}><Text style={styles.headerBackIcon}>{'<'}</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 32 }} />
      </View>
      {/* Cart Items */}
      <View style={styles.cartSection}>
        {items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={item.image} style={styles.cartImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cartTitle}>{item.title}</Text>
              <Text style={styles.cartCategory}>{item.category}</Text>
              <Text style={styles.cartPrice}>${item.price}</Text>
            </View>
            <View style={styles.qtyControl}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.cartMenu}><Text style={styles.cartMenuIcon}>⋮</Text></TouchableOpacity>
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
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Discount</Text><Text style={styles.summaryValue}>$0.00</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Sub Total</Text><Text style={styles.summaryValue}>${total.toFixed(2)}</Text></View>
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
    marginTop: 18,
    marginBottom: 18,
    marginHorizontal: 18,
  },
  headerBack: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  cartSection: {
    marginHorizontal: 18,
    marginBottom: 18,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  cartImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
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
    width: 28,
    height: 28,
    borderRadius: 14,
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
    marginHorizontal: 8,
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
}); 