// import React, { useEffect, useRef, useState } from 'react';
// import { View, StyleSheet, TouchableOpacity, Text, TextInput, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import * as Constant from './../../utils/constants/constant';
// import CommonStyles from './../../utils/commonStyles/commonStyles';
// import LoaderComponent from './../../utils/commonComponents/loaderComponent';
// import AlertComponent from './../../utils/commonComponents/alertComponent';
// import { CONFIRM_OTP, REQUEST_OTP } from '../../utils/apiCalls/apiCallsComponent';
// import axios from 'axios';

// const EnterOtp = ({ navigation, route, ...props }) => {

//   const [loading, setLoading] = useState(false);
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [resendDisabled, setResendDisabled] = useState(false);
//   const [timer, setTimer] = useState(30);
//   const [email, setEmail] = useState('');
//   const [url, setUrl] = useState('');
//   const inputRefs = useRef([]);
//   const [selection, setSelection] = useState({ start: 0, end: 1 });
//   const [code, setcode] = useState('')

//   const [isPopUp, set_isPopUp] = useState(false);
//   const [popUpMessage, set_popUpMessage] = useState('');
//   const [popUpAlert, set_popUpAlert] = useState(undefined);
//   const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
//   const [isPopupLeft, set_isPopupLeft] = useState(false);

//   useEffect(() => {
//     if (route?.params) {
//       console.log("route.params  ===> ", route.params);

//       setEmail(route.params?.email);
//       setUrl(route.params?.url);
//       setcode(route.params?.serverCode)
//     }

//   }, []);

//   const handleConfirmOtp = async () => {

//     const isOtpComplete = otp.every((digit) => digit !== '');

//     if (!isOtpComplete) {
//       popUpAction('Incomplete OTP.', Constant.DefaultAlert_MSG, 'OK', true, false);
//       return;
//     }

//     const otpStr = otp.join('');

//     const reqBody = {
//       email: email,
//       otp: otpStr,
//     };

//     try {
//       const apiUrl = url + CONFIRM_OTP;
//       console.log("API URL ==> ", apiUrl, reqBody);
//       const response = await axios.post(apiUrl, reqBody);

//       setLoading(false);

//       console.log('API Response:', response?.data);

//       const res = response?.data;

//       if (res === true) {
//         console.log("password validated  ")
//         navigation.navigate('ConfirmPassword', { email: email, otp: otpStr, url: url, serverCode:code });
//       } else if (res === "Given OTP is invalid...Please check") {
//         popUpAction(Constant.EXPIRED_OTP, Constant.DefaultAlert_MSG, 'OK', true, false);
//       } else {
//         popUpAction(Constant.ERROR_OCCURED, Constant.DefaultAlert_MSG, 'OK', true, false);
//       }
//     } catch (error) {
//       setLoading(false);
//       console.log("error ==> ", error)
//       popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
//     }
//   };

//   const handleResendOtp = async () => {
//     setResendDisabled(true);
//     setTimer(60);
//     const reqBody = {
//       email: email,
//       url: url,
//     };
//     try {
//       const apiUrl = url + REQUEST_OTP;
//       console.log("API URL====> ", apiUrl, reqBody);
//       const response = await axios.post(apiUrl, reqBody);
//       setLoading(false);
//       console.log('API Response:', response?.data);

//       const res = response?.data;

//       if (res === true) {
//         popUpAction(Constant.OTP_SENT, Constant.DefaultAlert_MSG, 'OK', true, false);

//       } else {
//         popUpAction(Constant.ERROR_OCCURED, Constant.DefaultAlert_MSG, 'OK', true, false);

//       }
//     } catch (error) {
//       setLoading(false);
//       popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
//     }
//   };

//   useEffect(() => {
//     let interval;
//     if (resendDisabled) {
//       interval = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer <= 1) {
//             clearInterval(interval);
//             setResendDisabled(false);
//             return 0;
//           }
//           return prevTimer - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [resendDisabled]);

