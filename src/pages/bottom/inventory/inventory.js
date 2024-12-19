import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import color from '../../../utils/commonStyles/color';

const Inventory = ({ navigation }) => {

  const inwardProcess = [
    { id: 1, name: 'Location Wise Style Inventory', component: 'StyleLocationInventory', image: require('../../../../assets/images/png/tracking.png') },
  ];
  const outwardProcess = [
    { id: 1, name: 'Location wise RM/Fabric Inventory', component: 'LocationWiseRMFabInv', image: require('../../../../assets/images/png/consignment.png') },
    { id: 2, name: 'Style Wise RM/Fabric Inventory', component: 'LocationStyleWiseInventory', image: require('../../../../assets/images/png/inventory.png') },
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
              <View style={styles.navIconContainer}>
              <Image source={item.image} style={styles.icon} />
              </View>
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
              <View style={styles.navIconContainer}>
              <Image source={item.image} style={styles.icon} />
              </View>
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
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Offset for the shadow
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.84, // Radius for the shadow blur
    // borderColor:'black',
  },
  heading: {
    fontSize: 16,
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
    width:100,
  },
  navIconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 30,
    marginBottom: 10,
  },
  icon: {
    width: 27,
    height: 27,
    resizeMode: 'contain',
    tintColor: color.color2,
  },
  iconText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Inventory;



