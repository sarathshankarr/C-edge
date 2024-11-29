import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as APIServiceCall from './../../utils/apiCalls/apiCallsComponent';
import color from '../../utils/commonStyles/color';

const Sidebar = ({navigation, route}) => {
  const [userName, set_userName] = useState('');
  const [admin, set_admin] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [styleDropdownVisible, setStyleDropdownVisible] = useState(false);
  const [orderDropdownVisible, setOrderDropdownVisible] = useState(false);

  const toggleDropdown = (dropdown) => {
    if (dropdown === 'style') {
      setStyleDropdownVisible(!styleDropdownVisible);
      setOrderDropdownVisible(false); 
    } else if (dropdown === 'order') {
      setOrderDropdownVisible(!orderDropdownVisible);
      setStyleDropdownVisible(false); 
    }
  };

  useEffect(() => {
    getUserName();
  }, []);

  const getUserName = async () => {
    let userName = await AsyncStorage.getItem('userDisplayName');
    let admin = await AsyncStorage.getItem('admin');
    // console.log('UserName', userName, admin);
    if (userName) {
      set_userName(userName);
    }
    if (admin) {
      set_admin(admin);
    }
  };
  const goToHome = () => {
    navigation.navigate('Main');
  };

  const goToNotifications = () => {
    navigation.navigate('Notifications');
  };

  const goToOrder = () => {
    navigation.navigate('DashboardComponent');
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
      // navigation.closeDrawer();
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

    // await AsyncStorage.removeItem('save_username');
    // await AsyncStorage.removeItem('save_password');
    // await AsyncStorage.removeItem('save_code');

    console.log('response ====> ', updateUserAPIObj);
    handleLogout();
  };

  //   return (
  //     <View style={styles.container}>

  //       <View style={{ backgroundColor: '#1F74BA' }}>

  //         <View style={styles.header}>
  //           <TouchableOpacity >
  //             <Image
  //               style={[styles.img, { borderRadius: 30, tintColor: '#fff' }]}
  //               source={require('../../../assets/images/png/profile.png')}
  //             />
  //           </TouchableOpacity>
  //         <View>
  //           <Text style={{ color: '#fff', fontSize: 20 }}>Profile</Text>
  //           {userName && (
  //             <Text style={styles.usertxt}>
  //               {userName}
  //             </Text>
  //           )}
  //         </View>
  //         </View>
  //       </View>

  //       <TouchableOpacity onPress={goToHome} style={styles.homeheader}>
  //         <Image style={styles.homeimg} source={require('../../../assets/images/png/homeN.png')} />
  //         <Text style={styles.hometxt}>Home</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity onPress={goToNotifications} style={styles.categorieshead}>
  //         <Image
  //           style={styles.categoriesimg}
  //           source={require('../../../assets/images/png/notificationN.png')}
  //         />
  //         <Text style={styles.categoriestxt}>Notification</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity onPress={goToOrder} style={styles.orderhead}>
  //         <Image
  //           style={styles.orderimg}
  //           source={require('../../../assets/images/png/gear.png')}
  //         />
  //         <Text style={styles.ordertxt}>Settings</Text>
  //       </TouchableOpacity>

  //       <Modal
  //         animationType="slide"
  //         transparent={true}
  //         visible={modalVisible}
  //         onRequestClose={() => {
  //           setModalVisible(!modalVisible);
  //         }}>
  //         <View style={styles.modalContainer}>
  //           <View style={styles.modalContent}>
  //             <TouchableOpacity
  //               style={styles.modalButton}
  //               >
  //               <Text style={{ color: 'red', fontSize:17, textAlign:'center', marginBottom:10 }}>Are you sure you want to delete your account?</Text>
  //             </TouchableOpacity>
  //             <View style={{flexDirection:'row', justifyContent:'space-around'}}>
  //               <TouchableOpacity
  //                 style={styles.modalCancelButton}
  //                 onPress={handleDeleteUser}>
  //                 <Text style={{ color: 'white' }}>Yes</Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 style= {[styles.modalCancelButton, {backgroundColor: 'green'}]}
  //                 onPress={() => setModalVisible(false)}>
  //                 <Text style={{ color: 'white' }}>Cancel</Text>
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //         </View>
  //       </Modal>

  //       <View style={styles.logoutContainer}>
  //         <TouchableOpacity onPress={handleLogout} style={styles.logoutbox}>
  //           <Image
  //             resizeMode="contain"
  //             style={[
  //               styles.logoutimg,
  //               { tintColor: '#fff', height: 20, width: 20 },
  //             ]}
  //             source={require('../../../assets/images/png/logOut.png')}
  //           />
  //           <Text style={styles.logouttxt}>Logout</Text>
  //         </TouchableOpacity>
  //       </View>
  //       <TouchableOpacity onPress={() => {
  //         setModalVisible(true)
  //       }} style={styles.deleteAccount}>
  //         <Image
  //           style={{width:30, height:30, tintColor:'red'}}
  //           source={require('../../../assets/images/png/bin.png')}
  //         />
  //         <Text style={styles.deleteText}>Delete Account</Text>
  //       </TouchableOpacity>

  //     </View>
  //   );
  // };

  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     backgroundColor: '#fff',
  //     marginTop:20,
  //     padding:15,
  //   },
  //   header: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     padding:15,
  //     borderRadius:25,
  //     backgroundColor:'#1f74ba'
  //   },
  //   img: {
  //     height: 35,
  //     width: 35,
  //     marginVertical: 10,
  //   },
  //   usertxt: {
  //     // marginLeft: 20,
  //     fontSize: 20,
  //     // marginHorizontal: 10,
  //     marginVertical: 10,
  //     color: '#fff',
  //   },
  //   homeheader: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     marginHorizontal: 10,
  //     marginVertical: 25,
  //   },
  //   homeimg: {
  //     height: 25,
  //     width: 25,
  //     tintColor:'#1F74BA'
  //   },
  //   hometxt: {
  //     fontSize: 16,
  //     marginLeft: 10,
  //     color: '#000000',
  //   },
  //   categorieshead: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     marginHorizontal: 10,
  //   },
  //   categoriesimg: {
  //     height: 25,
  //     width: 25,
  //     tintColor:'#1F74BA'

  //   },
  //   categoriestxt: {
  //     fontSize: 16,
  //     marginLeft: 10,
  //     color: '#000000'
  //   },
  //   orderhead: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     marginHorizontal: 10,
  //     marginTop: 20,
  //   },
  //   deleteAccount: {
  //     flexDirection: 'row',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     marginTop: 5,
  //     position: 'absolute',
  //     bottom: 20,
  //     left: 0,
  //     right: 0,
  //     // elevation:5,
  //     // borderTopWidth:2,
  //     borderColor:'#000',
  //     // padding:20,
  //     // borderRadius:30

  //   },
  //   orderimg: {
  //     height: 25,
  //     width: 25,
  //     tintColor:'#1F74BA'

  //   },

  //   ordertxt: {
  //     fontSize: 16,
  //     marginLeft: 10,
  //     color: '#000000',
  //   },
  //   deleteText: {
  //     fontSize: 16,
  //     marginLeft:20,
  //     color: 'red',
  //     fontWeight: 'bold'
  //   },

  //   logoutContainer: {
  //     position: 'absolute',
  //     // bottom: 0,
  //     // left: 0,
  //     // right: 0,
  //     bottom: 80,
  //     left: 0,
  //     right: 0,
  //   },
  //   logoutbox: {
  //     borderWidth: 1,
  //     borderColor: '#390050',
  //     backgroundColor: '#5177c0',
  //     borderRadius: 15,
  //     paddingVertical: 12,
  //     flexDirection: 'row',
  //     marginHorizontal: 30,
  //     justifyContent: 'center',
  //   },
  //   logoutimg: {
  //     height: 20,
  //     width: 15,
  //     marginRight: 8,
  //   },
  //   logouttxt: {
  //     textAlign: 'center',
  //     color: '#fff',
  //     fontSize: 15,
  //     fontWeight: 'bold',
  //   },

  //   modalContainer: {
  //     flex: 1,
  //     justifyContent: 'flex-end',
  //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //   },
  //   modalContent: {
  //     backgroundColor: '#fff',
  //     padding: 20,
  //     borderTopLeftRadius: 20,
  //     borderTopRightRadius: 20,
  //   },
  //   modalButton: {
  //     paddingVertical: 15,
  //     // borderBottomWidth: 1,
  //     // borderBottomColor: '#ccc',
  //   },
  //   modalCancelButton: {
  //     paddingVertical: 15,
  //     alignItems: 'center',
  //     backgroundColor: 'red',
  //     borderRadius: 10,
  //     marginTop: 10,
  //     width:'25%',
  //   },

  // });

  // export default Sidebar;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Image
              style={[styles.img, {borderRadius: 30, tintColor: '#fff'}]}
              source={require('../../../assets/images/png/profile.png')}
            />
          </TouchableOpacity>
          <View>
            {/* <Text style={styles.headerTitle}>Hi,  {userName}</Text>
          <Text style={styles.headerSubtitle}>{admin ? admin : "Profile"}</Text> */}

            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>{userName}</Text>
          </View>
        </View>
      </View>

      {/* Navigation Options */}
      <View
        style={{marginTop: 10, borderRadius: 10, backgroundColor: '#F5F5F5'}}>
        <TouchableOpacity onPress={goToHome} style={styles.homeheader}>
          <Image
            style={styles.homeimg}
            source={require('../../../assets/images/png/homeN.png')}
          />
          <Text style={styles.hometxt}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToNotifications}
          style={styles.categorieshead}>
          <Image
            style={styles.categoriesimg}
            source={require('../../../assets/images/png/notificationN.png')}
          />
          <Text style={styles.categoriestxt}>Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToOrder} style={styles.orderhead}>
          <Image
            style={styles.orderimg}
            source={require('../../../assets/images/png/gear.png')}
          />
          <Text style={styles.ordertxt}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Management Section */}
      <View
        style={{marginTop: 10, borderRadius: 10, backgroundColor: '#F5F5F5'}}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 20,
            color: '#000',
            textAlign: 'left',
            marginHorizontal: 10,
          }}>
          Management
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => toggleDropdown('style')}
            style={styles.homeheader}>
            <Image
              style={styles.homeimg}
              source={require('../../../assets/images/png/shirt.png')}
            />
            <Text style={styles.hometxt}>Style Management</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleDropdown('style')}>
          <Image
            style={styles.homeimg}
            source={styleDropdownVisible ? require('../../../assets/images/png/down-arrow.png') : require('../../../assets/images/png/chevron.png')}
          />
          </TouchableOpacity>
        </View>
        {styleDropdownVisible && (
          <View
            style={{
              backgroundColor: '#FFF',
              // marginHorizontal: 20,
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
              marginLeft:25,
              elevation:3
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate('StyleManageComponent')} style={{flexDirection:'row', alignItems:"center"}}>
            {/* <Image
              style={styles.categoriesimg}
              source={require('../../../assets/images/png/chevron.png')}
            /> */}
              <Text
                style={{
                  fontSize: 14,
                  color: '#000',
                  paddingVertical: 5,
                }}
              >
                Style
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('DDAList')} style={{flexDirection:'row', alignItems:"center"}}>
            {/* <Image
              style={styles.categoriesimg}
              source={require('../../../assets/images/png/chevron.png')}
            /> */}
              <Text
                style={{
                  fontSize: 14,
                  color: '#000',
                  paddingVertical: 5,
                  elevation: 3,
                }}
              >
                Design Directory Approval
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => toggleDropdown('order')}
            style={styles.homeheader}>
            <Image
              style={styles.categoriesimg}
              source={require('../../../assets/images/png/orderrr.png')}
            />
            <Text style={styles.hometxt}>Order Management</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleDropdown('order')}>
          <Image
            style={styles.homeimg}
            source={orderDropdownVisible ? require('../../../assets/images/png/down-arrow.png') : require('../../../assets/images/png/chevron.png')}
          />
          </TouchableOpacity>
        </View>
        {orderDropdownVisible && (
          <View
            style={{
              backgroundColor: '#FFF',
              // marginHorizontal: 20,
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
              marginLeft:25,
              elevation:3
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate('POApproveListComponent')} style={{flexDirection:'row', alignItems:"center"}}>
            {/* <Image
              style={styles.categoriesimg}
              source={require('../../../assets/images/png/chevron.png')}
            /> */}
              <Text
                style={{
                  fontSize: 14,
                  color: '#000',
                  paddingVertical: 5,
                  elevation: 3,
                }}
              >
                PO Approval
              </Text>
            </TouchableOpacity>
          </View>
        )}

       
      </View>
      

      {/* Logout and Delete Account */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutbox}>
          <Image
            resizeMode="contain"
            style={[
              styles.logoutimg,
              {tintColor: '#fff', height: 20, width: 20},
            ]}
            source={require('../../../assets/images/png/logOut.png')}
          />
          <Text style={styles.logouttxt}>Logout</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={styles.deleteAccount}>
        <Image
          style={{width: 30, height: 30, tintColor: 'red'}}
          source={require('../../../assets/images/png/bin.png')}
        />
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 17,
                  textAlign: 'center',
                  marginBottom: 10,
                }}>
                Are you sure you want to delete your account?
              </Text>
            </TouchableOpacity>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleDeleteUser}>
                <Text style={{color: 'white'}}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalCancelButton, {backgroundColor: 'green'}]}
                onPress={() => setModalVisible(false)}>
                <Text style={{color: 'white'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default Sidebar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // marginTop: 10,
    padding: 15,
  },

  // Header styles
  headerContainer: {
    backgroundColor: color.color2,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    // borderRadius:5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#ffffff50', // Placeholder for profile picture
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },

  // Sidebar button styles
  homeheader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 15,
  },
  homeimg: {
    height: 25,
    width: 25,
    tintColor: color.color2,
  },
  hometxt: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000000',
  },
  categorieshead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  categoriesimg: {
    height: 25,
    width: 25,
    tintColor: color.color2,
  },
  categoriestxt: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000000',
  },
  orderhead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 20,
    marginVertical: 25,
  },
  orderimg: {
    height: 25,
    width: 25,
    tintColor: color.color2,
  },
  ordertxt: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000000',
  },

  // Logout and Delete Account
  logoutContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logoutbox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.color2,
    borderRadius: 25,
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 30,
    width: '80%',
  },
  logoutimg: {
    height: 20,
    width: 20,
    marginRight: 8,
    tintColor: '#fff',
  },
  logouttxt: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  deleteAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  deleteText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#D9534F',
    fontWeight: '600',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalButton: {
    paddingVertical: 15,
  },
  modalCancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
    marginTop: 10,
    width: '25%',
  },
});