//   // const handleChange = (text, index) => {
//   //   let newOtp = [...otp];
//   //   // newOtp[index] = text.charAt(0)
//   //   newOtp[index] = text;
//   //   console.log("entered digit ===> ", text);

//   //   if (text && index < 5) {
//   //     inputRefs.current[index + 1].focus();
//   //   }

//   //   setOtp(newOtp);
//   // };

//   const handleKeyPress = (e, index) => {
//     if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }

//   };

//   const handleChange = (text, index) => {
//     let newOtp = [...otp];

//     console.log("Text value ==> ", index, text);

//     // newOtp[index] = text;
//     newOtp[index] = text.charAt(0);

//     setOtp(newOtp);

//     if (text && index < 5) {
//       inputRefs.current[index + 1].focus();
//     } else if (text === '' && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handleFocus = (index) => {
//     setSelection({ start: 0, end: 1 });
//     inputRefs.current[index].setNativeProps({
//       selection: { start: 0, end: 1 },
//     });
//   };

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
//             <Text style={styles.headerTextStyle}>{Constant.OTP_VERIFICATION_LABEL}</Text>
//           </View>

//           <View style={styles.modelViewStyle}>
//             <View style={styles.otpContainer}>
//               {otp.map((value, index) => (
//                 <TextInput
//                   key={index}
//                   style={styles.otpInput}
//                   keyboardType="numeric"
//                   maxLength={1}
//                   value={value}
//                   onChangeText={(text) => handleChange(text, index)}
//                   onKeyPress={(e) => handleKeyPress(e, index)}
//                   onFocus={() => handleFocus(index)}
//                   selection={selection}
//                   ref={(ref) => (inputRefs.current[index] = ref)}
//                 />
//               ))}
//             </View>

//             {/* Resend Button with Countdown */}
//             <TouchableOpacity
//               style={[styles.resendButton, resendDisabled && styles.disabledButton]}
//               onPress={handleResendOtp}
//               // onPress={handleTest}
//               disabled={resendDisabled}
//             >
//               <Text style={styles.resendText}>
//                 {resendDisabled ? `Resend in ${timer}s` : 'Resend Code'}
//               </Text>
//             </TouchableOpacity>

//             <View style={{ width: wp('90%'), alignSelf: 'center', marginTop: hp('2%') }}>
//               <TouchableOpacity
//                 style={styles.loginBtnStyle}
//                 onPress={handleConfirmOtp}
//                 disabled={loading}
//               >
//                 <Text style={CommonStyles.btnTextStyle}>{Constant.VERIFY_OTP_BTN_LABEL}</Text>
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

