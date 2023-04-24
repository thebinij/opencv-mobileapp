import {Provider as PaperProvider} from 'react-native-paper';
import AppNavigator from './src/navigation/Navigation';
import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen'


export default function App() {

  useEffect(()=>{
    SplashScreen.hide();
  },[])

  return (
    <PaperProvider >
      <AppNavigator />
    </PaperProvider>
  );
}
