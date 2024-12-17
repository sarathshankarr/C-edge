// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, TouchableOpacity, Text, TextInput, Image, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import * as Constant from './../../utils/constants/constant';
// import CommonStyles from './../../utils/commonStyles/commonStyles';
// import LoaderComponent from './../../utils/commonComponents/loaderComponent';
// import AlertComponent from './../../utils/commonComponents/alertComponent';
// import { RESET_PASSWORD } from '../../utils/apiCalls/apiCallsComponent';
// import axios from 'axios';
// import * as APIServiceCall from './../../utils/apiCalls/apiCallsComponent';
// import { setUrlInGlobal } from '../../config/environment/environmentConfig';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// let hideImg = require('./../../../assets/images/png/hide-password.png');
// let openImg = require('./../../../assets/images/png/show-password.png');

// const ConfirmPassword = ({ navigation, route, ...props }) => {
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmNewPassword, setConfirmNewPassword] = useState('')
//   const [url, setUrl] = useState('');
//   const [otpStr, setotpStr] = useState('');
//   const [showPassword1, setshowPassword1] = useState(true);
//   const [showPassword2, setshowPassword2] = useState(true);

//   const [isPopUp, set_isPopUp] = useState(false);
//   const [popUpMessage, set_popUpMessage] = useState('');
//   const [popUpAlert, set_popUpAlert] = useState(undefined);
//   const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
//   const [isPopupLeft, set_isPopupLeft] = useState(false);
//   const [code, setcode] = useState('')


//   useEffect(() => {
//     if (route?.params) {
//       console.log("route.params ===> ", route.params);

//       setEmail(route.params?.email);
//       setotpStr(route.params?.otp);
//       setUrl(route.params?.url);
//       setcode(route.params?.serverCode);
//     }

//   }, [route.params]);

//   const handleSetNewPassword = async () => {
//     setLoading(true);
//     if (!newPassword || !confirmNewPassword) {
//       setLoading(false);
//       popUpAction(Constant.ALL_FIELDS, Constant.DefaultAlert_MSG, 'OK', true, false);

//       return;
//     }
//     if (newPassword !== confirmNewPassword) {
//       setLoading(false);
//       popUpAction(Constant.PSWD_NOT_MATCH, Constant.DefaultAlert_MSG, 'OK', true, false);


//       return;
//     }

//     // if (newPassword.length < 8) {
//     //   setLoading(false);
//     //   popUpAction(Constant.PSWD_MIN_LENG, Constant.DefaultAlert_MSG, 'OK', true, false);
//     //   return;
//     // }

//     const reqBody = {
//       email: email,
//       otp: otpStr,
//       password: newPassword,
//     };

//     try {
//       const apiUrl = url + RESET_PASSWORD;
//       console.log("API URL ==> ", apiUrl);
//       const response = await axios.post(apiUrl, reqBody);
//       setLoading(false);
//       console.log('API Response:', response?.data);

//       const res = response?.data;

//       if (res.user_login_Id && res.loginType === "true") {
//         // popUpAction(Constant.PSWD_SET_SUCC, Constant.DefaultAlert_MSG, 'OK', true, false);

//         Alert.alert(Constant.DefaultAlert_MSG, Constant.PSWD_SET_SUCC);
//         handleRedirect(res.user_login_Id);
//         // navigation.navigate('LoginComponent');

//       } else if (res.user_login_Id === "" && res.loginType === "Given OTP is invalid...Please check") {
//         popUpAction(Constant.EXPIRED_OTP, Constant.DefaultAlert_MSG, 'OK', true, false);
//       } else {
//         popUpAction(Constant.ERROR_OCCURED, Constant.DefaultAlert_MSG, 'OK', true, false);
//       }
//     } catch (error) {
//       setLoading(false);
//       popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);

//     }
//   }

//   const handleRedirect = async (userName) => {
//     setLoading(true);
//     await setUrlInGlobal(url);
//     try {
//       let obj1 = {
//         "username": userName,
//         "password": newPassword,
//       };
//       console.log("hittin login api obj ==> ", obj1)
//       let loginAPIObj = await APIServiceCall.loginUserAPIService(obj1);

