// import { useNavigation } from '@react-navigation/native';
import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {ColorContext} from '../../components/colorTheme/colorTheme';
import {useNavigation} from '@react-navigation/native';
let addImg = require('./../../../assets/images/png/plus11.png');

const AddNewItem = ({navItem}) => {
  const {colors} = useContext(ColorContext);
  const navigation = useNavigation();

  const styles = getStyles(colors);

  // Function to handle navigation to the new item screen
  const handleAddDesign = () => {
    navigation.navigate(navItem);
  };

  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={handleAddDesign}
      activeOpacity={0.8} // Adds a subtle feedback effect
    >
      <Image
        source={addImg}
        style={{
          height: 15,
          width: 15,
          tintColor: '#fff',
          marginRight: 15,
        }}
      />
      <Text style={styles.buttonText}>Add New</Text>
    </TouchableOpacity>
  );
};

export default AddNewItem;

// Style generation function
const getStyles = colors =>
  StyleSheet.create({
    floatingButton: {
      position: 'absolute',
      bottom: 60,
      right: 35,
      backgroundColor: colors.color2,
      paddingVertical: 15,
      paddingHorizontal: 15,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      justifyContent: 'space-between',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 5, 
    },
  });
