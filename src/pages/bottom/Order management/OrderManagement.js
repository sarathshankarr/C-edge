import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';

const OrderManagement = ({ navigation }) => {

  const inwardProcess = [
    { id: 1, name: 'Po Approval', component: 'POApproveListComponent', image: require('../../../../assets/images/png/validation.png') },
    // { id: 2, name: 'Finishing In', component: 'FinishingStyleComponent', image: require('../../../../assets/images/png/storeReq.png') },
  ];

  const outwardProcess = [
    { id: 1, name: 'GRN', component: 'StitchingOutComponent', image: require('../../../../assets/images/png/grnn.png') },
    // { id: 2, name: 'Finishing Out', component: 'FinishingOutListComponent', image: require('../../../../assets/images/png/storeReq.png') },
  ];

  const handleDemoClick = (component) => {
    navigation.navigate(component);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Purchase Order</Text>
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
        <Text style={styles.heading}>Goods Receipt Note(GRN)</Text>
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
    tintColor:'#5177c0',
  },
  iconText: {
    textAlign: 'center',
    color: '#555', 
  },
});

export default OrderManagement;

