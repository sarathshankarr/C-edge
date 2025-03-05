// import React, { useState } from 'react';
// import { View, StyleSheet, TouchableOpacity, Text, TextInput, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import * as Constant from './../../utils/constants/constant';
// import CommonStyles from './../../utils/commonStyles/commonStyles';
// import LoaderComponent from './../../utils/commonComponents/loaderComponent';
// import AlertComponent from './../../utils/commonComponents/alertComponent';
// import { CUSTOMER_URL } from '../../config/environment/environmentConfig';
// import { REQUEST_OTP } from '../../utils/apiCalls/apiCallsComponent';
// import { isValidUrl } from '../../utils/helper/helper';
// import axios from 'axios';


// const MailConfirmation = ({ navigation, route, }) => {
//   const [email, setEmail] = useState('');
//   const [code, setCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [url, setUrl] = useState('');

//   const [isPopUp, set_isPopUp] = useState(false);
//   const [popUpMessage, set_popUpMessage] = useState('');
//   const [popUpAlert, set_popUpAlert] = useState(undefined);
//   const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
//   const [isPopupLeft, set_isPopupLeft] = useState(false);

//   // const signInAction = () => {
//   //   // navigation.navigate('LoginComponent');
//   // };

//   const handleGetOtp = async () => {

//     setLoading(true);

//     if (code?.trim()?.length === 0 || email?.trim()?.length === 0) {
//       popUpAction(Constant.ALL_FIELDS, Constant.DefaultAlert_MSG, 'OK', true, false);
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log("url for getting url==> ", CUSTOMER_URL, code)
//       const response = await axios.get(CUSTOMER_URL + code);
//       setLoading(false);
//       // console.log('API Response:', response?.data);
//       if (isValidUrl(response?.data?.response?.url)) {
//         const serverUrl = response?.data?.response?.url;
//         setUrl(serverUrl);
//         console.log("serverUrl===> ", serverUrl)
//         handleCallAPI(serverUrl);
//       } else {
//         popUpAction(Constant.CODE_VALIDATE_MSG, Constant.CODE_VALIDATE_HEADER, 'OK', true, false);
//       }
//     } catch (error) {
//       setLoading(false);
//       if (error.response?.status === 400) {
//         popUpAction(Constant.CODE_VALIDATE_MSG, Constant.CODE_VALIDATE_HEADER, 'OK', true, false);
//       } else if ([502, 404].includes(error.response?.status)) {
//         popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
//       } else {
//         popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);

//       }
//     }
//   }

//   const handleCallAPI = async (serverUrl) => {
//     setLoading(true);
//     const reqBody = {
//       email: email,
//       url: serverUrl,
//     };

//     console.log("entered handlecallApi", serverUrl, reqBody);
//     try {
//       const apiUrl = serverUrl + REQUEST_OTP;
//       console.log("API URL ====  >", apiUrl);
//       const response = await axios.post(apiUrl, reqBody);
//       setLoading(false);

//       console.log('API Response:', response?.data);
//       const res = response?.data;

//       if (res === true) {
//         // popUpAction(Constant.OTP_SENT, Constant.DefaultAlert_MSG, 'OK', true, false);

//         // setTimeout(() => {
//         //   navigation.navigate('EnterOtp', { email: email, url: serverUrl });
//         // }, 2000);

//         Alert.alert(Constant.DefaultAlert_MSG, Constant.OTP_SENT);
//         navigation.navigate('EnterOtp', { email: email, url: serverUrl , serverCode:code});

//       } else if (res === "Given email doesn't have an account...Please check") {
//         popUpAction(Constant.MAIL_NOT_FOUND, Constant.DefaultAlert_MSG, 'OK', true, false);
//       } else {
//         popUpAction(Constant.ERROR_OCCURED, Constant.DefaultAlert_MSG, 'OK', true, false);
//       }
//     } catch (error) {
//       setLoading(false);
//       popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);

//     }
//   }

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
//             <Text style={styles.headerTextStyle}>{Constant.LOGIN_FORGOT_BTN_LABEL}</Text>
//           </View>

//           <View style={styles.modelViewStyle}>
//             <View style={[CommonStyles.textInputContainerStyle, { marginTop: hp('5%'), alignSelf: 'center' }]}>
//               <View style={{ width: wp('79%') }}>
//                 <Text style={CommonStyles.psdHeaderTextStyle}>{Constant.CODE_LABEL_HEADER}</Text>
//                 <TextInput
//                   style={styles.textInputStyleLogin}
//                   underlineColorAndroid="transparent"
//                   placeholderTextColor="#7F7F81"
//                   autoCapitalize="none"
//                   value={code}
//                   onChangeText={(text) => setCode(text)}
//                 />
//               </View>
//             </View>

//             <View style={[CommonStyles.textInputContainerStyle, { marginTop: hp('5%'), alignSelf: 'center' }]}>
//               <View style={{ width: wp('79%') }}>
//                 <Text style={CommonStyles.psdHeaderTextStyle}>{Constant.EMAIL_LABEL_HEADER}</Text>
//                 <TextInput
//                   style={styles.textInputStyleLogin}
//                   underlineColorAndroid="transparent"
//                   placeholderTextColor="#7F7F81"
//                   autoCapitalize="none"
//                   value={email}
//                   onChangeText={(text) => setEmail(text)}
//                 />
//               </View>
//             </View>

