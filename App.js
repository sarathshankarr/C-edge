/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useContext, useEffect} from 'react';
import {View, Alert, StatusBar, Platform} from 'react-native';
import AppNavigator from './src/navigation/appNavigator';
import {ColorContext} from './src/components/colorTheme/colorTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from './src/pages/splash/splash';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const {colors} = useContext(ColorContext);

  if (!colors) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.color2}}>
        <StatusBar
          translucent={false}
          barStyle="light-content"
          backgroundColor={colors.color2}
        />
        <AppNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
