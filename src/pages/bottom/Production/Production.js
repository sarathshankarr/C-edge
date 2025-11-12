import React, {useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {ColorContext} from '../../../components/colorTheme/colorTheme';

const Production = ({navigation}) => {
  const {colors, subMenuItemsIds, menuIds} = useContext(ColorContext);
  const styles = getStyles(colors);

  console.log('Sub Menu IDs:', subMenuItemsIds,menuIds);

  const inwardProcess = [
    {
      id: 9,
      name: 'Cutting In',
      component: 'CuttingMainComponent',
      image: require('../../../../assets/images/png/scissors.png'),
    },
    {
      id: 11,
      name: 'Stitching In',
      component: 'StichingInComponent',
      image: require('../../../../assets/images/png/sewing.png'),
    },
    {
      id: 40,
      name: 'Finishing In',
      component: 'FinishingStyleComponent',
      image: require('../../../../assets/images/png/success.png'),
    },
    {
      id: 568,
      name: 'Fabric Process In',
      component: 'FabricProcessInList',
      image: require('../../../../assets/images/png/fabricProce.png'),
    },
    {
      id: 787,
      name: 'Parts Processing',
      component: 'PartProcessingList',
      image: require('../../../../assets/images/png/fabricProce.png'),
    },
  ];

  const outwardProcess = [
    {
      id: 12,
      name: 'Stitching Out',
      component: 'StichingOutComponent',
      image: require('../../../../assets/images/png/sewing.png'),
    },
    {
      id: 41,
      name: 'Finishing Out',
      component: 'FinishingOutListComponent',
      image: require('../../../../assets/images/png/success.png'),
    },
    {
      id: 759,
      name: 'Gate Pass Acknowledgement',
      component: 'GatePassAckList',
      image: require('../../../../assets/images/png/acknowledge.png'),
    },
    {
      id: 753,
      name: 'Box wise Style Transfer',
      component: 'BoxwiseStyleTransferList',
      image: require('../../../../assets/images/png/acknowledge.png'),
    },
  ];

  const filteredinwardProcess = inwardProcess.filter(menu =>
    subMenuItemsIds.includes(menu.id),
  );
  const filteredoutwardProcess = outwardProcess.filter(menu =>
    subMenuItemsIds.includes(menu.id),
  );

  const handleDemoClick = component => {
    navigation.navigate(component);
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {menuIds.includes(2) && <View style={styles.section}>
          <Text style={styles.heading}>In House Production</Text>
          {/* <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.iconsContainer}> */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}>
            {filteredinwardProcess.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.iconItem, {marginBottom: 15}]}
                onPress={() => handleDemoClick(item.component)}>
                <View style={styles.navIconContainer}>
                  <Image source={item.image} style={styles.icon} />
                </View>
                <Text style={styles.iconText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* </ScrollView> */}
        </View>}
        {menuIds.includes(46) && <View style={styles.section}>
          <Text style={styles.heading}>Outward Production</Text>
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.iconsContainer}> */}
                <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}>
            {filteredoutwardProcess.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.iconItem}
                onPress={() => handleDemoClick(item.component)}>
                <View style={styles.navIconContainer}>
                  <Image source={item.image} style={styles.icon} />
                </View>
                <Text style={styles.iconText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
            </View>
          {/* </ScrollView> */}
        </View>}
      </View>
    </ScrollView>
  );
};

const getStyles = colors =>
  StyleSheet.create({
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
      shadowOffset: {width: 0, height: 2},
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
      width: 80,
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
    scrollContent: {paddingBottom: 20},
  });

export default Production;
