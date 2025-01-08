import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ColorContext } from '../../components/colorTheme/colorTheme';

const AddNewItem = ({navItem}) => {
  const { colors } = useContext(ColorContext);

  const styles = getStyles(colors);
  const navigation=useNavigation();

  const handleAddDesign = () => {
    navigation.navigate(navItem);
  };

  console.log("props ==> ", navItem)

  return (
      <TouchableOpacity style={styles.floatingButton} onPress={handleAddDesign}>
        <Text style={styles.buttonText}>Add New </Text>
      </TouchableOpacity>
  );
};

export default AddNewItem;

const getStyles = (colors)=> StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 60, 
    right: 35,  
    backgroundColor:colors.color2, 
    paddingVertical: 15, 
    paddingHorizontal: 25, 
    borderRadius: 25, 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
