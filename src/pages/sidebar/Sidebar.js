import React, {useEffect, useState, useRef, useContext, useCallback} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Easing} from 'react-native';
import { ColorContext } from '../../components/colorTheme/colorTheme';
import { useFocusEffect } from '@react-navigation/native';





const Sidebar = ({navigation}) => {

  const { colors,menuIds,subMenuItemsIds} = useContext(ColorContext);
  const dropdownMenus = {
    style: {
      label: 'Style Management',
      menu_id: 3,
      icon: require('../../../assets/images/png/shirt.png'),
      style: [
        {
          label: 'Style',
          menu_id: 30,
          route: 'StyleManageComponent',
          src: require('../../../assets/images/png/shirt.png'),
        },
        {
          label: 'Design Directory Approval',
          menu_id: 728,
          route: 'DDAList',
          src: require('../../../assets/images/png/website.png'),
        },
        {
          label: 'Work Order (style)',
          menu_id: 728,
          route: 'WorkOrderStyleList',
          src: require('../../../assets/images/png/website.png'),
        },
        {
          label: 'Work Order (Buyer PO)',
          menu_id: 728,
          route: 'WorkOrderBuyerPoList',
          src: require('../../../assets/images/png/website.png'),
        },
      ],
    },
    order: {
      label: 'Order Management',
      menu_id: 28,
      icon: require('../../../assets/images/png/orderrr.png'),
      style: [
        {
          label: 'Purchase Order',
          route: 'POApproveListComponent',
          menu_id: 4,
          src: require('../../../assets/images/png/stamp.png'),
        },
        // {
        //   label: ' Purchase Order Draft',
        //   route: 'PurchaseOrderDraftList',
        //   menu_id: 4,
        //   src: require('../../../assets/images/png/stamp.png'),
        // },
        {
          label: 'Goods Receipt Note (GRN)',
          route: 'GoodsReceiptNoteList',
          menu_id: 4,
          src: require('../../../assets/images/png/stamp.png'),
        },
        {
          label: 'Box Packing',
          route: 'BoxPackingList',
          menu_id: 4,
          src: require('../../../assets/images/png/stamp.png'),
        },
        // {
        //   label: 'Master Box Packing',
        //   route: 'masterBoxPackingList',
        //   menu_id: 4,
        //   src: require('../../../assets/images/png/stamp.png'),
        // },
        {
          label: 'Bill Generation',
          route: 'BillGenerationList',
          menu_id: 4,
          src: require('../../../assets/images/png/stamp.png'),
        },
      ],
    },
    masters: {
      label: 'Masters',
      menu_id: 1,
      icon: require('../../../assets/images/png/mentor.png'),
      style: [
        {
          label: 'Fabric',
          route: 'masterFabricList',
          menu_id: 29,
          src: require('../../../assets/images/png/textile.png'),
        },
        {
          label: 'Raw Materials Master',
          route: 'RawMaterialsMasterList',
          menu_id: 69,
          src: require('../../../assets/images/png/metal.png'),
        },
        {
          label: 'UOM Master',
          route: 'UomMasterList',
          menu_id: 123,
          src: require('../../../assets/images/png/measuring-tape.png'),
        },
        // {
        //   label: 'Location Master',
        //   route: 'LocationMasterList',
        //   menu_id: 71,
        //   src: require('../../../assets/images/png/locationicon.png'),
        // },
        {
          label: 'Raw Material Type',
          route: 'RawMaterialTypeList',
          menu_id: 82,
          src: require('../../../assets/images/png/metal.png'),
        },
        // {
        //   label: 'Season Group Master',
        //   route: 'SeasonMasterList',
        //   menu_id: 73,
        //   src: require('../../../assets/images/png/big-sale.png'),
        // },
        // {
        //   label: 'Size Master',
        //   route: 'SizeMasterList',
        //   menu_id: 78,
        //   src: require('../../../assets/images/png/measuring-tape.png'),
        // },
        // {
        //   label: 'Scale/Size group Master',
        //   route: 'ScaleOrSizeMasterList',
        //   menu_id: 81,
        //   src: require('../../../assets/images/png/angle.png'),
        // },
        // {
        //   label: 'Color  Master',
        //   route: 'ColorMasterList',
        //   menu_id: 74,
        //   src: require('../../../assets/images/png/color-palette.png'),
        // },
        {
          label: 'Vendor/Customer Master',
          route: 'VendorOrCustomerMasterList',
          menu_id: 17,
          src: require('../../../assets/images/png/person.png'),
        },
      ],
    },
    store: {
      label: 'Store Management',
      menu_id: 96,
      icon: require('../../../assets/images/png/store.png'),
      style: [
        {
          label: 'Store Request',
          route: 'StockRequestList',
          menu_id: 97,
          src: require('../../../assets/images/png/stockRequest.png'),
        },
        {
          label: 'Store Approval',
          route: 'StoreApproveListComponent',
          menu_id: 98,
          src: require('../../../assets/images/png/stockApproval.png'),
        },
        {
          label: 'Store Receive',
          route: 'StockRecieveList',
          menu_id: 99,
          src: require('../../../assets/images/png/stockRecieve.png'),
        },
      ],
    },
    inventory: {
      label: 'Inventory',
      menu_id: 91,
      icon: require('../../../assets/images/png/inventoryy.png'),
      style: [
        {
          label: 'Location Wise Style Inventory',
          route: 'StyleLocationInventory',
          menu_id: 93,
          src: require('../../../assets/images/png/tracking.png'),
        },
        {
          label: 'Location wise RM/Fabric Inventory',
          route: 'LocationWiseRMFabInv',
          menu_id: 95,
          src: require('../../../assets/images/png/consignment.png'),
        },
        {
          label: 'Style Wise RM/Fabric Inventory',
          menu_id: 168,
          route: 'LocationStyleWiseInventory',
          src: require('../../../assets/images/png/inventory.png'),
        },
      ],
    },
    inhouseProduction: {
      label: 'Inhouse Production',
      menu_id: 2,
      icon: require('../../../assets/images/png/inbox-in.png'),
      style: [
        {
          label: 'Cutting in',
          route: 'CuttingMainComponent',
          menu_id: 9,
          src: require('../../../assets/images/png/scissors.png'),
        },
        {
          label: 'Stitching in',
          route: 'StichingInComponent',
          menu_id: 11,
          src: require('../../../assets/images/png/sewing.png'),
        },
        {
          label: 'Finishing in',
          route: 'FinishingStyleComponent',
          menu_id: 40,
          src: require('../../../assets/images/png/success.png'),
        },
        {
          label: 'Fabric Process in',
          route: 'FabricProcessInList',
          menu_id: 568,
          src: require('../../../assets/images/png/fabricProce.png'),
        },
        {
          label: 'Parts Processing',
          route: 'PartProcessingList',
          menu_id: 787,
          src: require('../../../assets/images/png/fabricProce.png'),
        },
        // {
        //   label: 'New Process In',
        //   route: 'NewProcessInList',
        //   menu_id: 787,
        //   src: require('../../../assets/images/png/fabricProce.png'),
        // },
        // {
        //   label: 'New Process Out',
        //   route: 'NewProcessOutList',
        //   menu_id: 787,
        //   src: require('../../../assets/images/png/fabricProce.png'),
        // },
      ],
    },
    outwardProcess: {
      label: 'Outward Process',
      menu_id: 46,
      icon: require('../../../assets/images/png/out-of-the-box.png'),
      style: [
        {
          label: 'Stitching Out',
          route: 'StichingOutComponent',
          menu_id: 12,
          src: require('../../../assets/images/png/sewing.png'),
        },
        {
          label: 'Finishing Out',
          route: 'FinishingOutListComponent',
          menu_id: 41,
          src: require('../../../assets/images/png/success.png'),
        },
        {
          label: 'Gate Pass Acknowledgement',
          route: 'GatePassAckList',
          menu_id: 759,
          src: require('../../../assets/images/png/acknowledge.png'),
        },
        {
          label: 'Style Transfer Out',
          route: 'StyleTransferOutList',
          menu_id: 49,
          src: require('../../../assets/images/png/acknowledge.png'),
        },
        // {
        //   label: 'New In Process',
        //   route: 'NewOutInProcessList',
        //   menu_id: 49,
        //   src: require('../../../assets/images/png/acknowledge.png'),
        // },
        // {
        //   label: 'Delivery Challan ',
        //   route: 'DeliveryChallanList',
        //   menu_id: 49,
        //   src: require('../../../assets/images/png/acknowledge.png'),
        // },
      ],
    },
    reports: {
      label: 'Reports',
      menu_id: 100,
      icon: require('../../../assets/images/png/sales.png'),
      style: [
        {
          label: 'Inventory Consumption Report',
          route: 'InventoryConsumptionReport',
          menu_id: 118,
          src: require('../../../assets/images/png/report.png'),
        },
        {
          label: 'Sales Order Report',
          route: 'SalesOrderReport',
          menu_id: 101,
          src: require('../../../assets/images/png/report.png'),
        },
        {
          label: 'Production Process Report',
          route: 'ProductionProcessReport',
          menu_id: 127,
          src: require('../../../assets/images/png/report.png'),
        },
        {
          label: 'Style Bom Report',
          route: 'StyleBomReport',
          menu_id: 423,
          src: require('../../../assets/images/png/report.png'),
        },
        {
          label: 'Worker Wages Report',
          route: 'WorkerWagesReport',
          menu_id: 743,
          src: require('../../../assets/images/png/report.png'),
        },
        {
          label: 'Cutting Report',
          route: 'CuttingReport',
          menu_id: 743,
          src: require('../../../assets/images/png/report.png'),
        },
        // {
        //   label: 'Batch Wise Production Process Report',
        //   route: 'BatchWiseReport',
        //   menu_id: 743,
        //   src: require('../../../assets/images/png/report.png'),
        // },
      ],
    },
  };

  const filteredMenus = Object.fromEntries(
    Object.entries(dropdownMenus).filter(([key, menu]) =>
      menuIds.includes(menu.menu_id)
    )
  );

  const filteredMenus1 = Object.fromEntries(
    Object.entries(dropdownMenus)
      .map(([key, menu]) => {
        // Filter submenu items based on subMenuItemsIds
        const filteredStyle = menu.style.filter(item => subMenuItemsIds.includes(item.menu_id));
        // console.log("filtered menus ==> ", filteredStyle)
        // Include main menu ONLY if it has filtered submenus
        if (filteredStyle.length > 0) {
          return [key, { ...menu, style: filteredStyle }];
        }
        return null;
      })
      .filter(Boolean) 
  );
  
  const [userName, set_userName] = useState('');
  const [admin, set_admin] = useState('');
  const [companyName, set_companyName] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = React.useState(null);
  const [selectedDropdown, setSelectedDropdown] = useState(null);
  const [tempBackgroundEffect, setTempBackgroundEffect] = useState({}); 
  
  const styles = getStyles(colors);


  const toggleDropdown = key => {
    setOpenDropdown(prev => (prev === key ? null : key));
  };

  useFocusEffect(
    useCallback(() => {
      getUserName();
    }, [])
  );

  const getUserName = async () => {
    let userName = await AsyncStorage.getItem('userDisplayName');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let cpyObj = JSON.parse(companyObj);
    let role_name = await AsyncStorage.getItem('role_name');

    // console.log("compnay Name", cpyObj.company_name)


    console.log('UserName', userName, admin);
    if (userName) {
      set_userName(userName);
    }
    if (role_name) {
      set_admin(role_name);
    }
    if (companyObj) {
      set_companyName(cpyObj.company_name);
      // console.log("inside setting company name")
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userDisplayName');
      await AsyncStorage.removeItem('admin');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userPsd');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('roleId');
      await AsyncStorage.removeItem('companyId');
      await AsyncStorage.removeItem('companyObj');
      await AsyncStorage.removeItem('CompaniesList');
      await AsyncStorage.removeItem('locIds');
      await AsyncStorage.removeItem('companyIds');
      await AsyncStorage.removeItem('brandIds');
      await AsyncStorage.removeItem('CurrentCompanyLocations');
      await AsyncStorage.removeItem('menuIds');
      await AsyncStorage.removeItem('subMenuIds');
      await AsyncStorage.setItem('KeepLoggedIn', "false");
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginComponent'}],
      });
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const handleDeleteUser = async () => {
    let userId = await AsyncStorage.getItem('userId');

    let obj1 = {
      userId: Number(userId),
    };

    console.log('obj1 => ', obj1);

    let updateUserAPIObj = await APIServiceCall.updateUserInActive(obj1);
    if (updateUserAPIObj.error) {
      popUpAction(
        loginAPIObj.error,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    await AsyncStorage.removeItem('save_username');
    await AsyncStorage.removeItem('save_password');
    await AsyncStorage.removeItem('save_code');

    console.log('response ====> ', updateUserAPIObj);
    handleLogout();
  };

  const renderDropdown = (key, menu) => {
    const isSelected = selectedDropdown === key;
    const hasTempBackgroundEffect = tempBackgroundEffect[key];
    const animationValue = useRef(new Animated.Value(0)).current;

    const handleDropdownPress = () => {
      setSelectedDropdown(isSelected ? null : key);
      toggleDropdown(key);

      // Trigger background color effect for this dropdown
      setTempBackgroundEffect({[key]: true});
      setTimeout(() => setTempBackgroundEffect({[key]: false}), 2000);

      // Animate dropdown height
      Animated.timing(animationValue, {
        toValue: isSelected ? 0 : menu.style[0].label==="Location Wise Style Inventory" ? menu.style.length * 80 : menu.style.length * 60, 
        duration: 300,
        useNativeDriver: false, 
      }).start();
    };

    return (
      <View>
        {/* Parent Dropdown */}
        <TouchableOpacity
          style={[
            styles.dropdownHeader,
            isSelected && styles.selectedDropdownHeader,
            hasTempBackgroundEffect && styles.tempBackgroundEffect,
          ]}
          onPress={handleDropdownPress}>
          <View style={styles.dropdownTitle}>
          <View style={styles.navIconContainer}>
            <Image
              style={[styles.navIcon, isSelected && styles.selectedIcon]}
              source={menu.icon}
              />
          </View>
            <Text style={[styles.navText, isSelected && styles.selectedText]}>
              {menu.label}
            </Text>
          </View>
          <View style={{ marginLeft:-10}}>
          <Image
            style={styles.dropdownIcon}
            source={
              openDropdown === key
                ? require('../../../assets/images/png/down-arrow.png')
                : require('../../../assets/images/png/chevron.png')
            }
          />
          </View>
        </TouchableOpacity>

        {/* Child Items */}
        {openDropdown === key && (
          <Animated.View
            style={[
              styles.animatedDropdownContent,
              {height: animationValue},
              styles.dropdownContent,
            ]}>
            {menu.style.map((item, index) => (
              <TouchableOpacity
                key={`${index}-${item.route}`}
                style={styles.dropdownItem}
                onPress={() => navigation.navigate(item.route)}>
                <View style={styles.navIconContainer}>
                <Image style={styles.navIcon} source={item.src} />
                </View>
                <Text style={styles.navText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </View>
    );
  };

  const NavItem = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <View style={styles.navIconContainer}>
        <Image style={styles.navIcon} source={icon} />
      </View>
      <Text style={styles.navText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
     <View style={styles.header}>
    <TouchableOpacity>
      <Image
        style={[styles.img, { tintColor: '#fff' }]}
        source={require('../../../assets/images/png/profile.png')}
      />
    </TouchableOpacity>
    <View>
      <Text style={styles.headerSubtitle}>{userName}</Text>
      <Text style={styles.headerSubtitle}>{admin ? admin : "Profile"}</Text>
    </View>
  </View>

  {companyName && <View style={styles.companyInfo}>
    <Image
      style={[styles.img1, { tintColor: '#fff'}]}
      source={require('../../../assets/images/png/building.png')}
    />
    <Text style={styles.headerSubtitle}>{companyName}</Text>
  </View>}
</View>

      {/* Navigation */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}>
        {/* <View style={styles.navContainer}>
          <NavItem
            title="Home"
            icon={require('../../../assets/images/png/homeN.png')}
            onPress={() => navigation.navigate('NewComponent')}
          />
        </View> */}
      

        {Object.entries(filteredMenus1).map(([key, menu], index) => (
          <View key={menu.menu_id}>
            {renderDropdown(key, menu)}
          </View>
        ))}

      <View style={styles.navContainer}>
        {menuIds.includes(392) && <NavItem
            title="Notifications"
            icon={require('../../../assets/images/png/notificationN.png')}
            onPress={() => navigation.navigate('Notifications')}
          />}
          <NavItem
            title="Settings"
            icon={require('../../../assets/images/png/gear.png')}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
       <View style={{marginBottom: 50}} />
      </ScrollView>




      {/* Delete Modal */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleDeleteUser}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default Sidebar;

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {flex: 1},
  scrollContent: {paddingBottom:20},
  // Header styles
  // headerContainer: {
  //   backgroundColor: colors.color2,
  //   paddingVertical: 20,
  //   paddingHorizontal: 15,
  //   borderBottomLeftRadius: 20,
  //   borderBottomRightRadius: 20,
  //   margin: 15,
  //   // borderRadius:5,
  // },
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // img: {
  //   height: 50,
  //   width: 50,
  //   borderRadius: 25,
  //   marginRight: 15,
  //   backgroundColor: '#ffffff50',
  // },
  // img1: {
  //   height: 25,
  //   width: 25,
  //   borderRadius: 25,
  //   marginRight: 15,
  //   backgroundColor: '#ffffff50',
  // },
  // headerTitle: {
  //   color: '#fff',
  //   fontSize: 18,
  //   fontWeight: 'bold',
  // },
  // headerSubtitle: {
  //   color: '#fff',
  //   fontSize: 14,
  //   marginTop: 5,
  // },
  headerContainer: {
      backgroundColor: colors.color2,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    margin: 15,
    // borderRadius:5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#ffffff50',
    borderWidth: 1,
    borderColor: '#fff',
  },
  img1: {
    height: 30,
    width: 30,
    // borderRadius: 30,
    marginRight: 15,
    // backgroundColor: '#ffffff',
    // borderWidth: 1,
    // borderColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#ffffffcc',
    fontSize: 14,
    marginTop: 2,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 2,
    borderTopWidth: 1,
    justifyContent:'center',
    borderTopColor: '#ffffff50',
    marginTop: 2,
    paddingHorizontal: 15,
  },

  dropdownTitle: {flexDirection: 'row', alignItems: 'center'},

  dropdownIcon: {
    width: 15,
    height: 15,
  },
  dropdownContent: {
    paddingLeft: 20,
    marginTop: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 3,
    marginLeft:25,
  },

  profileImage: {width: 50, height: 50, marginRight: 15, borderRadius: 25},
  userName: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
  navContainer: {marginTop: 10, paddingHorizontal: 15},
  navIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    marginRight: 15,
  },
  navItem: {
    flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
      borderRadius: 5,
      marginVertical: 5,
      borderBottomWidth:1,
      borderColor:'#EAEAEA',
  },
navIcon: {width: 20, height: 20, tintColor: colors.color2},
navText: {fontSize: 16, color: '#333',flexDirection:'row',flexWrap: 'wrap',flex: 1,textAlign: 'left',},
bottomSection: {flexDirection: 'row', justifyContent: 'space-around', marginTop: 'auto', padding: 20},
logoutButton: {alignItems: 'center'},
logoutIcon: {width: 30, height: 30, tintColor:colors.color2},
logoutText: {color: '#333', marginTop: 5, fontSize: 14},
deleteButton: {alignItems: 'center'},
deleteIcon: {width: 30, height: 30, tintColor:colors.color2},
deleteText: {color: '#f00', marginTop: 5, fontSize: 14},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {fontSize: 16, marginBottom: 20, textAlign: 'center'},
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    margin: 5,
  },
  cancelButton: {backgroundColor: '#d9534f'},
  modalButtonText: {color: '#fff', fontSize: 14, fontWeight: 'bold'},

  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 15,
    // backgroundColor: '#f7f7f7',
    borderRadius: 5,
    marginVertical: 5,
    borderBottomWidth:1,
    borderColor:'#EAEAEA',
  },
  selectedDropdownHeader: {
    borderLeftWidth: 5,
    borderColor: colors.color2,
    elevation: 5,
    backgroundColor: '#fff',
  },
  tempBackgroundEffect: {
    backgroundColor: '#f7f7f7',
  },
  selectedIcon: {
    tintColor: colors.color2,
  },

  selectedText: {
    color: colors.color2,
  },
  animatedDropdownContent: {
    overflow: 'hidden', // Ensures content is clipped during animation
    backgroundColor: '#fff', // Optional: Subtle background color
    borderRadius: 5, // Optional: Rounded edges for dropdown
    marginTop: 5,
  },
});



// [
//   { menu_id: 28, menu_name: 'Order Management' },
//   { menu_id: 320, menu_name: 'Production Planning' },
//   { menu_id: 2, menu_name: 'In-House Production' },
//   { menu_id: 46, menu_name: 'Out Processes' },
//   { menu_id: 174, menu_name: 'Washing Process' },
//   { menu_id: 52, menu_name: 'Yarn Processes' },
//   { menu_id: 3, menu_name: 'Style Management' },
//   { menu_id: 1, menu_name: 'Masters' },
//   { menu_id: 91, menu_name: 'Inventory Management' },
//   { menu_id: 448, menu_name: 'Vendor Portal' },
//   { menu_id: 392, menu_name: 'Notification ' },
//   { menu_id: 96, menu_name: 'Store Management' },
//   { menu_id: 116, menu_name: 'Packing' },
//   { menu_id: 381, menu_name: 'Menu Configuration' },
//   { menu_id: 111, menu_name: 'Login Management' },
//   { menu_id: 465, menu_name: 'Field Configuration' },
//   { menu_id: 192, menu_name: 'Quality' },
//   { menu_id: 100, menu_name: 'Reports' },
//   { menu_id: 497, menu_name: 'HR Module' },
//   { menu_id: 341, menu_name: 'Accounts' },
//   { menu_id: 616, menu_name: 'Your Plan & Billing' }
// ]