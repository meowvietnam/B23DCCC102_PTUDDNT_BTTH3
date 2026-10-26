import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppDataProvider } from './src/context/AppDataContext';
import { SyncProvider } from './src/context/SyncContext';
import AppNavigator from './src/navigation/AppNavigator';
import colors from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <AppDataProvider>
        <SyncWrapper />
      </AppDataProvider>
    </SafeAreaProvider>
  );
}

function SyncWrapper() {
  return (
    <SyncProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SyncProvider>
  );
}
