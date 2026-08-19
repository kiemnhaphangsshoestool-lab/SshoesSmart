import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Switch } from 'react-native';
import { getConfig, saveConfig } from '../../utils/storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const CauHinhTab = () => {
  const [config, setConfig] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const data = await getConfig();
    setConfig(data);
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await saveConfig(config);
    setHasChanges(false);
    Alert.alert('Thành công', 'Đã lưu cấu hình');
  };

  if (!config) return <View style={styles.loading}><Text>Đang tải...</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cấu hình</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tem nhãn</Text>
          <ConfigInput label="Rộng (mm)" value={String(config.label_width)} onChangeText={(v) => updateConfig('label_width', parseInt(v) || 50)} />
          <ConfigInput label="Cao (mm)" value={String(config.label_height)} onChangeText={(v) => updateConfig('label_height', parseInt(v) || 35)} />
          <ConfigInput label="Khổ giấy" value={config.label_page_format} onChangeText={(v) => updateConfig('label_page_format', v)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hash / IDA1</Text>
          <ConfigInput label="Ngưỡng IDA1" value={String(config.ida1_threshold)} onChangeText={(v) => updateConfig('ida1_threshold', parseInt(v) || 6720)} />
          <ConfigInput label="Ngưỡng HAS" value={String(config.has_threshold)} onChangeText={(v) => updateConfig('has_threshold', parseInt(v) || 6720)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giọng nói</Text>
          <View style={styles.configRow}>
            <Text style={styles.label}>Bật giọng nói</Text>
            <Switch
              value={config.voice_enabled}
              onValueChange={(v) => updateConfig('voice_enabled', v)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dữ liệu</Text>
          <TouchableOpacity 
            style={styles.dangerBtn}
            onPress={() => {
              Alert.alert('Xoá mẫu?', 'Xoá toàn bộ dữ liệu mẫu?', [
                { text: 'Huỷ' },
                { text: 'Xoá', onPress: () => Alert.alert('OK', 'Feature chưa triển khai') }
              ]);
            }}
          >
            <MaterialCommunityIcons name="delete" size={20} color="#fff" />
            <Text style={styles.dangerBtnText}>Xoá dữ liệu mẫu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {hasChanges && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu cấu hình</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ConfigInput = ({ label, value, onChangeText }) => (
  <View style={styles.configRow}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType="numeric"
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 15 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 12, color: '#0066cc' },
  configRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  label: { fontSize: 13, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 6, width: 100, textAlign: 'right' },
  saveButton: { backgroundColor: '#28a745', paddingVertical: 12, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  dangerBtn: { flexDirection: 'row', backgroundColor: '#ff6b6b', paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  dangerBtnText: { color: '#fff', marginLeft: 8, fontWeight: 'bold' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default CauHinhTab;
