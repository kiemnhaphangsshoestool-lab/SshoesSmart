import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { getImports, saveImports } from '../../utils/storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ToongQuanTab = () => {
  const [imports, setImports] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getImports();
    setImports(data || []);
  };

  const handleDeleteImport = (index) => {
    Alert.alert(
      'Xoá phiếu nhập',
      'Bạn chắc chắn muốn xoá?',
      [
        { text: 'Huỷ', onPress: () => {} },
        {
          text: 'Xoá',
          onPress: async () => {
            const newImports = imports.filter((_, i) => i !== index);
            await saveImports(newImports);
            setImports(newImports);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tổng quan ({imports.length})</Text>
      </View>

      <ScrollView>
        {imports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="package-variant" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Chưa có phiếu nhập nào</Text>
          </View>
        ) : (
          <FlatList
            data={imports}
            scrollEnabled={false}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => {
              const variantCount = (item.variants || []).length;
              return (
                <View style={styles.importCard}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardMeta}>{item.code} • {item.supplier || 'N/A'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteImport(index)}>
                      <MaterialCommunityIcons name="delete" size={22} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cardDetails}>
                    <Text style={styles.detail}>📦 {variantCount} mã con</Text>
                    <Text style={styles.detail}>📅 {item.date || 'N/A'}</Text>
                  </View>
                  {item.variants && item.variants.length > 0 && (
                    <View style={styles.variantPreview}>
                      {item.variants.slice(0, 3).map((v, i) => (
                        <Text key={i} style={styles.variantTag}>
                          {v.color} #{v.size}
                        </Text>
                      ))}
                      {variantCount > 3 && <Text style={styles.variantTag}>+{variantCount - 3}</Text>}
                    </View>
                  )}
                </View>
              );
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 },
  emptyText: { color: '#999', marginTop: 10 },
  importCard: { margin: 10, padding: 12, backgroundColor: '#f9f9f9', borderRadius: 8, borderWidth: 1, borderColor: '#f0f0f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: 'bold' },
  cardMeta: { fontSize: 12, color: '#666', marginTop: 2 },
  cardDetails: { flexDirection: 'row', gap: 15, marginBottom: 8 },
  detail: { fontSize: 12, color: '#666' },
  variantPreview: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  variantTag: { backgroundColor: '#e6f0ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 11 },
});

export default ToongQuanTab;