//       if (loginAPIObj.error) {
//         popUpAction(loginAPIObj.error, Constant.DefaultAlert_MSG, 'OK', true, false);
//       } else if (loginAPIObj.statusData) {
//         console.log("Response data =====>", loginAPIObj.responseData.userName)
//         await AsyncStorage.setItem('userDisplayName', loginAPIObj.responseData.userName);
//         await AsyncStorage.setItem('admin', loginAPIObj.responseData.admin);
//         await AsyncStorage.setItem('userName', userName);
//         await AsyncStorage.setItem('userPsd', newPassword);

//         if (loginAPIObj?.responseData?.userRoleId) await AsyncStorage.setItem('userId', (loginAPIObj.responseData.userId.toString()));

//         if (loginAPIObj?.responseData?.userRoleId) await AsyncStorage.setItem('roleId', (loginAPIObj.responseData.userRoleId.toString()));
//         if (loginAPIObj?.responseData?.usercompanyId) await AsyncStorage.setItem('companyId', (loginAPIObj.responseData.usercompanyId.toString()));
//         if (loginAPIObj?.responseData?.company) await AsyncStorage.setItem('companyObj', JSON.stringify(loginAPIObj.responseData.company));

//         if (true) {
//           await AsyncStorage.setItem('save_username', userName);
//           await AsyncStorage.setItem('save_password', newPassword);
//           await AsyncStorage.setItem('save_code', code);
//         } else {
//           await AsyncStorage.removeItem('save_username');
//           await AsyncStorage.removeItem('save_password');
//           await AsyncStorage.removeItem('save_code');
//         }
//         // set_userName('');
//         // set_userPswd('');
//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'Main' }],
//         });
//       } else {
//         popUpAction(Constant.LOGIN_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
//       }

//     } catch (error) {
//       console.log('handleLogin Error ', error);
//       popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
//     }

//     setLoading(false);
//   }

//   // const signInAction = () => {
//   //   navigation.navigate('EnterOtp');
//   // };

//   const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
//     set_popUpMessage(popMsg);
//     set_popUpAlert(popAlert);
//     set_popUpRBtnTitle(rBtnTitle);
//     set_isPopupLeft(isPopLeft);
//     set_isPopUp(isPopup);
//   };

//   const popOkBtnAction = () => {
//     popUpAction(undefined, undefined, '', false, false)
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
//         <View style={styles.mainComponentStyle}>
//           <View style={styles.headerViewStyle}>
//             <Text style={styles.headerTextStyle}>{Constant.SET_NEW_PASSWORD_LABEL}</Text>
//           </View>

//           <View style={styles.modelViewStyle}>

//             <View style={[CommonStyles.textInputContainerStyle, { marginTop: hp('2%'), alignSelf: 'center' }]}>
//               <View style={{ width: wp('73%') }}>
//                 <Text style={CommonStyles.psdHeaderTextStyle}>{Constant.SET_NEW_PSWD}</Text>
//                 <TextInput
//                   style={styles.textInputStyleLogin}
//                   underlineColorAndroid="transparent"
//                   placeholderTextColor="#7F7F81"
//                   autoCapitalize="none"
//                   secureTextEntry={showPassword1}
//                   value={newPassword}
//                   onChangeText={(userPswd) => setNewPassword(userPswd)}
//                 />
//               </View>

//               <TouchableOpacity onPress={() => setshowPassword1(!showPassword1)}>
//                 <Image source={showPassword1 ? hideImg : openImg} style={CommonStyles.hideOpenIconStyle} />
//               </TouchableOpacity>

//             </View>
//             <View style={[CommonStyles.textInputContainerStyle, { marginTop: hp('2%'), alignSelf: 'center' }]}>
//               <View style={{ width: wp('73%') }}>
//                 <Text style={CommonStyles.psdHeaderTextStyle}>{Constant.CONFIRM_NEW_PSWD}</Text>
//                 <TextInput
//                   style={styles.textInputStyleLogin}
//                   underlineColorAndroid="transparent"
//                   placeholderTextColor="#7F7F81"
//                   autoCapitalize="none"
//                   secureTextEntry={showPassword2}
//                   value={confirmNewPassword}
//                   onChangeText={(userPswd) => setConfirmNewPassword(userPswd)}
//                 />
//               </View>

