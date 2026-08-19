# SShoes Nhập - Shoe Wholesale Import Management App

An Expo/React Native app for managing shoe wholesale imports with barcode scanning, OCR invoice processing, and label printing.

## Features

- **7 Tabs**: Overview, Import, Inventory, Suppliers, Reports, Labels, Settings
- **MasterHas System**: MD5-based product identification (100% C# compatible)
- **OCR Invoice Scanning**: Google Vision + Claude API auto-fill
- **Barcode/QR Support**: Inventory search with audio/vibration feedback
- **Excel Export**: 3 formats (summary, new items, 53-column table1)
- **Label Printing**: 50×35mm tem with Code128 barcodes (4×8 grid per A4)
- **Local Storage**: AsyncStorage for data persistence

## Setup (Termux on Android)

```bash
cd ~/sshoes-nhap-expo
npm install
npx expo install --fix
npx expo-doctor
git add . && git commit -m "..." && git push
# Build via expo.dev dashboard (Android, preview profile)
```

## Tech Stack

- Expo SDK 52
- React Native
- AsyncStorage
- Crypto-JS (MD5 hashing)
- XLSX (Excel export)
- JsBarcode (Code128)

## Key Files

- `utils/hashUtils.js` - MasterHas system (critical - exact C# match)
- `utils/storage.js` - AsyncStorage wrapper + config defaults
- `app/_layout.js` - Main navigation & tab setup
- `app/tabs/TemNhan.js` - Fixed 4×8 label grid for A4

## Config

Edit **Cấu hình** tab to adjust:
- Label dimensions (mm)
- Grid layout for printing (cols × rows)
- Hash thresholds
- OCR API keys
- Voice settings

## Status

✅ Core features complete  
⏳ Waiting: Test Code128 barcodes with real scanner before production
