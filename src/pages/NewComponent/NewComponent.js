import React, { useContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Dashboard from '../bottom/Dashboard/Dashboard';
import Production from '../bottom/Production/Production';
import Inventory from '../bottom/inventory/inventory';
import CommonHeader from '../../utils/commonComponents/CommonHeader';
import StoreManagement from '../bottom/StoreManagement/StoreManagement';
import { ColorContext } from '../../components/colorTheme/colorTheme';


const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const itemsArray = [
  { menu_id1: 2, menu_id2: 46, name: 'Production', component: Production, img: require('./../../../assets/images/png/production.png') },
  { menu_id1: 91, menu_id2: 91, name: 'Inventory', component: Inventory, img: require('./../../../assets/images/png/shipping.png') },
  { menu_id1: 96, menu_id2: 96, name: 'Store Management', component: StoreManagement, img: require('./../../../assets/images/png/store.png') },
  { menu_id1: 9999, menu_id2: 9999, name: 'Dashboard', component: Dashboard, img: require('./../../../assets/images/png/dashboard11.png') },
];



const TabNavigator = () => {
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const { colors , menuIds} = useContext(ColorContext);
  const styles = getStyles(colors);

  const filteredMenus = itemsArray.filter((menu) => 
    menu.name === "Dashboard" || 
    menuIds.includes(menu.menu_id1) || 
    menuIds.includes(menu.menu_id2)
);


  // console.log("filtered menus asdf==> ", filteredMenus)
  

  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <View style={[styles.tabIconContainer,{height: landscape ? '120%': '100%'}, focused && styles.selectedTab]}>
            <Image
              source={filteredMenus.find(item => item.name === route.name)?.img}
              style={{
                width: focused ? 35 : 25,
                height: focused ? 35 : 25,
                tintColor: focused ? colors.color4 : colors.color2 ,
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
          height: landscape ? 70 : '10%',
          paddingBottom: landscape ? 10 : 0,
        },
        tabBarItemStyle: {
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: landscape ? 10 : 0,
        },
      })}
    >
      {filteredMenus.map(item => (
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
};

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

const getStyles = (colors) => StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTab: {
    borderTopWidth: 4,
    borderTopColor: colors.color2,
    width: '65%',
  },
  tabLabel: {
    fontSize: 9,
    textAlign: 'center',
    flexWrap: 'wrap',
    color: '#000',
  },
  selectedTabLabel: {
    color: colors.color2,
    fontWeight: 'bold',
  },
});

export default NewComponent;