// export default EnterOtp;

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
//   otpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginVertical: 20,
//     // marginTop:50,
//     // width:'80%',
//     // alignItems:'center'
//   },
//   otpInput: {
//     borderWidth: 2,
//     borderColor: 'gray',
//     textAlign: 'center',
//     fontSize: 18,
//     width: 40,
//     marginHorizontal: 5,
//     borderRadius: 10,
//     color:'#000'
//   },
//   resendButton: {
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   resendText: {
//     color: '#1F74BA',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   disabledButton: {
//     opacity: 0.5,
//   },
// });

import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Constant from './../../utils/constants/constant';
import CommonStyles from './../../utils/commonStyles/commonStyles';
import LoaderComponent from './../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../utils/commonComponents/alertComponent';
import {CONFIRM_OTP, REQUEST_OTP} from '../../utils/apiCalls/apiCallsComponent';
import axios from 'axios';
import { ColorContext } from '../colorTheme/colorTheme';

let Logo = require('./../../../assets/images/png/Logo.png');

const EnterOtp = ({navigation, route, ...props}) => {

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const inputRefs = useRef([]);
  const [selection, setSelection] = useState({start: 0, end: 1});
  const [code, setcode] = useState('');

  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState('');
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);


  const { colors } = useContext(ColorContext);
  const styles = getStyles(colors);


  useEffect(() => {
    if (route?.params) {
      console.log('route.params  ===> ', route.params);

      setEmail(route.params?.email);
      setUrl(route.params?.url);
      setcode(route.params?.serverCode);
    }
  }, []);

  const handleConfirmOtp = async () => {
    const isOtpComplete = otp.every(digit => digit !== '');

    if (!isOtpComplete) {
      popUpAction(
        'Incomplete OTP.',
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
      return;
    }

    const otpStr = otp.join('');

    const reqBody = {
      email: email,
      otp: otpStr,
    };

    try {
      const apiUrl = url + CONFIRM_OTP;
      console.log('API URL ==> ', apiUrl, reqBody);
      const response = await axios.post(apiUrl, reqBody);

      setLoading(false);

      console.log('API Response:', response?.data);

      const res = response?.data;

      if (res === true) {
        console.log('password validated  ');
        navigation.navigate('ConfirmPassword', {
          email: email,
          otp: otpStr,
          url: url,
          serverCode: code,
        });
      } else if (res === 'Given OTP is invalid...Please check') {
        popUpAction(
          Constant.EXPIRED_OTP,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      } else {
        popUpAction(
          Constant.ERROR_OCCURED,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      }
    } catch (error) {
      setLoading(false);
      console.log('error ==> ', error);
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setTimer(60);
    const reqBody = {
      email: email,
      url: url,
    };
    try {
      const apiUrl = url + REQUEST_OTP;
      console.log('API URL====> ', apiUrl, reqBody);
      const response = await axios.post(apiUrl, reqBody);
      setLoading(false);
      console.log('API Response:', response?.data);

      const res = response?.data;

      if (res === true) {
        popUpAction(
          Constant.OTP_SENT,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      } else {
        popUpAction(
          Constant.ERROR_OCCURED,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      }
    } catch (error) {
      setLoading(false);
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };

  useEffect(() => {
    let interval;
    if (resendDisabled) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendDisabled]);

  // const handleChange = (text, index) => {
  //   let newOtp = [...otp];
  //   // newOtp[index] = text.charAt(0)
  //   newOtp[index] = text;
  //   console.log("entered digit ===> ", text);

  //   if (text && index < 5) {
  //     inputRefs.current[index + 1].focus();
  //   }

  //   setOtp(newOtp);
  // };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleChange = (text, index) => {
    let newOtp = [...otp];

    console.log('Text value ==> ', index, text);

    // newOtp[index] = text;
    newOtp[index] = text.charAt(0);

    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (text === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleFocus = index => {
    setSelection({start: 0, end: 1});
    inputRefs.current[index].setNativeProps({
      selection: {start: 0, end: 1},
    });
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
    <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.mainComponentStyle}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} />
        </View>

        <Text style={styles.title}>
          {/* <Text style={styles.titleHighlight}>C</Text>-Edge */}
          Verify OTP
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={value}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              selection={selection}
              ref={ref => (inputRefs.current[index] = ref)}
            />
          ))}
        </View>

        {/* Resend Button with Countdown */}
        <TouchableOpacity
          style={[styles.resendButton, resendDisabled && styles.disabledButton]}
          onPress={handleResendOtp}
          // onPress={handleTest}
          disabled={resendDisabled}>
          <Text style={styles.resendText}>
            {resendDisabled ? `Resend in ${timer}s` : 'Resend Code'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginBtnStyle}
          onPress={handleConfirmOtp}
          disabled={loading}>
          <Text style={CommonStyles.btnTextStyle}>
            {Constant.VERIFY_OTP_BTN_LABEL}
          </Text>
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
          <LoaderComponent
            isLoader={true}
            loaderText={Constant.LOADER_MESSAGE}
            isButtonEnable={false}
          />
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default EnterOtp;

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
    color:colors.color2,
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

 
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
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
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    // marginTop:50,
    // width:'80%',
    // alignItems:'center'
  },
  otpInput: {
    borderWidth: 2,
    borderColor: 'gray',
    textAlign: 'center',
    fontSize: 18,
    width: 40,
    marginHorizontal: 5,
    borderRadius: 10,
    color: '#000',
  },
  resendButton: {
    marginVertical: 10,
    alignItems: 'center',
  },
  resendText: {
    color: colors.color2,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
