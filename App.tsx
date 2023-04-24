import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import AppNavigator from './src/navigation/Navigation';
import React from 'react';

export default function App() {
  const theme = {
    ...DefaultTheme,
  };
  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
}
