/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useContext } from 'react';
import { View, Alert,StatusBar,Platform,SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/appNavigator';
import { ColorContext} from './src/components/colorTheme/colorTheme';

const App = () => {
  const { colors } = useContext(ColorContext);


  return (
      <View style={{
        flex:1,
        height: 20, // You can use a library like `react-native-status-bar-height` to handle dynamic heights
        backgroundColor:colors.color2 }}>
        <StatusBar translucent={false}    barStyle="light-content"  backgroundColor={colors.color2}/>
        <AppNavigator  />
      </View>
  );

}

export default App;

