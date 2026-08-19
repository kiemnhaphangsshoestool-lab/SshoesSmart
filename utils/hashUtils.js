import CryptoJS from 'crypto-js';

/**
 * Slugify product name for ProductKey
 * Remove diacritics, lowercase, replace spaces/special chars with underscore
 */
export const slugify = (text) => {
  if (!text) return '';
  const map = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'đ': 'd',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  };

  return text
    .toLowerCase()
    .split('')
    .map(c => map[c] || c)
    .join('')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

/**
 * Calculate HAS (Master Hash)
 * HAS = MD5(UPPER(ProductKey|Size|Color))
 * ProductKey = slugify(name)_Code
 */
export const calculateHAS = (name, code, size, color) => {
  const productKey = `${slugify(name)}_${code}`;
  const input = `${productKey}|${size}|${color}`.toUpperCase();
  return CryptoJS.MD5(input).toString().toUpperCase();
};

/**
 * Calculate HAS1 or HAS2 based on IDA1 and threshold
 * If Code < threshold (default 6720): MD5(UPPER(IDA1+Size+Color)) — no separator
 * If Code >= threshold: MD5(UPPER(IDA1|Size|Color)) — with separator
 */
export const calculateIDA1Hash = (ida1, size, color, threshold = 6720) => {
  const codeNum = parseInt(ida1.split('-')[0]) || 0;
  let input;

  if (codeNum < threshold) {
    // No separator for Code < threshold
    input = `${ida1}${size}${color}`.toUpperCase();
  } else {
    // With separator for Code >= threshold
    input = `${ida1}|${size}|${color}`.toUpperCase();
  }

  return CryptoJS.MD5(input).toString().toUpperCase();
};

/**
 * Verify hash against input data
 */
export const verifyHash = (hash, name, code, size, color) => {
  const calculated = calculateHAS(name, code, size, color);
  return hash.toUpperCase() === calculated;
};

/**
 * Check if color is dominant "pink/hot" for girl classification
 */
export const isHotColor = (color) => {
  const normalized = (color || '').toLowerCase();
  return (
    normalized.includes('hong') ||
    normalized.includes('hồng') ||
    normalized.includes('đỏ') ||
    normalized.includes('đỏ sáng')
  );
};

/**
 * Classify GRO1 based on name and color
 * Girl keywords: no, hoa, meo, kitty, tim, cong chua, bup be
 * Girl: dominant color pink
 */
export const classifyGRO1 = (name, color, sizeNum) => {
  const normalized = (name || '').toLowerCase();
  const tokens = normalized.split(/\s+/);

  const isGirl =
    tokens.some(t => ['no', 'hoa', 'meo', 'kitty', 'tim'].includes(t)) ||
    normalized.includes('cong chua') ||
    normalized.includes('bup be') ||
    isHotColor(color);

  const gioiTinh = isGirl ? 'Bé gái' : 'Bé trai';

  let sizeTier = 'trung'; // default
  if (sizeNum <= 25) {
    sizeTier = 'nhí';
  } else if (sizeNum <= 30) {
    sizeTier = 'trung';
  } else {
    sizeTier = 'đại';
  }

  return `${gioiTinh} >> ${sizeTier}`;
};