//               <TouchableOpacity onPress={() => setshowPassword2(!showPassword2)}>
//                 <Image source={showPassword2 ? hideImg : openImg} style={CommonStyles.hideOpenIconStyle} />
//               </TouchableOpacity>

//             </View>



//             <View style={{ width: wp('90%'), alignSelf: 'center', marginTop: hp('2%') }}>
//               <TouchableOpacity
//                 style={styles.loginBtnStyle}
//                 onPress={handleSetNewPassword}
//                 disabled={loading}
//               >

//                 {loading ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Text style={CommonStyles.btnTextStyle}> {Constant.SAVE_LABEL}</Text>
//                 )}

//               </TouchableOpacity>
//             </View>
//           </View>

//           {isPopUp ? (
//             <View style={CommonStyles.customPopUpStyle}>
//               <AlertComponent
//                 header={popUpAlert}
//                 message={popUpMessage}
//                 isLeftBtnEnable={false}
//                 isRightBtnEnable={true}
//                 leftBtnTilte={'NO'}
//                 rightBtnTilte={popUpRBtnTitle}
//                 popUpRightBtnAction={popOkBtnAction}
//               />
//             </View>
//           ) : null}

//           {loading && (
//             <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} isButtonEnable={false} />
//           )}
//         </View>
//       </KeyboardAwareScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default ConfirmPassword;

// const styles = StyleSheet.create({
//   mainComponentStyle: {
//     flex: 1,
//     backgroundColor: '#5177c0',
//     alignItems: 'center',
//   },
//   headerViewStyle: {
//     height: hp('6%'),
//     width: wp('80%'),
//     marginTop: hp('20%'),
//   },
//   headerTextStyle: {
//     fontSize: 20,
//     fontWeight: '400',
//     color: 'white',
//     opacity: 0.6,
//   },
//   modelViewStyle: {
//     flex: 1,
//     width: wp('100%'),
//     backgroundColor: 'white',
//     borderTopRightRadius: 50,
//     borderTopLeftRadius: 50,
//     height: '70%',
//     position: 'absolute',
//     bottom: 0,
//     paddingHorizontal: wp('5%'),
//     paddingTop: hp('5%'),
//   },
//   loginBtnStyle: {
//     height: hp('8%'),
//     width: wp('80%'),
//     backgroundColor: '#436bba',
//     alignSelf: 'center',
//     borderRadius: 10,
//     marginTop: hp('5%'),
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 55,
//   },
//   textInputStyleLogin: {
//     flex: 1,
//     color: 'black',
//     height: hp('5%'),
//     fontSize: 14,
//     fontWeight: '400',
//   },
// });


import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Image, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Constant from './../../utils/constants/constant';
import CommonStyles from './../../utils/commonStyles/commonStyles';
import LoaderComponent from './../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../utils/commonComponents/alertComponent';
import { RESET_PASSWORD } from '../../utils/apiCalls/apiCallsComponent';
import axios from 'axios';
import * as APIServiceCall from './../../utils/apiCalls/apiCallsComponent';
import { setUrlInGlobal } from '../../config/environment/environmentConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import color from '../../utils/commonStyles/color';


let hideImg = require('./../../../assets/images/png/hide-password.png');
let openImg = require('./../../../assets/images/png/show-password.png');
let Logo = require('./../../../assets/images/png/Logo.png');

