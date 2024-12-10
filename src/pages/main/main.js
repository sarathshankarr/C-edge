
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import NewComponent from '../NewComponent/NewComponent';
import { SafeAreaView } from 'react-native';

const Drawer = createDrawerNavigator();
const Main = () => {
  return (
    <SafeAreaView style={{flex:1}}>

      <Drawer.Navigator drawerContent={props => <Sidebar {...props} />}>
        <Drawer.Screen
          name="NewComponent"
          component={NewComponent}
          options={{ headerShown: false }}
          />
      </Drawer.Navigator>
          </SafeAreaView>
  );
};

export default Main;


// const renderDropdown = (key, menu) => {
  //   const isSelected = selectedDropdown === key;
  //   const hasTempBackgroundEffect = tempBackgroundEffect[key];
  
  //   const handleDropdownPress = () => {
  //     setSelectedDropdown(isSelected ? null : key);
  //     toggleDropdown(key);
  
  //     // Trigger background color effect for this dropdown
  //     setTempBackgroundEffect({ [key]: true });
  //     setTimeout(() => setTempBackgroundEffect({ [key]: false }), 2000);
  //   };
  
  //   return (
  //     <View>
  //       {/* Parent Dropdown */}
  //       <TouchableOpacity
  //         style={[
  //           styles.dropdownHeader,
  //           isSelected && styles.selectedDropdownHeader,
  //           hasTempBackgroundEffect && styles.tempBackgroundEffect,
  //         ]}
  //         onPress={handleDropdownPress}>
  //         <View style={styles.dropdownTitle}>
  //           <Image
  //             style={[styles.navIcon, isSelected && styles.selectedIcon]}
  //             source={menu.icon}
  //           />
  //           <Text style={[styles.navText, isSelected && styles.selectedText]}>
  //             {menu.label}
  //           </Text>
  //         </View>
  
  //         <Image
  //           style={styles.dropdownIcon}
  //           source={
  //             openDropdown === key
  //               ? require('../../../assets/images/png/down-arrow.png')
  //               : require('../../../assets/images/png/chevron.png')
  //           }
  //         />
  //       </TouchableOpacity>
  
  //       {/* Child Items */}
  //       {openDropdown === key && (
  //         <View style={styles.dropdownContent}>
  //           {menu.style.map((item, index) => (
  //             <TouchableOpacity
  //               key={index}
  //               style={styles.dropdownItem}
  //               onPress={() => navigation.navigate(item.route)}>
  //               <Image style={styles.navIcon} source={item.src} />
  //               <Text style={styles.navText}>{item.label}</Text>
  //             </TouchableOpacity>
  //           ))}
  //         </View>
  //       )}
  //     </View>
  //   );
  // };
