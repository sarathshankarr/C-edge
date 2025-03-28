import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertComponent from '../../utils/commonComponents/alertComponent';
import * as APIServiceCall from '../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../utils/constants/constant';
import CommonStyles from '../../utils/commonStyles/commonStyles';
import {setUrlInGlobal} from '../../config/environment/environmentConfig';
import {isValidUrl} from '../../utils/helper/helper';
import {CUSTOMER_URL} from '../../config/environment/environmentConfig';
import axios from 'axios';
import {ColorContext} from '../../components/colorTheme/colorTheme';

const Splash = () => {
  const navigation = useNavigation();

  const {updateMenuIds, clearMenuIds, updateSubMenuIds, clearSubMenuIds} =
    useContext(ColorContext);

  const Logo = require('./../../../assets/images/png/Logo.png');
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState('');
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);


  const translateX = useSharedValue(-300);
  const dotAnimations = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  const extractCompanyList = (companyIds, companyMap) => {
    const idsArray = companyIds.split(',').map(id => id.trim());
    const filtered = idsArray.reduce((acc, id) => {
      if (companyMap[id]) {
        acc[id] = companyMap[id];
      }
      return acc;
    }, {});
    return filtered;
  };

  useEffect(() => {
    // Slide-in animation for logo
    translateX.value = withTiming(0, {
      duration: 1500,
      easing: Easing.out(Easing.exp),
    });

    // Start bounce animations for dots with delays for wave effect
    dotAnimations.forEach((dot, index) => {
      dot.value = withDelay(
        index * 200, // Stagger start times
        withRepeat(
          withSequence(
            withTiming(-10, {duration: 300, easing: Easing.out(Easing.cubic)}),
            withTiming(0, {duration: 300, easing: Easing.in(Easing.cubic)}),
          ),
          -1, // Infinite repeat
          false,
        ),
      );
    });

    const checkLoginStatus = async () => {
      try {
        const KeepLoggedIn = await AsyncStorage.getItem('KeepLoggedIn');
        if (KeepLoggedIn === 'true') {
          await getCustomercode();
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'LoginComponent'}],
          });
        }
      } catch (error) {
        console.error('Error in checkLoginStatus:', error);
        navigation.reset({
          index: 0,
          routes: [{name: 'LoginComponent'}],
        });
      }
    };

    checkLoginStatus();
  }, []);

  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  const getDotStyle = index =>
    useAnimatedStyle(() => ({
      transform: [{translateY: dotAnimations[index].value}],
    }));

  const getCustomercode = async () => {
    // set_isLoading(true);
    try {
      let code = await AsyncStorage.getItem('save_code');
      console.log('code reading ===> ', code);
      const trimmedCode = code.trim();
      const response = await axios.get(CUSTOMER_URL + trimmedCode);
      set_isLoading(false);
      console.log('API Response:', response?.data?.response?.url);
      if (isValidUrl(response?.data?.response?.url)) {
        await setUrlInGlobal(response?.data?.response?.url);
        handleLogin();
        console.log('Success');
      } else {
        popUpAction(
          Constant.Wrong_Code_Msg,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      }
    } catch (error) {
      set_isLoading(false);
      if (error.response && error.response.status === 400) {
        popUpAction(
          Constant.Wrong_Code_Msg,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      } else if (
        error.response &&
        (error.response.status === 502 || error.response.status === 404)
      ) {
        popUpAction(
          Constant.SERVICE_FAIL_MSG,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      }

      navigation.reset({
        index: 0,
        routes: [{name: 'LoginComponent'}],
      });
    }
  };
  const logAllAsyncStorageItems = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys(); // Get all keys
      if (keys.length > 0) {
        const items = await AsyncStorage.multiGet(keys); // Get all key-value pairs
        console.log('All AsyncStorage Items:', items);
        items.forEach(([key, value]) => console.log(`${key}: ${value}`)); // Log each item
      } else {
        console.log('AsyncStorage is empty');
      }
    } catch (error) {
      console.error('Error fetching AsyncStorage items:', error);
    }
  };
  const handleLogin = async () => {
    set_isLoading(true);
    try {
      let userName = await AsyncStorage.getItem('save_username');
      let userPsd = await AsyncStorage.getItem('save_password');
      let obj1 = {
        username: userName ? userName.trim() : '',
        password: userPsd ? userPsd.trim() : '',
      };

      let loginAPIObj = await APIServiceCall.loginUserAPIService(obj1);

      if (loginAPIObj.error) {
        popUpAction(
          loginAPIObj.error,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      } else if (loginAPIObj.statusData) {
        console.log('Response data =====>', loginAPIObj.responseData.userName);
        await AsyncStorage.setItem(
          'userDisplayName',
          loginAPIObj.responseData.userName,
        );
        await AsyncStorage.setItem(
          'role_name',
          loginAPIObj?.responseData?.role_name
            ? loginAPIObj?.responseData?.role_name
            : 'USER',
        );
        // await AsyncStorage.setItem('userName', userName);
        // await AsyncStorage.setItem('userPsd', userPswd);

        if (loginAPIObj?.responseData?.userRoleId)
          await AsyncStorage.setItem(
            'userId',
            loginAPIObj.responseData.userId.toString(),
          );

        if (loginAPIObj?.responseData?.userRoleId)
          await AsyncStorage.setItem(
            'roleId',
            loginAPIObj.responseData.userRoleId.toString(),
          );
        if (loginAPIObj?.responseData?.usercompanyId)
          await AsyncStorage.setItem(
            'companyId',
            loginAPIObj.responseData.usercompanyId.toString(),
          );
        if (loginAPIObj?.responseData?.company)
          await AsyncStorage.setItem(
            'companyObj',
            JSON.stringify(loginAPIObj.responseData.company),
          );
        if (loginAPIObj?.responseData?.companyMap) {
          if (loginAPIObj?.responseData?.companyIds === '0') {
            await AsyncStorage.setItem(
              'CompaniesList',
              JSON.stringify(loginAPIObj.responseData.companyMap),
            );
          } else {
            const companyList = extractCompanyList(
              loginAPIObj?.responseData?.companyIds,
              loginAPIObj.responseData.companyMap,
            );
            await AsyncStorage.setItem(
              'CompaniesList',
              JSON.stringify(companyList),
            );
          }
        }
        if (loginAPIObj?.responseData?.locIds)
          await AsyncStorage.setItem('locIds', loginAPIObj.responseData.locIds);
        if (loginAPIObj?.responseData?.companyIds)
          await AsyncStorage.setItem(
            'companyIds',
            loginAPIObj.responseData.companyIds,
          );
        if (loginAPIObj?.responseData?.brandIds)
          await AsyncStorage.setItem(
            'brandIds',
            loginAPIObj.responseData.brandIds,
          );

        if (
          loginAPIObj?.responseData?.locIds &&
          loginAPIObj?.responseData?.usercompanyId
        ) {
          const extractedLocationIds = await Constant.extractLocationIds(
            loginAPIObj?.responseData?.locIds,
            loginAPIObj?.responseData?.usercompanyId,
          );
          console.log('CurrentCompanyLocations', extractedLocationIds);
          await AsyncStorage.setItem(
            'CurrentCompanyLocations',
            extractedLocationIds,
          );
        }

        if (loginAPIObj?.responseData?.dashboardlink) await AsyncStorage.setItem('dashboardlink', (loginAPIObj.responseData.dashboardlink || ''));


        if (loginAPIObj?.responseData?.menusList) {
          const menus = loginAPIObj?.responseData?.menusList;
          const MenuListIds = menus.map(item => item.menu_id);
          updateMenuIds(MenuListIds);
          await AsyncStorage.setItem('menuIds', JSON.stringify(MenuListIds));
        } else {
          clearMenuIds();
          await AsyncStorage.removeItem('menuIds');
        }
        if (loginAPIObj?.responseData?.listmoduleListName) {
          const menuSubItems = loginAPIObj?.responseData?.listmoduleListName;
          const menuSubItemsListIds = menuSubItems.map(item => item.menu_id);
          updateSubMenuIds(menuSubItemsListIds);
          await AsyncStorage.setItem(
            'subMenuIds',
            JSON.stringify(menuSubItemsListIds),
          );
        } else {
          clearSubMenuIds();
          await AsyncStorage.removeItem('subMenuIds');
        }

        // if (true) {
        //   await AsyncStorage.setItem('save_username', userName);
        //   await AsyncStorage.setItem('save_password', userPswd);
        //   await AsyncStorage.setItem('save_code', code);
        //   await AsyncStorage.setItem('KeepLoggedIn', 'true');
        // } else {
        //   await AsyncStorage.removeItem('save_username');
        //   await AsyncStorage.removeItem('save_password');
        //   await AsyncStorage.removeItem('save_code');
        // }
      
        navigation.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
      } else {
        popUpAction(
          Constant.LOGIN_FAIL_MSG,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      }
    } catch (error) {
      console.log('handleLogin Error ', error);
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginComponent'}],
      });
    }
    set_isLoading(false);
  };

  const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  };

  const popOkBtnAction = () => {
    popUpAction(undefined, undefined, '', false, false);
  };

  return (
    <View style={styles.container}>
      {/* Animated Logo */}
      <Animated.Image style={[styles.logo, logoStyle]} source={Logo} />

      {/* Animated Dots */}
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((_, index) => (
          <Animated.View key={index} style={[styles.dot, getDotStyle(index)]} />
        ))}
      </View>

      {isPopUp ? (
        <View style={CommonStyles.customPopUpStyle}>
          <AlertComponent
            header={popUpAlert}
            message={popUpMessage}
            isLeftBtnEnable={isPopupLeft}
            isRightBtnEnable={true}
            leftBtnTilte={'NO'}
            rightBtnTilte={popUpRBtnTitle}
            popUpRightBtnAction={popOkBtnAction}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    // backgroundColor: colors.color2,
    backgroundColor: '#1F74BA',
    marginHorizontal: 8,
  },
});

