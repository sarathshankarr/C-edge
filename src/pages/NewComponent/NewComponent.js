import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, View, Text, StyleSheet } from 'react-native';
import Dashboard from '../bottom/Dashboard/Dashboard';
import OrderManagement from '../bottom/Order management/OrderManagement';
import Production from '../bottom/Production/Production';
import StyleManagement from '../bottom/styleManagement/styleManagement';
import Inventory from '../bottom/inventory/inventory';
import CommonHeader from '../../utils/commonComponents/CommonHeader';
import StoreManagement from '../bottom/StoreManagement/StoreManagement';
import color from '../../utils/commonStyles/color';

const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const itemsArray = [
  { id: 1, name: 'Dashboard', component: Dashboard, img: require('./../../../assets/images/png/dashboard11.png') },
  // { id: 2, name: 'Order Management', component: OrderManagement, img: require('./../../../assets/images/png/orderrr.png') },
  // { id: 3, name: 'Style Management', component: StyleManagement, img: require('./../../../assets/images/png/shirt.png') },
  { id: 4, name: 'Production', component: Production, img: require('./../../../assets/images/png/production.png') },
  { id: 5, name: 'Inventory', component: Inventory, img: require('./../../../assets/images/png/inventoryy.png') },
  { id: 6, name: 'Store Management', component: StoreManagement, img: require('./../../../assets/images/png/store.png') },
];

const TabNavigator = () => (
  <BottomTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => (
        <View style={[styles.tabIconContainer, focused && styles.selectedTab]}>
          <Image
            source={itemsArray.find(item => item.name === route.name)?.img}
            style={{
              width: focused ? 35 : 30,
              height: focused ? 35 : 30,
              // tintColor: '#1F74BA',
              tintColor: color.color2,
            }}
          />
        </View>
      ),
      tabBarLabel: ({ focused }) => (
        <Text style={[styles.tabLabel, focused && styles.selectedTabLabel]}>
          {route.name}
        </Text>
      ),
      tabBarStyle: {
        backgroundColor: '#ffffff',
        height: '10%',
      },
    })}
  >
    {itemsArray.map(item => (
      <BottomTab.Screen
        key={item.name}
        name={item.name}
        component={item.component}
        options={{
          headerShown: false,
        }}
      />
    ))}
  </BottomTab.Navigator>
);

const NewComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ header: () => <CommonHeader title="My App" showDrawerButton={true} /> }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  selectedTab: {
    borderTopWidth: 4,
    // borderTopColor: '#5177c0',
    borderTopColor: color.color2,
    width: '65%',
  },
  tabLabel: {
    fontSize: 9,
    textAlign: 'center',
    flexWrap: 'wrap',
    width: 60,
    color: '#000',

  },
  selectedTabLabel: {
    color: color.color2,
    fontWeight: 'bold',
  },
});

export default NewComponent;
