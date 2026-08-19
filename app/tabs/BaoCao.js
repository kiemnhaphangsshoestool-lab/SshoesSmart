import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const BaoCaoTab = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Báo cáo</Text>
      </View>
      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.reportItem}>
          <MaterialCommunityIcons name="file-excel" size={28} color="#0066cc" />
          <View style={styles.reportInfo}>
            <Text style={styles.reportTitle}>Báo cáo tổng hợp</Text>
            <Text style={styles.reportDesc}>Tất cả sản phẩm đã nhập</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportItem}>
          <MaterialCommunityIcons name="file-excel" size={28} color="#0066cc" />
          <View style={styles.reportInfo}>
            <Text style={styles.reportTitle}>Mã con mới</Text>
            <Text style={styles.reportDesc}>Chỉ các IDA1 chưa tồn tại</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportItem}>
          <MaterialCommunityIcons name="file-excel" size={28} color="#0066cc" />
          <View style={styles.reportInfo}>
            <Text style={styles.reportTitle}>Table1 (53 cột)</Text>
            <Text style={styles.reportDesc}>Format gốc từ LabelPrinter.cs</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 10 },
  reportItem: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 8, borderWidth: 1, borderColor: '#f0f0f0' },
  reportInfo: { flex: 1, marginLeft: 12 },
  reportTitle: { fontSize: 14, fontWeight: 'bold' },
  reportDesc: { fontSize: 12, color: '#666', marginTop: 2 },
});

export default BaoCaoTab;
