import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const KhoHangTab = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kho hàng</Text>
      </View>
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm tên / mã"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity>
          <MaterialCommunityIcons name="barcode-scan" size={20} color="#0066cc" />
        </TouchableOpacity>
      </View>
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="package-variant-closed" size={48} color="#ccc" />
        <Text style={styles.emptyText}>Chưa có hàng trong kho</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#f5f5f5', marginHorizontal: 10, marginVertical: 10, borderRadius: 6 },
  searchInput: { flex: 1, marginHorizontal: 8, paddingVertical: 4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#999', marginTop: 10 },
});

export default KhoHangTab;
