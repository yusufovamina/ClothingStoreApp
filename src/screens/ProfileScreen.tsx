import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOrders, useTheme } from '../CartContext';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, TouchableWithoutFeedback, Switch, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ProfileScreen({ navigation, setIsAuthenticated }: any) {
  const [modal, setModal] = useState<null | 'about' | 'support' | 'orders'>(null);
  const { orders } = useOrders();
  const { theme, toggleTheme, colors } = useTheme();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        setUser(u);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    setIsAuthenticated && setIsAuthenticated(false);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const getUserPhotoSource = () => {
    if (user && user.photo && user.photo.startsWith('http')) {
      return { uri: user.photo };
    }
    return require('../../assets/images/1.png');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* User Info */}
      <View style={[styles.userInfoSection, { backgroundColor: colors.card }]}>
        <Image source={getUserPhotoSource()} style={styles.userPhoto} />
        <Text style={[styles.userName, { color: colors.text }]}>{user ? user.username : '—'}</Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user ? user.email : ''}</Text>
      </View>

      {/* Account Actions */}
      <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.text }]}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>Account</Text>
        <MenuItem icon="shopping-bag" label="My Orders" onPress={() => setModal('orders')} />
        <MenuItem icon="heart" label="Favourites" onPress={() => navigation.navigate('Favourites')} />
        <View style={styles.paymentRow}>
          <Icon name="credit-card" size={20} color={colors.accent} style={{ marginRight: 16 }} />
          <Text style={[styles.menuLabel, { color: colors.text }]}>Payment Method: VISA **** 2143</Text>
        </View>
        <View style={styles.themeRow}>
          <Icon name="moon-o" size={20} color={colors.accent} style={{ marginRight: 16 }} />
          <Text style={[styles.menuLabel, { color: colors.text }]}>Dark Mode</Text>
          <Switch value={theme === 'dark'} onValueChange={toggleTheme} style={{ marginLeft: 'auto' }} />
        </View>
      </View>

      {/* Orders Modal */}
      {modal === 'orders' && (
        <ModalView onClose={() => setModal(null)} title="My Orders">
          {orders.length === 0 ? (
            <Text style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>No orders yet.</Text>
          ) : (
            orders.map(order => (
              <View key={order.id} style={{ marginBottom: 16 }}>
                <Text style={{ fontWeight: 'bold', color: '#1769FF', marginBottom: 2 }}>Order #{order.id.slice(-6)}</Text>
                <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>{new Date(order.date).toLocaleString()}</Text>
                <Text style={{ fontSize: 15, marginBottom: 2 }}>Total: ${order.total.toFixed(2)}</Text>
                <Text style={{ color: '#444', fontSize: 14, marginBottom: 2 }}>Items:</Text>
                {order.items.map((item, idx) => (
                  <Text key={idx} style={{ color: '#444', fontSize: 13, marginLeft: 8 }}>
                    - {item.title} × {item.quantity} ({item.size || '-'}, {item.color || '-'})
                  </Text>
                ))}
              </View>
            ))
          )}
        </ModalView>
      )}

      {/* Support */}
      <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.text }]}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>Support</Text>
        <MenuItem icon="question-circle" label="Help & Support" onPress={() => setModal('support')} />
        <MenuItem icon="info-circle" label="About" onPress={() => setModal('about')} />
      </View>

      {/* About Modal */}
      {modal === 'about' && (
        <ModalView onClose={() => setModal(null)} title="About">
          <View style={styles.infoRow}><Icon name="info-circle" size={18} color="#1769FF" style={{ marginRight: 10 }} /><Text style={styles.infoText}>ClothingStoreApp v1.0.0</Text></View>
          <View style={styles.infoRow}><Icon name="user" size={18} color="#1769FF" style={{ marginRight: 10 }} /><Text style={styles.infoText}>Developed by Your Company</Text></View>
          <View style={styles.infoRow}><Icon name="globe" size={18} color="#1769FF" style={{ marginRight: 10 }} /><Text style={styles.infoText}>www.yourcompany.com</Text></View>
        </ModalView>
      )}
      {/* Support Modal */}
      {modal === 'support' && (
        <ModalView onClose={() => setModal(null)} title="Help & Support">
          <View style={styles.infoRow}><Icon name="question-circle" size={18} color="#1769FF" style={{ marginRight: 10 }} /><Text style={styles.infoText}>FAQ: See our most common questions in the app or on our website.</Text></View>
          <View style={styles.infoRow}><Icon name="envelope" size={18} color="#1769FF" style={{ marginRight: 10 }} /><Text style={styles.infoText}>Contact: support@yourcompany.com</Text></View>
        </ModalView>
      )}

      {/* Logout */}
      <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.card, shadowColor: colors.text }]} onPress={handleLogout}>
        <Icon name="sign-out" size={20} color={colors.danger} style={{ marginRight: 10 }} />
        <Text style={[styles.logoutText, { color: colors.danger }]}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function MenuItem({ icon, label, onPress }: { icon: string, label: string, onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon name={icon} size={20} color={colors.accent} style={{ marginRight: 16 }} />
      <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ModalView({ onClose, title, children }: { onClose: () => void, title: string, children: React.ReactNode }) {
  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.overlay}>
          <TouchableWithoutFeedback>
            <View style={modalStyles.modalBox}>
              <Text style={modalStyles.title}>{title}</Text>
              {children}
              <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
                <Text style={modalStyles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    minWidth: 260,
    maxWidth: 320,
    elevation: 4,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1769FF',
    marginBottom: 14,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginTop: 18,
    backgroundColor: '#1769FF',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FC',
    paddingHorizontal: 0,
  },
  userInfoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    marginBottom: 18,
  },
  userPhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: '#888',
    marginBottom: 10,
  },
  editProfileBtn: {
    backgroundColor: '#1769FF',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 6,
  },
  editProfileText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 18,
    marginBottom: 18,
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1769FF',
    marginBottom: 8,
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuLabel: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    backgroundColor: '#fff',
    marginHorizontal: 18,
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  logoutText: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
}); 