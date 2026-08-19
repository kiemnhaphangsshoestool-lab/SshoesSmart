import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { getImports, getConfig } from '../../utils/storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import JsBarcode from 'jsbarcode';

const { width: screenWidth } = Dimensions.get('window');

const TemNhanTab = () => {
  const [imports, setImports] = useState([]);
  const [config, setConfig] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [viewMode, setViewMode] = useState('list'); // 'list', 'preview', 'settings'
  const [labelColsA4, setLabelColsA4] = useState(4);
  const [labelRowsA4, setLabelRowsA4] = useState(8);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const importsData = await getImports();
    const configData = await getConfig();
    setImports(importsData || []);
    setConfig(configData);
    setLabelColsA4(configData?.label_cols_a4 || 4);
    setLabelRowsA4(configData?.label_rows_a4 || 8);
  };

  // Flatten all variants from all imports for label generation
  const getAllVariants = () => {
    const variants = [];
    imports.forEach((imp) => {
      if (imp.variants && Array.isArray(imp.variants)) {
        imp.variants.forEach((variant) => {
          variants.push({
            ...variant,
            parentCode: imp.code,
            parentName: imp.name,
          });
        });
      }
    });
    return variants;
  };

  const variants = getAllVariants();

  const toggleSelection = (variantId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(variantId)) {
      newSelected.delete(variantId);
    } else {
      newSelected.add(variantId);
    }
    setSelectedItems(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedItems.size === variants.length && variants.length > 0) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(variants.map((v, i) => `${v.parentCode}-${i}`)));
    }
  };

  const getSelectedVariants = () => {
    return variants.filter((v, i) => selectedItems.has(`${v.parentCode}-${i}`));
  };

  // Generate label for printing
  const generateLabelHTML = () => {
    const selected = getSelectedVariants();
    const labelWidth = config?.label_width || 50;
    const labelHeight = config?.label_height || 35;
    const cols = labelColsA4;
    const rows = labelRowsA4;
    const pageHeight = 297; // A4 height in mm
    const pageWidth = 210; // A4 width in mm

    // Calculate margins to center labels on page
    const totalLabelWidth = labelWidth * cols;
    const totalLabelHeight = labelHeight * rows;
    const marginLeft = (pageWidth - totalLabelWidth) / 2;
    const marginTop = (pageHeight - totalLabelHeight) / 2;

    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SShoes Nhập - Tem Nhãn</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: ${marginTop}mm ${marginLeft}mm;
      font-family: Arial, sans-serif;
    }
    .page {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(${cols}, ${labelWidth}mm);
      grid-template-rows: repeat(${rows}, ${labelHeight}mm);
      gap: 0;
      page-break-after: always;
    }
    .label {
      width: ${labelWidth}mm;
      height: ${labelHeight}mm;
      border: 1px solid #000;
      padding: 2mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      position: relative;
    }
    .label-code {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 2px;
    }
    .label-color {
      font-size: 10px;
      text-align: center;
      height: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 1px;
    }
    .label-size {
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 2px;
    }
    .barcode-container {
      width: 95%;
      height: 16mm;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    svg {
      max-width: 100%;
      max-height: 100%;
    }
    @media print {
      body { padding: 0; }
      .page { gap: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
`;

    selected.forEach((variant) => {
      const barcode = variant.ida1 || `${variant.parentCode}-${variant.size}`;
      html += `
    <div class="label">
      <div class="label-code">${variant.parentCode}</div>
      <div class="label-color">${variant.color || ''}</div>
      <div class="label-size">${variant.size}</div>
      <div class="barcode-container">
        <svg id="barcode-${variant.parentCode}-${variant.size}-${variant.color}"></svg>
      </div>
    </div>
`;
    });

    html += `
  </div>
</body>
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
<script>
  window.addEventListener('load', function() {
`;

    selected.forEach((variant) => {
      const barcode = variant.ida1 || `${variant.parentCode}-${variant.size}`;
      html += `
    JsBarcode("#barcode-${variant.parentCode}-${variant.size}-${variant.color}", "${barcode}", {
      format: "CODE128",
      width: 1.5,
      height: 14,
      margin: 0,
      fontSize: 0
    });
`;
    });

    html += `
    window.print();
  });
</script>
</html>
`;

    return html;
  };

  const handlePrintPreview = () => {
    if (selectedItems.size === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất 1 tem để in');
      return;
    }
    setViewMode('preview');
  };

  const handleExportPNG = () => {
    if (selectedItems.size === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất 1 tem để xuất');
      return;
    }
    Alert.alert('Thông báo', 'Tính năng xuất PNG sẽ được cập nhật. Hiện tại vui lòng dùng in trực tiếp.');
  };

  if (viewMode === 'preview') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setViewMode('list')}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#0066cc" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Xem trước in tem</Text>
          <TouchableOpacity onPress={() => setViewMode('settings')}>
            <MaterialCommunityIcons name="cog" size={28} color="#0066cc" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.previewContainer}>
          <LabelPreview 
            variants={getSelectedVariants()} 
            config={config}
            cols={labelColsA4}
            rows={labelRowsA4}
          />
        </ScrollView>
        <TouchableOpacity 
          style={styles.printButton} 
          onPress={() => {
            Alert.alert('In tem', 'Bấm OK để tiếp tục in');
          }}
        >
          <MaterialCommunityIcons name="printer" size={24} color="#fff" />
          <Text style={styles.printButtonText}>In A4 ({labelColsA4}x{labelRowsA4})</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (viewMode === 'settings') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setViewMode('preview')}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#0066cc" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cấu hình grid in tem</Text>
        </View>
        <ScrollView style={styles.configContainer}>
          <View style={styles.configGroup}>
            <Text style={styles.configLabel}>Số cột khi in A4</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.configInput}
                keyboardType="number-pad"
                value={String(labelColsA4)}
                onChangeText={(val) => {
                  const num = parseInt(val) || 4;
                  setLabelColsA4(Math.min(Math.max(num, 1), 6));
                }}
              />
              <TouchableOpacity 
                style={styles.minusBtn}
                onPress={() => setLabelColsA4(Math.max(labelColsA4 - 1, 1))}
              >
                <Text style={styles.btnText}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.plusBtn}
                onPress={() => setLabelColsA4(Math.min(labelColsA4 + 1, 6))}
              >
                <Text style={styles.btnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.configGroup}>
            <Text style={styles.configLabel}>Số hàng khi in A4</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.configInput}
                keyboardType="number-pad"
                value={String(labelRowsA4)}
                onChangeText={(val) => {
                  const num = parseInt(val) || 8;
                  setLabelRowsA4(Math.min(Math.max(num, 1), 12));
                }}
              />
              <TouchableOpacity 
                style={styles.minusBtn}
                onPress={() => setLabelRowsA4(Math.max(labelRowsA4 - 1, 1))}
              >
                <Text style={styles.btnText}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.plusBtn}
                onPress={() => setLabelRowsA4(Math.min(labelRowsA4 + 1, 12))}
              >
                <Text style={styles.btnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.infoText}>
            Tổng: {labelColsA4 * labelRowsA4} tem/trang A4
          </Text>
        </ScrollView>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => {
            setViewMode('preview');
            Alert.alert('Đã lưu', `Grid: ${labelColsA4} cột × ${labelRowsA4} hàng`);
          }}
        >
          <Text style={styles.saveButtonText}>Lưu & Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main list view
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tem nhãn ({variants.length})</Text>
        <TouchableOpacity onPress={toggleAllSelection}>
          <MaterialCommunityIcons 
            name={selectedItems.size === variants.length && variants.length > 0 ? 'checkbox-marked' : 'checkbox-blank-outline'} 
            size={28} 
            color="#0066cc" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={[styles.actionBtn, { flex: 1, marginRight: 5 }]}
          onPress={handlePrintPreview}
        >
          <MaterialCommunityIcons name="printer" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>In ({selectedItems.size})</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, { flex: 1 }]}
          onPress={handleExportPNG}
        >
          <MaterialCommunityIcons name="image" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>PNG</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={variants}
        keyExtractor={(item, index) => `${item.parentCode}-${index}`}
        renderItem={({ item, index }) => {
          const isSelected = selectedItems.has(`${item.parentCode}-${index}`);
          return (
            <TouchableOpacity
              style={[styles.variantItem, isSelected && styles.variantItemSelected]}
              onPress={() => toggleSelection(`${item.parentCode}-${index}`)}
            >
              <MaterialCommunityIcons 
                name={isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'} 
                size={24} 
                color={isSelected ? '#0066cc' : '#ccc'}
              />
              <View style={styles.variantInfo}>
                <Text style={styles.variantCode}>{item.parentCode}</Text>
                <Text style={styles.variantDetail}>{item.color} - Size {item.size}</Text>
                {item.isNew && <View style={styles.newBadge}><Text style={styles.newBadgeText}>MỚI</Text></View>}
              </View>
              <Text style={styles.variantIDA1}>{item.ida1 || '—'}</Text>
            </TouchableOpacity>
          );
        }}
        scrollEnabled={true}
      />
    </View>
  );
};

const LabelPreview = ({ variants, config, cols, rows }) => {
  const labelWidth = config?.label_width || 50;
  const labelHeight = config?.label_height || 35;
  const itemWidth = screenWidth / cols - 2;
  const itemHeight = (itemWidth / labelWidth) * labelHeight;

  return (
    <View>
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 5,
        backgroundColor: '#f5f5f5',
      }}>
        {variants.map((variant, idx) => (
          <View
            key={idx}
            style={{
              width: itemWidth,
              height: itemHeight,
              margin: 1,
              borderWidth: 1,
              borderColor: '#333',
              padding: 3,
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{variant.parentCode}</Text>
            <Text style={{ fontSize: 8, textAlign: 'center' }}>{variant.color || ''}</Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{variant.size}</Text>
            <View style={{ width: '90%', height: '25%', borderWidth: 1, borderColor: '#000' }}>
              <Text style={{ fontSize: 6, textAlign: 'center' }}>|||||||</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionBtn: {
    flexDirection: 'row',
    backgroundColor: '#0066cc',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 13,
    fontWeight: 'bold',
  },
  variantItem: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  variantItemSelected: {
    backgroundColor: '#e6f0ff',
  },
  variantInfo: {
    flex: 1,
    marginLeft: 10,
  },
  variantCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  variantDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  variantIDA1: {
    fontSize: 11,
    color: '#999',
    marginLeft: 10,
  },
  newBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginTop: 3,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  printButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  printButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  configContainer: {
    flex: 1,
    padding: 15,
  },
  configGroup: {
    marginBottom: 20,
  },
  configLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  configInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  minusBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#ff6b6b',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#28a745',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TemNhanTab;
