import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Alert, Modal, TextInput } from 'react-native';
import { getSuppliers, saveSuppliers } from '../../utils/storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const NhaCungCapTab = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSupplier, setNewSupplier] = useState('');

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    const data = await getSuppliers();
    setSuppliers(data || []);
  };

  const handleAddSupplier = async () => {
    if (!newSupplier.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên NCC');
      return;
    }
    const updated = [...suppliers, { name: newSupplier, id: Date.now() }];
    await saveSuppliers(updated);
    setSuppliers(updated);
    setNewSupplier('');
    setModalVisible(false);
  };

  const handleDeleteSupplier = async (id) => {
    const updated = suppliers.filter(s => s.id !== id);
    await saveSuppliers(updated);
    setSuppliers(updated);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nhà cung cấp ({suppliers.length})</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="plus" size={28} color="#0066cc" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={suppliers}
        scrollEnabled={suppliers.length > 5}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.supplierItem}>
            <Text style={styles.supplierName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteSupplier(item.id)}>
              <MaterialCommunityIcons name="delete" size={20} color="#ff6b6b" />
            </TouchableOpacity>
          </View>
        )}
      />
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm NCC mới</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Tên NCC"
              value={newSupplier}
              onChangeText={setNewSupplier}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOK} onPress={handleAddSupplier}>
                <Text style={styles.btnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  supplierItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  supplierName: { fontSize: 14, color: '#333' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 8, padding: 20, width: '80%' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16 },
  modalButtons: { flexDirection: 'row', gap: 10 },
  btnCancel: { flex: 1, backgroundColor: '#ccc', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  btnOK: { flex: 1, backgroundColor: '#0066cc', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});

export default NhaCungCapTab;
