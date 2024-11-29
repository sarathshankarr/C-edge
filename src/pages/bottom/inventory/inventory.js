import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import color from '../../../utils/commonStyles/color';

const Inventory = ({ navigation }) => {

  const inwardProcess = [
    { id: 1, name: 'Location Wise Style Inventory', component: 'StyleLocationInventory', image: require('../../../../assets/images/png/location.png') },
  ];
  const outwardProcess = [
    { id: 1, name: 'Location wise RM/Fabric Inventory', component: 'LocationWiseRMFabInv', image: require('../../../../assets/images/png/locationicon.png') },
    { id: 2, name: 'Style Wise RM/Fabric Inventory', component: 'LocationStyleWiseInventory', image: require('../../../../assets/images/png/locationicon.png') },
  ];
  
  const handleDemoClick = (component) => {
    navigation.navigate(component);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Style Inventory</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconsContainer}>
          {inwardProcess.map((item) => (
            <TouchableOpacity key={item.id} style={styles.iconItem} onPress={() => handleDemoClick(item.component)}>
              <Image source={item.image} style={styles.icon} />
              <Text style={styles.iconText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>RM/Fabric Inventory</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconsContainer}>
          {outwardProcess.map((item) => (
            <TouchableOpacity key={item.id} style={styles.iconItem} onPress={() => handleDemoClick(item.component)}>
              <Image source={item.image} style={styles.icon} />
              <Text style={styles.iconText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0', // Light grey background
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white', // Light grey background
    borderRadius:9,
    padding: 10,
    elevation:3,
    // borderColor:'black',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Dark grey heading text color
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconItem: {
    marginRight: 20,
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 10, 
    tintColor:color.color2,
  },
  iconText: {
    textAlign: 'center',
    color: '#555', 
    width:120,
  },
});

export default Inventory;