export default Splash;

// import React, {useContext, useEffect, useState} from 'react';
// import {View, StyleSheet} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withDelay,
//   withRepeat,
//   withSequence,
//   Easing,
// } from 'react-native-reanimated';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import AlertComponent from '../../utils/commonComponents/alertComponent';
// import * as APIServiceCall from '../../utils/apiCalls/apiCallsComponent';
// import * as Constant from "../../utils/constants/constant";
// import CommonStyles from '../../utils/commonStyles/commonStyles';
// import { setUrlInGlobal } from '../../config/environment/environmentConfig';
// import { isValidUrl } from '../../utils/helper/helper';
// import {CUSTOMER_URL} from '../../config/environment/environmentConfig'
// import axios from 'axios';
// import { ColorContext } from '../../components/colorTheme/colorTheme';

// const Splash = () => {
//   const navigation = useNavigation();
//   const { updateMenuIds, clearMenuIds, updateSubMenuIds, clearSubMenuIds } = useContext(ColorContext);

//   const Logo = require('./../../../assets/images/png/Logo.png');
//   const [isLoading, set_isLoading] = useState(false);
//   const [isPopUp, set_isPopUp] = useState(false);
//   const [popUpMessage, set_popUpMessage] = useState('');
//   const [popUpAlert, set_popUpAlert] = useState(undefined);
//   const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
//   const [isPopupLeft, set_isPopupLeft] = useState(false);

