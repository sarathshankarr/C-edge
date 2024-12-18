import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import color from '../../../utils/commonStyles/color';

const Production = ({ navigation }) => {

  const inwardProcess = [
    { id: 1, name: 'Cutting In', component: 'CuttingMainComponent', image: require('../../../../assets/images/png/scissors.png') },
    { id: 2, name: 'Stitching In', component: 'StichingInComponent', image: require('../../../../assets/images/png/sewing.png') },
    { id: 3, name: 'Finishing In', component: 'FinishingStyleComponent', image: require('../../../../assets/images/png/success.png') },
    { id: 4, name: 'Fabric Process In', component: 'FabricProcessInList', image: require('../../../../assets/images/png/fabricProce.png') },
    { id: 5, name: 'Gate Pass Acknowledgement', component: 'GatePassAckList', image: require('../../../../assets/images/png/acknowledge.png') },
  ];

  const outwardProcess = [   
    { id: 1, name: 'Stitching Out', component: 'StichingOutComponent', image: require('../../../../assets/images/png/sewing.png') },
    { id: 2, name: 'Finishing Out', component: 'FinishingOutListComponent', image: require('../../../../assets/images/png/success.png') },
  ];

  const handleDemoClick = (component) => {
    navigation.navigate(component);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>In House Production</Text>
        {/* <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.iconsContainer}> */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {inwardProcess.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.iconItem, {marginBottom:15}]} onPress={() => handleDemoClick(item.component)}>
              <View style={styles.navIconContainer}>
              <Image source={item.image} style={styles.icon} />
              </View>
              <Text style={styles.iconText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
          </View>
        {/* </ScrollView> */}
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Outward Production</Text>
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
    backgroundColor: '#f0f0f0', 
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white', 
    borderRadius: 9,
    padding: 10,
    elevation: 5,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', 
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
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 30,
    marginBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
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

export default Production;


