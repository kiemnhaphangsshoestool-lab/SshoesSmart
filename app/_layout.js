import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Import all tabs
import ToongQuanTab from './tabs/ToongQuan';
import NhapKhoTab from './tabs/NhapKho';
import KhoHangTab from './tabs/KhoHang';
import NhaCungCapTab from './tabs/NhaCungCap';
import BaoCaoTab from './tabs/BaoCao';
import TemNhanTab from './tabs/TemNhan';
import CauHinhTab from './tabs/CauHinh';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="ToongQuan"
      activeColor="#0066cc"
      inactiveColor="#999"
      barStyle={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' }}
      labeled={true}
    >
      <Tab.Screen
        name="ToongQuan"
        component={ToongQuanTab}
        options={{
          tabBarLabel: 'Tổng quan',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="NhapKho"
        component={NhapKhoTab}
        options={{
          tabBarLabel: 'Nhập kho',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus-circle" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="KhoHang"
        component={KhoHangTab}
        options={{
          tabBarLabel: 'Kho hàng',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="package-multiple" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="NhaCungCap"
        component={NhaCungCapTab}
        options={{
          tabBarLabel: 'NCC',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="truck" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BaoCao"
        component={BaoCaoTab}
        options={{
          tabBarLabel: 'Báo cáo',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="file-chart" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TemNhan"
        component={TemNhanTab}
        options={{
          tabBarLabel: 'Tem nhãn',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="tag-multiple" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CauHinh"
        component={CauHinhTab}
        options={{
          tabBarLabel: 'Cấu hình',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