//   const translateX = useSharedValue(-300);
//   const dotAnimations = [
//     useSharedValue(0),
//     useSharedValue(0),
//     useSharedValue(0),
//   ];

//   // Move these functions outside of useEffect to ensure consistent hook calls
//   const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
//     set_popUpMessage(popMsg);
//     set_popUpAlert(popAlert);
//     set_popUpRBtnTitle(rBtnTitle);
//     set_isPopupLeft(isPopLeft);
//     set_isPopUp(isPopup);
//   };

//   const popOkBtnAction = () => {
//     popUpAction(undefined, undefined, '', false, false);
//   };

//   const extractCompanyList = (companyIds, companyMap) => {
//     const idsArray = companyIds.split(',').map(id => id.trim());
//     const filtered = idsArray.reduce((acc, id) => {
//       if (companyMap[id]) {
//         acc[id] = companyMap[id];
//       }
//       return acc;
//     }, {});
//     return filtered;
//   };

//   const handleLogin = async () => {
//     set_isLoading(true);
//     try {
//       const userName = await AsyncStorage.getItem('save_username');
//       const userPsd = await AsyncStorage.getItem('save_password');
//       const code = await AsyncStorage.getItem('save_code');

//       if (!userName || !userPsd || !code) {
//         throw new Error('Missing credentials');
//       }

//       let obj1 = {
//         username: userName.trim(),
//         password: userPsd.trim(),
//       };

//       let loginAPIObj = await APIServiceCall.loginUserAPIService(obj1);

//       if (loginAPIObj.error) {
//         popUpAction(
//           loginAPIObj.error,
//           Constant.DefaultAlert_MSG,
//           'OK',
//           true,
//           false,
//         );
//         return;
//       }

//       if (loginAPIObj.statusData) {
//         console.log('Response data =====>', loginAPIObj.responseData.userName);
//         await AsyncStorage.setItem(
//           'userDisplayName',
//           loginAPIObj.responseData.userName,
//         );
//         await AsyncStorage.setItem(
//           'role_name',
//           loginAPIObj?.responseData?.role_name || 'USER',
//         );
//         await AsyncStorage.setItem('userName', userName);
//         await AsyncStorage.setItem('userPsd', userPsd);

//         if (loginAPIObj?.responseData?.userRoleId) {
//           await AsyncStorage.setItem('userId', loginAPIObj.responseData.userId.toString());
//         }

