import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import color from '../../../utils/commonStyles/color';

const StoreManagement = ({ navigation }) => {

  const inwardProcess = [
    { id: 1, name: 'Stock Request ', component: 'StockRequestList', image: require('../../../../assets/images/png/stockRequest.png') },
    { id: 2, name: 'Stock Approval', component: 'StoreApproveListComponent', image: require('../../../../assets/images/png/stockApproval.png') },
    { id: 3, name: 'Stock Recieve ', component: 'StockRecieveList', image: require('../../../../assets/images/png/stockRecieve.png') },
  ];

//   const outwardProcess = [
//     { id: 1, name: 'Design Directory Approval', component: 'DDAList', image: require('../../../../assets/images/png/approve.png') },
//     // { id: 2, name: 'Finishing Out', component: 'FinishingOutListComponent', image: require('../../../../assets/images/png/storeReq.png') },
//   ];

  const handleDemoClick = (component) => {
    navigation.navigate(component);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Store Management </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconsContainer}>
          {inwardProcess.map((item) => (
            <TouchableOpacity key={item.id} style={styles.iconItem} onPress={() => handleDemoClick(item.component)}>
              <Image source={item.image} style={styles.icon} />
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
    elevation:5,
    // borderColor:'black',
  },
  heading: {
    fontSize: 20,
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
    flexWrap:'wrap'
  },
});

export default StoreManagement;