const ConfirmPassword = ({ navigation, route, ...props }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [url, setUrl] = useState('');
  const [otpStr, setotpStr] = useState('');
  const [showPassword1, setshowPassword1] = useState(true);
  const [showPassword2, setshowPassword2] = useState(true);

  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState('');
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [code, setcode] = useState('')


  useEffect(() => {
    if (route?.params) {
      console.log("route.params ===> ", route.params);

      setEmail(route.params?.email);
      setotpStr(route.params?.otp);
      setUrl(route.params?.url);
      setcode(route.params?.serverCode);
    }

  }, [route.params]);

  const handleSetNewPassword = async () => {
    setLoading(true);
    if (!newPassword || !confirmNewPassword) {
      setLoading(false);
      popUpAction(Constant.ALL_FIELDS, Constant.DefaultAlert_MSG, 'OK', true, false);

      return;
    }
    if (newPassword !== confirmNewPassword) {
      setLoading(false);
      popUpAction(Constant.PSWD_NOT_MATCH, Constant.DefaultAlert_MSG, 'OK', true, false);


      return;
    }

    // if (newPassword.length < 8) {
    //   setLoading(false);
    //   popUpAction(Constant.PSWD_MIN_LENG, Constant.DefaultAlert_MSG, 'OK', true, false);
    //   return;
    // }

    const reqBody = {
      email: email,
      otp: otpStr,
      password: newPassword,
    };

    try {
      const apiUrl = url + RESET_PASSWORD;
      console.log("API URL ==> ", apiUrl);
      const response = await axios.post(apiUrl, reqBody);
      setLoading(false);
      console.log('API Response:', response?.data);

      const res = response?.data;

      if (res.user_login_Id && res.loginType === "true") {
        // popUpAction(Constant.PSWD_SET_SUCC, Constant.DefaultAlert_MSG, 'OK', true, false);

        Alert.alert(Constant.DefaultAlert_MSG, Constant.PSWD_SET_SUCC);
        handleRedirect(res.user_login_Id);
        // navigation.navigate('LoginComponent');

      } else if (res.user_login_Id === "" && res.loginType === "Given OTP is invalid...Please check") {
        popUpAction(Constant.EXPIRED_OTP, Constant.DefaultAlert_MSG, 'OK', true, false);
      } else {
        popUpAction(Constant.ERROR_OCCURED, Constant.DefaultAlert_MSG, 'OK', true, false);
      }
    } catch (error) {
      setLoading(false);
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);

    }
  }

  const handleRedirect = async (userName) => {
    setLoading(true);
    await setUrlInGlobal(url);
    try {
      let obj1 = {
        "username": userName,
        "password": newPassword,
      };
      console.log("hittin login api obj ==> ", obj1)
      let loginAPIObj = await APIServiceCall.loginUserAPIService(obj1);

      if (loginAPIObj.error) {
        popUpAction(loginAPIObj.error, Constant.DefaultAlert_MSG, 'OK', true, false);
      } else if (loginAPIObj.statusData) {
        console.log("Response data =====>", loginAPIObj.responseData.userName)
        await AsyncStorage.setItem('userDisplayName', loginAPIObj.responseData.userName);
        await AsyncStorage.setItem('admin', loginAPIObj.responseData.admin);
        await AsyncStorage.setItem('userName', userName);
        await AsyncStorage.setItem('userPsd', newPassword);

        if (loginAPIObj?.responseData?.userRoleId) await AsyncStorage.setItem('userId', (loginAPIObj.responseData.userId.toString()));

        if (loginAPIObj?.responseData?.userRoleId) await AsyncStorage.setItem('roleId', (loginAPIObj.responseData.userRoleId.toString()));
        if (loginAPIObj?.responseData?.usercompanyId) await AsyncStorage.setItem('companyId', (loginAPIObj.responseData.usercompanyId.toString()));
        if (loginAPIObj?.responseData?.company) await AsyncStorage.setItem('companyObj', JSON.stringify(loginAPIObj.responseData.company));

        if (true) {
          await AsyncStorage.setItem('save_username', userName);
          await AsyncStorage.setItem('save_password', newPassword);
          await AsyncStorage.setItem('save_code', code);
        } else {
          await AsyncStorage.removeItem('save_username');
          await AsyncStorage.removeItem('save_password');
          await AsyncStorage.removeItem('save_code');
        }
        // set_userName('');
        // set_userPswd('');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        popUpAction(Constant.LOGIN_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
      }

    } catch (error) {
      console.log('handleLogin Error ', error);
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    setLoading(false);
  }

  // const signInAction = () => {
  //   navigation.navigate('EnterOtp');
  // };

  const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  };

  const popOkBtnAction = () => {
    popUpAction(undefined, undefined, '', false, false)
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.mainComponentStyle}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} />
        </View>

        <Text style={styles.title}>
          {/* <Text style={styles.titleHighlight}>C</Text>-Edge */}
          Set New Password
        </Text>


        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
            style={[
              styles.input,
              Platform.OS === 'ios' && {paddingVertical: 12}, // Apply padding only for iOS
            ]}
              placeholder="New Password"
              placeholderTextColor="#7F7F81"
              // style={styles.input}
              secureTextEntry={showPassword1}
                   value={newPassword}
                   onChangeText={(userPswd) => setNewPassword(userPswd)}
            />
            {/* <Image source={emailImg} style={styles.inputIcon} /> */}
            <TouchableOpacity onPress={() => setshowPassword1(!showPassword1)} >
                <Image source={showPassword1 ? hideImg : openImg} style={CommonStyles.hideOpenIconStyle} />
               </TouchableOpacity>
          </View>
        </View>



        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
            style={[
              styles.input,
              Platform.OS === 'ios' && {paddingVertical: 12}, // Apply padding only for iOS
            ]}
              placeholder="Confirm Password"
              placeholderTextColor="#7F7F81"
              // style={styles.input}
              secureTextEntry={showPassword2}
                   value={confirmNewPassword}
                  onChangeText={(userPswd) => setConfirmNewPassword(userPswd)}
            />
               <TouchableOpacity onPress={() => setshowPassword2(!showPassword2)}>
                 <Image source={showPassword2 ? hideImg : openImg} style={CommonStyles.hideOpenIconStyle} />
               </TouchableOpacity>
          </View>
        </View>
       

                     <TouchableOpacity
                style={styles.loginBtnStyle}
                onPress={handleSetNewPassword}
                disabled={loading}
              >

                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={CommonStyles.btnTextStyle}> {Constant.SAVE_LABEL}</Text>
                )}

              </TouchableOpacity>


              <View style={{justifyContent: 'flex-end', flex: 1, marginVertical: 10}}>
          <Text style={{textAlign: 'center', color: '#000', marginBottom: 5}}>
            All rights with Codeverse Technologies
          </Text>
        </View>
        


             {isPopUp ? (
            <View style={CommonStyles.customPopUpStyle}>
              <AlertComponent
                header={popUpAlert}
                message={popUpMessage}
                isLeftBtnEnable={false}
                isRightBtnEnable={true}
                leftBtnTilte={'NO'}
                rightBtnTilte={popUpRBtnTitle}
                popUpRightBtnAction={popOkBtnAction}
              />
            </View>
          ) : null}

          {loading && (
            <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} isButtonEnable={false} />
          )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ConfirmPassword;

const styles = StyleSheet.create({
  mainComponentStyle: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 60, // To add space for the logo at the top
  },

  // Positioning the logo at the top-left corner
  logoContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  logo: {
    height: 90,
    width: 120,
    resizeMode: 'contain',
  },

  // Centering the "C-Edge" title
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: color.color2,
    fontFamily: 'serif',
    marginBottom: 30,
    marginTop: 60,
  },
  titleHighlight: {
    color: '#3BC3FF',
    fontWeight: '600',
    fontFamily: 'serif',
  },

  inputContainer: {
    width: '80%',
    marginVertical: 10,
    

  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderRadius: 25,
    borderColor: '#DDD',
    borderWidth: 1,
    paddingHorizontal: 15,
    elevation:5,
  },
  inputIcon: {
    width: 20,
    height: 20,
    tintColor: color.color2,
    // tintColor: '#000',
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },

  // Remember Me and Forgot Password Section
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    padding: 5,
    color: '#000',
  },
  forgotPasswordText: {
    color: '#000',
    fontSize: 14,
  },

  // Login Button
  loginBtnStyle: {
    width: '80%',
    backgroundColor: color.color2,
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
  },
});