//         if (loginAPIObj?.responseData?.userRoleId) {
//           await AsyncStorage.setItem('roleId', loginAPIObj.responseData.userRoleId.toString());
//         }

//         // ... rest of your AsyncStorage setters ...

//         if (loginAPIObj?.responseData?.menusList) {
//           const menus = loginAPIObj?.responseData?.menusList;
//           const MenuListIds = menus.map(item => item.menu_id);
//           updateMenuIds(MenuListIds);
//           await AsyncStorage.setItem('menuIds', JSON.stringify(MenuListIds));
//         } else {
//           clearMenuIds();
//           await AsyncStorage.removeItem('menuIds');
//         }

//         // ... rest of your menu handling ...

//         await AsyncStorage.setItem('KeepLoggedIn', 'true');

//         navigation.reset({
//           index: 0,
//           routes: [{name: 'Main'}],
//         });
//       } else {
//         popUpAction(
//           Constant.LOGIN_FAIL_MSG,
//           Constant.DefaultAlert_MSG,
//           'OK',
//           true,
//           false,
//         );
//       }
//     } catch (error) {
//       console.log('handleLogin Error ', error);
//       navigation.reset({
//         index: 0,
//         routes: [{name: 'LoginComponent'}],
//       });
//     } finally {
//       set_isLoading(false);
//     }
//   };

//   const getCustomercode = async () => {
//     try {
//       const code = await AsyncStorage.getItem('save_code');
//       if (!code) {
//         throw new Error('No saved code');
//       }

//       const trimmedCode = code.trim();
//       const response = await axios.get(CUSTOMER_URL + trimmedCode);

//       if (isValidUrl(response?.data?.response?.url)) {
//         await setUrlInGlobal(response?.data?.response?.url);
//         await handleLogin();
//       } else {
//         throw new Error('Invalid URL');
//       }
//     } catch (error) {
//       console.error('getCustomercode error:', error);
//       navigation.reset({
//         index: 0,
//         routes: [{name: 'LoginComponent'}],
//       });
//     }
//   };

//   useEffect(() => {
//     // Animation setup
//     translateX.value = withTiming(0, {
//       duration: 1500,
//       easing: Easing.out(Easing.exp),
//     });

//     dotAnimations.forEach((dot, index) => {
//       dot.value = withDelay(
//         index * 200,
//         withRepeat(
//           withSequence(
//             withTiming(-10, {duration: 300, easing: Easing.out(Easing.cubic)}),
//             withTiming(0, {duration: 300, easing: Easing.in(Easing.cubic)}),
//           ),
//           -1,
//           false,
//         ),
//       );
//     });

//     // Check login status
//     const checkLoginStatus = async () => {
//       try {
//         const KeepLoggedIn = await AsyncStorage.getItem('KeepLoggedIn');
//         if (KeepLoggedIn === 'true') {
//           await getCustomercode();
//         } else {
//           navigation.reset({
//             index: 0,
//             routes: [{name: 'LoginComponent'}],
//           });
//         }
//       } catch (error) {
//         console.error('checkLoginStatus error:', error);
//         navigation.reset({
//           index: 0,
//           routes: [{name: 'LoginComponent'}],
//         });
//       }
//     };

//     checkLoginStatus();
//   }, []);

//   // Animated styles
//   const logoStyle = useAnimatedStyle(() => ({
//     transform: [{translateX: translateX.value}],
//   }));

//   const getDotStyle = index =>
//     useAnimatedStyle(() => ({
//       transform: [{translateY: dotAnimations[index].value}],
//     }));

//   return (
//     <View style={styles.container}>
//       <Animated.Image style={[styles.logo, logoStyle]} source={Logo} />

//       <View style={styles.dotsContainer}>
//         {[0, 1, 2].map((_, index) => (
//           <Animated.View key={index} style={[styles.dot, getDotStyle(index)]} />
//         ))}
//       </View>

//       {isPopUp && (
//         <View style={CommonStyles.customPopUpStyle}>
//           <AlertComponent
//             header={popUpAlert}
//             message={popUpMessage}
//             isLeftBtnEnable={isPopupLeft}
//             isRightBtnEnable={true}
//             leftBtnTilte={'NO'}
//             rightBtnTilte={popUpRBtnTitle}
//             popUpRightBtnAction={popOkBtnAction}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   logo: {
//     width: 300,
//     height: 300,
//     resizeMode: 'contain',
//   },
//   dotsContainer: {
//     flexDirection: 'row',
//     marginTop: 20,
//   },
//   dot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#1F74BA',
//     marginHorizontal: 8,
//   },
// });

// export default Splash;
