import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import color from '../../../utils/commonStyles/color';

const Production = ({ navigation }) => {

  const inwardProcess = [
    { id: 1, name: 'Cutting In', component: 'CuttingMainComponent', image: require('../../../../assets/images/png/cut.png') },
    { id: 2, name: 'Stitching In', component: 'StichingInComponent', image: require('../../../../assets/images/png/stitch.png') },
    { id: 3, name: 'Finishing In', component: 'FinishingStyleComponent', image: require('../../../../assets/images/png/finishingg.png') },
    { id: 4, name: 'Fabric Process In', component: 'FabricProcessInList', image: require('../../../../assets/images/png/fabric.png') },
    { id: 5, name: 'Gate Pass Acknowledgement', component: 'GatePassAckList', image: require('../../../../assets/images/png/growth.png') },
  ];

  const outwardProcess = [   
    { id: 1, name: 'Stitching Out', component: 'StichingOutComponent', image: require('../../../../assets/images/png/stitch.png') },
    { id: 2, name: 'Finishing Out', component: 'FinishingOutListComponent', image: require('../../../../assets/images/png/finishingg.png') },
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
              <Image source={item.image} style={styles.icon} />
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
    borderRadius: 9,
    padding: 10,
    elevation: 5, // Works on Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Offset for the shadow
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.84, // Radius for the shadow blur
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
  },
});

export default Production;
