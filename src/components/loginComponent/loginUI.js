// import React from 'react';
// import { View, StyleSheet, TouchableOpacity, Text, TextInput, Image, Alert } from 'react-native';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import * as Constant from './../../utils/constants/constant';
// import CommonStyles from './../../utils/commonStyles/commonStyles';
// import LoaderComponent from './../../utils/commonComponents/loaderComponent';
// import AlertComponent from './../../utils/commonComponents/alertComponent';
// import CustomCheckBox from '../../utils/commonComponents/CustomCheckBox';

// let hideImg = require('./../../../assets/images/png/hide-password.png');
// let openImg = require('./../../../assets/images/png/show-password.png');

// const LoginUI = ({ route, ...props }) => {
//   const validatePassword = (psdValue) => {
//     props.validatePassword(psdValue);
//   };

//   const validateUser = (user) => {
//     props.validateUser(user);
//   };

//   const hidePassword = (value) => {
//     props.hidePassword(value);
//   };

//   const signInAction = () => {
//     props.signInAction();
//   };
//   const handleForgotPassword = () => {
//     props.handleForgotPassword();
//   };

//   const popOkBtnAction = () => {
//     props.popOkBtnAction();
//   };

//   const setCode = (code) => {
//     props.set_code(code);
//   };

//   const handleCheckBoxToggle = () => {
//     props.setIsChecked(!props.isChecked);
//   };

//   return (
//     <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
//       <View style={styles.mainComponentStyle}>
//         <View style={styles.headerViewStyle}>
//           <Text style={styles.headerTextStyle}>{Constant.Login_HEADER}</Text>
//         </View>

//         <View style={styles.modelViewStyle}>

//           <View style={[CommonStyles.textInputContainerStyle, { marginTop: hp('5%'), alignSelf: 'center' }]}>
//             <View style={{ width: wp('79%') }}>
//               <Text style={CommonStyles.psdHeaderTextStyle}>{Constant.CODE_LABEL_HEADER}</Text>
//               <TextInput
//                 style={styles.textInputStyleLogin}
//                 underlineColorAndroid="transparent"
//                 placeholderTextColor="#7F7F81"
//                 autoCapitalize="none"
//                 value={props.code}
//                 onChangeText={(text) => setCode(text)}
//               />
//             </View>
//           </View>
//           {props?.errorMsg?.includes('no_Code') && (
//             <Text style={styles.errorText}>Code is required</Text>
//           )}

//           <View style={[CommonStyles.textInputContainerStyle, { marginTop: hp('5%'), alignSelf: 'center' }]}>
//             <View style={{ width: wp('79%') }}>
//               <Text style={CommonStyles.psdHeaderTextStyle}>{Constant.LOGIN_LABEL_HEADER}</Text>
//               <TextInput
//                 style={styles.textInputStyleLogin}
//                 underlineColorAndroid="transparent"
//                 placeholderTextColor="#7F7F81"
//                 autoCapitalize="none"
//                 value={props.userName}
//                 onChangeText={(text) => validateUser(text)}
//               />
//             </View>
//           </View>
//           {props?.errorMsg?.includes('no_Username') && (
//             <Text style={styles.errorText}>Username is required</Text>
//           )}

//           <View style={[CommonStyles.textInputContainerStyle, { marginTop: hp('2%'), alignSelf: 'center' }]}>
//             <View style={{ width: wp('73%') }}>
//               <Text style={CommonStyles.psdHeaderTextStyle}>{Constant.PSWD_LABEL_HEADER}</Text>
//               <TextInput
//                 style={styles.textInputStyleLogin}
//                 underlineColorAndroid="transparent"
//                 placeholderTextColor="#7F7F81"
//                 autoCapitalize="none"
//                 secureTextEntry={props.isHidePassword}
//                 value={props.userPswd}
//                 onChangeText={(userPswd) => validatePassword(userPswd)}
//               />
//             </View>

//             <TouchableOpacity onPress={() => hidePassword(!props.isHidePassword)}>
//               <Image source={props.isHidePassword ? hideImg : openImg} style={CommonStyles.hideOpenIconStyle} />
//             </TouchableOpacity>

//           </View>
//           {props?.errorMsg?.includes('no_Password') && (
//             <Text style={styles.errorText}>Password is required</Text>
//           )}

//           {/* <View style={{ flexDirection: 'row', marginTop: hp('3%'), marginLeft: wp('5%'), alignItems: 'center' }}>

//             <CustomCheckBox isChecked={props.isChecked} onToggle={handleCheckBoxToggle} />
//             <Text style={{ padding: 5, fontSize: 14, marginLeft: hp('0.5%'), color:'#000000' }}>Remember Me</Text>
//           </View> */}
//            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('2%'), marginLeft: wp('5%'), alignItems: 'center'}}>
//               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                 <CustomCheckBox isChecked={props.isChecked} onToggle={handleCheckBoxToggle}  />
//                 <Text style={{ padding: 5, color: '#000' }}>Remember Me</Text>
//               </View>
//               <TouchableOpacity onPress={handleForgotPassword}>
//                 <Text style={{ padding: 5, color: '#000' }}>Forgot Password ?  </Text>
//               </TouchableOpacity>
//             </View>

//           <View style={{ width: wp('90%'), alignSelf: 'center', marginTop: hp('2%') }}>
//             <TouchableOpacity style={styles.loginBtnStyle} onPress={signInAction} disabled={props.isLoading}>
//               <Text style={CommonStyles.btnTextStyle}>{Constant.LOGIN_BTN_LABEL}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {props.isPopUp ? (
//           <View style={CommonStyles.customPopUpStyle}>
//             <AlertComponent
//               header={props.popUpAlert}
//               message={props.popUpMessage}
//               isLeftBtnEnable={props.isPopLeft}
//               isRightBtnEnable={true}
//               leftBtnTilte={'NO'}
//               rightBtnTilte={props.popUpRBtnTitle}
//               popUpRightBtnAction={popOkBtnAction}
//             />
//           </View>
//         ) : null}