//             <View style={{ width: wp('90%'), alignSelf: 'center', marginTop: hp('2%') }}>
//               <TouchableOpacity
//                 style={styles.loginBtnStyle}
//                 onPress={handleGetOtp}
//                 disabled={loading}
//               >
//                 <Text style={CommonStyles.btnTextStyle}>{Constant.GET_OTP_BTN_LABEL}</Text>
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

// export default MailConfirmation;

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

import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Constant from './../../utils/constants/constant';
import CommonStyles from './../../utils/commonStyles/commonStyles';
import LoaderComponent from './../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../utils/commonComponents/alertComponent';
import { CUSTOMER_URL } from '../../config/environment/environmentConfig';
import { REQUEST_OTP } from '../../utils/apiCalls/apiCallsComponent';
import { isValidUrl } from '../../utils/helper/helper';
import axios from 'axios';
import { ColorContext } from '../colorTheme/colorTheme';

let lock = require('./../../../assets/images/png/padlock.png');
let Logo = require('./../../../assets/images/png/Logo.png');
let emailImg = require('./../../../assets/images/png/email.png');


const MailConfirmation = ({ navigation, route, }) => {

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState('');
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  const { colors } = useContext(ColorContext);
  const styles = getStyles(colors);


  // const signInAction = () => {
  //   // navigation.navigate('LoginComponent');
  // };

  const handleGetOtp = async () => {

    setLoading(true);

    if (code?.trim()?.length === 0 || email?.trim()?.length === 0) {
      popUpAction(Constant.ALL_FIELDS, Constant.DefaultAlert_MSG, 'OK', true, false);
      setLoading(false);
      return;
    }

    try {
      console.log("url for getting url==> ", CUSTOMER_URL, code)
      const response = await axios.get(CUSTOMER_URL + code);
      setLoading(false);
      // console.log('API Response:', response?.data);
      if (isValidUrl(response?.data?.response?.url)) {
        const serverUrl = response?.data?.response?.url;
        setUrl(serverUrl);
        console.log("serverUrl===> ", serverUrl)
        handleCallAPI(serverUrl);
      } else {
        popUpAction(Constant.CODE_VALIDATE_MSG, Constant.CODE_VALIDATE_HEADER, 'OK', true, false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 400) {
        popUpAction(Constant.CODE_VALIDATE_MSG, Constant.CODE_VALIDATE_HEADER, 'OK', true, false);
      } else if ([502, 404].includes(error.response?.status)) {
        popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
      } else {
        popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);

      }
    }
  }

  const handleCallAPI = async (serverUrl) => {
    setLoading(true);
    const reqBody = {
      email: email,
      url: serverUrl,
    };

    console.log("entered handlecallApi", serverUrl, reqBody);
    try {
      const apiUrl = serverUrl + REQUEST_OTP;
      console.log("API URL ====  >", apiUrl);
      const response = await axios.post(apiUrl, reqBody);
      setLoading(false);

      console.log('API Response:', response?.data);
      const res = response?.data;

      if (res === true) {
        // popUpAction(Constant.OTP_SENT, Constant.DefaultAlert_MSG, 'OK', true, false);

        // setTimeout(() => {
        //   navigation.navigate('EnterOtp', { email: email, url: serverUrl });
        // }, 2000);

        Alert.alert(Constant.DefaultAlert_MSG, Constant.OTP_SENT);
        navigation.navigate('EnterOtp', { email: email, url: serverUrl , serverCode:code});

      } else if (res === "Given email doesn't have an account...Please check") {
        popUpAction(Constant.MAIL_NOT_FOUND, Constant.DefaultAlert_MSG, 'OK', true, false);
      } else {
        popUpAction(Constant.ERROR_OCCURED, Constant.DefaultAlert_MSG, 'OK', true, false);
      }
    } catch (error) {
      setLoading(false);
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);

    }
  }

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
          Forget Password
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
            style={[
              styles.input,
              Platform.OS === 'ios' && {paddingVertical: 12}, // Apply padding only for iOS
            ]}
              placeholder="Code"
              placeholderTextColor="#7F7F81"
              // style={styles.input}
              value={code}
              onChangeText={(text) => setCode(text)}
            />
            <Image source={lock} style={styles.inputIcon} />
          </View>
        </View>
       

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
            style={[
              styles.input,
              Platform.OS === 'ios' && {paddingVertical: 12}, // Apply padding only for iOS
            ]}
              placeholder="Email"
              placeholderTextColor="#7F7F81"
              // style={styles.input}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <Image source={emailImg} style={styles.inputIcon} />
          </View>
        </View>
        

        <TouchableOpacity
          style={styles.loginBtnStyle}
           onPress={handleGetOtp} disabled={loading}>
          <Text style={styles.loginBtnText}>{Constant.GET_OTP_BTN_LABEL}</Text>
        </TouchableOpacity>

        <View style={{justifyContent: 'flex-end', flex: 1, marginVertical: 10}}>
          <Text style={{textAlign: 'center', color: '#000', marginBottom: 5}}>
            All rights with Codeverse Technologies 1.0
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

export default MailConfirmation;

const getStyles = (colors) => StyleSheet.create({
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
    color: colors.color2,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
    }),
    marginBottom: 30,
    // textAlign: 'left',
    marginTop: 60,
  },
  titleHighlight: {
    color: '#3BC3FF',
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
    }),
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
    tintColor: colors.color2,
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
    backgroundColor: colors.color2,
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation:5,

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
