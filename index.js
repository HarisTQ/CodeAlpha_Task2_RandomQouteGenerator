import { registerRootComponent } from 'expo';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from './App';

// Wrap the App component in SafeAreaProvider
const Root = () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
);

registerRootComponent(Root);