//         {props.isLoading === true ? <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} isButtonEnable={false} /> : null}

//       </View>
//     </KeyboardAwareScrollView>
//   );
// };

// export default LoginUI;

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
//     bottom: 0,
//     position: 'absolute',
//     paddingHorizontal: wp('5%'),
//     paddingTop: hp('5%'),
//   },
//   loginBtnStyle: {
//     height: hp('8%'),
//     width: wp('80%'),
//     backgroundColor: '#436bba',
//     alignSelf: 'center',
//     borderRadius: 10,
//     marginTop: hp('2%'),
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical:55,
//   },
//   errorText: {
//     color: 'red',
//     marginLeft: wp('10%'),
//   },
//   textInputStyleLogin: {
//     flex: 1,
//     color: 'black',
//     height: hp('5%'),
//     fontSize: 14,
//     fontWeight: '400',
//   },
// });

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  TextInput,
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
import CustomCheckBox from '../../utils/commonComponents/CustomCheckBox';
import color from '../../utils/commonStyles/color';

let hideImg = require('./../../../assets/images/png/hide-password.png');
let openImg = require('./../../../assets/images/png/show-password.png');
let lock = require('./../../../assets/images/png/padlock.png');
let Logo = require('./../../../assets/images/png/Logo.png');
let email = require('./../../../assets/images/png/email.png');

const LoginUI = ({route, ...props}) => {
  const validatePassword = psdValue => {
    props.validatePassword(psdValue);
  };

  const validateUser = user => {
    props.validateUser(user);
  };

  const hidePassword = value => {
    props.hidePassword(value);
  };

  const signInAction = () => {
    props.signInAction();
  };
  const handleForgotPassword = () => {
    props.handleForgotPassword();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const setCode = code => {
    props.set_code(code);
  };

  const handleCheckBoxToggle = () => {
    props.setIsChecked(!props.isChecked);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.mainComponentStyle}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} />
        </View>

        <Text style={styles.title}>
          <Text style={styles.titleHighlight}>C</Text>-Edge
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Code"
              placeholderTextColor="#7F7F81"
              style={styles.input}
              value={props.code}
              onChangeText={text => setCode(text)}
            />
            <Image source={lock} style={styles.inputIcon} />
          </View>
        </View>
        {props?.errorMsg?.includes('no_Code') && (
          <Text style={[styles.errorText, {textAlign: 'right'}]}>
            Code is required
          </Text>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#7F7F81"
              style={styles.input}
              value={props.userName}
              onChangeText={text => validateUser(text)}
            />
            <Image source={email} style={styles.inputIcon} />
          </View>
        </View>
        {props?.errorMsg?.includes('no_Username') && (
          <Text style={styles.errorText}>Username/Email is required</Text>
        )}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Password"
              style={styles.input}
              value={props.userPswd}
              placeholderTextColor="#7F7F81"
              secureTextEntry={props.isHidePassword}
              onChangeText={userPswd => validatePassword(userPswd)}
            />
            <TouchableOpacity
              onPress={() => hidePassword(!props.isHidePassword)}>
              <Image
                source={props.isHidePassword ? hideImg : openImg}
                style={styles.inputIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        {props?.errorMsg?.includes('no_Password') && (
          <Text style={styles.errorText}>Password is required</Text>
        )}

        <View style={styles.rowContainer}>
          <View style={styles.rememberMeContainer}>
            <CustomCheckBox
              isChecked={props.isChecked}
              onToggle={handleCheckBoxToggle}
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </View>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password ? </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginBtnStyle}
          onPress={signInAction} disabled={props.isLoading}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>

        {props.isPopUp ? (
          <View style={CommonStyles.customPopUpStyle}>
            <AlertComponent
              header={props.popUpAlert}
              message={props.popUpMessage}
              isLeftBtnEnable={props.isPopLeft}
              isRightBtnEnable={true}
              leftBtnTilte={'NO'}
              rightBtnTilte={props.popUpRBtnTitle}
              popUpRightBtnAction={popOkBtnAction}
            />
          </View>
        ) : null}

        {props.isLoading === true ? (
          <LoaderComponent
            isLoader={true}
            loaderText={Constant.LOADER_MESSAGE}
            isButtonEnable={false}
          />
        ) : null}

        <View style={{justifyContent: 'flex-end', flex: 1, marginVertical: 10}}>
          <Text style={{textAlign: 'center', color: '#000', marginBottom: 5}}>
            All rights with Codeverse Technologies
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default LoginUI;

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
    fontSize: 36,
    fontWeight: '500',
    // color: '#888888',
    color: color.color2,
    // color: 'purple',
    // color: '#000',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 60,
    fontFamily:'serif'
  },
  titleHighlight: {
    color: '#3BC3FF',
    // color: 'purple',
    // color: color.color2,
    // color: '#000',

    fontWeight: '600',
    fontFamily: 'serif',
  },

  inputContainer: {
    width: '80%',
    marginVertical: 10,
    elevation:5,
    backgroundColor: '#F8FAFF',
    borderRadius: 25,

  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#F2F2F2',
    // backgroundColor: '#F2F2F2',
    borderRadius: 25,
    borderColor: '#DDD',
    // borderColor: '#E0E7FF',
    // borderColor: '#3B82F6',
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  inputIcon: {
    width: 20,
    height: 20,
    tintColor: color.color2,
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
