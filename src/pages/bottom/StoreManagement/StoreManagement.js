import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ColorContext } from '../../../components/colorTheme/colorTheme';

const StoreManagement = ({ navigation }) => {

  const { colors ,subMenuItemsIds} = useContext(ColorContext);
  
  const styles = getStyles(colors);


  const inwardProcess = [
    { id: 97, name: 'Stock Request ', component: 'StockRequestList', image: require('../../../../assets/images/png/stockRequest.png') },
    { id: 98, name: 'Stock Approval', component: 'StoreApproveListComponent', image: require('../../../../assets/images/png/stockApproval.png') },
    { id: 99, name: 'Stock Receive ', component: 'StockRecieveList', image: require('../../../../assets/images/png/stockRecieve.png') },
  ];

  const filteredinwardProcess = inwardProcess.filter((menu) => 
    subMenuItemsIds.includes(menu.id)
);

  const handleDemoClick = (component) => {
    navigation.navigate(component);
  };

  return (
    <ScrollView
    style={styles.scrollContainer}
    contentContainerStyle={styles.scrollContent}>
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Store Management </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconsContainer}>
          {filteredinwardProcess.map((item) => (
            <TouchableOpacity key={item.id} style={styles.iconItem} onPress={() => handleDemoClick(item.component)}>
              <View style={styles.navIconContainer}>
              <Image source={item.image} style={styles.icon} />
              </View>
              <Text style={styles.iconText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* <View style={styles.section}>
        <Text style={styles.heading}>Design</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconsContainer}>
          {outwardProcess.map((item) => (
            <TouchableOpacity key={item.id} style={styles.iconItem} onPress={() => handleDemoClick(item.component)}>
              <Image source={item.image} style={styles.icon} />
              <Text style={styles.iconText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View> */}
    </View>
    </ScrollView>
  );
};

const getStyles = (colors) => StyleSheet.create({

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
    elevation:5,
    // borderColor:'black',
    shadowColor: '#000', // Shadow color for iOS
  shadowOffset: { width: 0, height: 2 }, // Offset for the shadow
  shadowOpacity: 0.25, // Opacity of the shadow
  shadowRadius: 3.84, // Radius for the shadow blur
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333', // Dark grey heading text color
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconItem: {
    marginRight: 20,
    alignItems: 'center',
    width:80,
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
    tintColor: colors.color2,
  },
  iconText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContainer: {flex: 1},
  scrollContent: {paddingBottom:20},

});

export default StoreManagement;

