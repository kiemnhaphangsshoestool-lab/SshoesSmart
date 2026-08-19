import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  IMPORTS: 'imports_data',
  SUPPLIERS: 'suppliers_data',
  CONFIG: 'config_data',
  MANUAL_MAPPING: 'manual_mapping',
  IDA1_COUNTER: 'ida1_counter',
};

/**
 * Get all imports
 */
export const getImports = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.IMPORTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading imports:', error);
    return [];
  }
};

/**
 * Save imports
 */
export const saveImports = async (imports) => {
  try {
    await AsyncStorage.setItem(KEYS.IMPORTS, JSON.stringify(imports));
    return true;
  } catch (error) {
    console.error('Error saving imports:', error);
    return false;
  }
};

/**
 * Get all suppliers
 */
export const getSuppliers = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SUPPLIERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading suppliers:', error);
    return [];
  }
};

/**
 * Save suppliers
 */
export const saveSuppliers = async (suppliers) => {
  try {
    await AsyncStorage.setItem(KEYS.SUPPLIERS, JSON.stringify(suppliers));
    return true;
  } catch (error) {
    console.error('Error saving suppliers:', error);
    return false;
  }
};

/**
 * Get config
 */
export const getConfig = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CONFIG);
    return data ? JSON.parse(data) : getDefaultConfig();
  } catch (error) {
    console.error('Error reading config:', error);
    return getDefaultConfig();
  }
};

/**
 * Save config
 */
export const saveConfig = async (config) => {
  try {
    await AsyncStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
};

/**
 * Get manual IDA1 mapping
 */
export const getManualMapping = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.MANUAL_MAPPING);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading manual mapping:', error);
    return {};
  }
};

/**
 * Save manual IDA1 mapping
 */
export const saveManualMapping = async (mapping) => {
  try {
    await AsyncStorage.setItem(KEYS.MANUAL_MAPPING, JSON.stringify(mapping));
    return true;
  } catch (error) {
    console.error('Error saving manual mapping:', error);
    return false;
  }
};

/**
 * Get IDA1 counter for sequential assignment
 */
export const getIDA1Counter = async (code) => {
  try {
    const data = await AsyncStorage.getItem(KEYS.IDA1_COUNTER);
    const counters = data ? JSON.parse(data) : {};
    return counters[code] || 1;
  } catch (error) {
    console.error('Error reading IDA1 counter:', error);
    return 1;
  }
};

/**
 * Increment and save IDA1 counter
 */
export const incrementIDA1Counter = async (code) => {
  try {
    const data = await AsyncStorage.getItem(KEYS.IDA1_COUNTER);
    const counters = data ? JSON.parse(data) : {};
    const nextNum = (counters[code] || 0) + 1;
    counters[code] = nextNum;
    await AsyncStorage.setItem(KEYS.IDA1_COUNTER, JSON.stringify(counters));
    return nextNum;
  } catch (error) {
    console.error('Error incrementing IDA1 counter:', error);
    return 1;
  }
};

/**
 * Clear all data
 */
export const clearAllData = async (includeSampleData = false) => {
  try {
    const keysToDelete = includeSampleData 
      ? Object.values(KEYS)
      : [KEYS.IMPORTS, KEYS.SUPPLIERS, KEYS.MANUAL_MAPPING];
    
    await AsyncStorage.multiRemove(keysToDelete);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

/**
 * Default config structure
 */
export const getDefaultConfig = () => ({
  // Hash thresholds
  ida1_threshold: 6720,
  has_threshold: 6720,

  // Label dimensions (mm)
  label_width: 50,
  label_height: 35,
  label_page_format: 'A4', // A4, A5, A6

  // Grid layout for printing
  label_cols_a4: 4,
  label_rows_a4: 8,
  label_cols_png: 4,

  // OCR settings
  ocr_api_key: '',
  ocr_api_name: '', // 'google' or 'claude'

  // Barcode settings
  barcode_format: 'CODE128',
  barcode_show_text: true,

  // Voice settings
  voice_enabled: true,
  voice_language: 'vi-VN',
  voice_pitch: 1.0,
  voice_rate: 0.8,

  // Size tiers (for GRO1 classification)
  size_tier_nhi_max: 25,
  size_tier_trung_max: 30,

  // Girl classification keywords (comma-separated)
  girl_keywords: 'no,hoa,meo,kitty,tim,cong chua,bup be',
});
