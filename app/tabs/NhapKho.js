import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const NhapKhoTab = () => {
  const [activeTab, setActiveTab] = useState('manual');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nhập kho</Text>
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'ocr' && styles.tabActive]}
          onPress={() => setActiveTab('ocr')}
        >
          <MaterialCommunityIcons name="camera" size={20} color={activeTab === 'ocr' ? '#0066cc' : '#999'} />
          <Text style={[styles.tabText, activeTab === 'ocr' && styles.tabTextActive]}>OCR</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'manual' && styles.tabActive]}
          onPress={() => setActiveTab('manual')}
        >
          <MaterialCommunityIcons name="pencil" size={20} color={activeTab === 'manual' ? '#0066cc' : '#999'} />
          <Text style={[styles.tabText, activeTab === 'manual' && styles.tabTextActive]}>Nhập tay</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.placeholder}>
          <MaterialCommunityIcons name="plus-circle-outline" size={48} color="#ccc" />
          <Text style={styles.placeholderText}>Nhập sản phẩm mới</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#0066cc' },
  tabText: { color: '#999', marginLeft: 5 },
  tabTextActive: { color: '#0066cc', fontWeight: 'bold' },
  content: { flex: 1 },
  placeholder: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  placeholderText: { color: '#999', marginTop: 10 },
});

export default NhapKhoTab;
