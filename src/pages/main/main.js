
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import NewComponent from '../NewComponent/NewComponent';
import { SafeAreaView } from 'react-native';

const Drawer = createDrawerNavigator();
const Main = () => {
  return (
    <SafeAreaView style={{flex:1}}>

      <Drawer.Navigator drawerContent={props => <Sidebar {...props} />}>
        <Drawer.Screen
          name="NewComponent"
          component={NewComponent}
          options={{ headerShown: false }}
          />
      </Drawer.Navigator>
          </SafeAreaView>
  );
};

export default Main;
