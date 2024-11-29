/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, Alert,StatusBar,Platform,SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/appNavigator';
import color from './src/utils/commonStyles/color';

const App = () => {


  return (
      <View style={{flex:1}}>
        <StatusBar translucent={false}  backgroundColor={color.color2}/>
        <AppNavigator  />
      </View>
  );

}

export default App;

