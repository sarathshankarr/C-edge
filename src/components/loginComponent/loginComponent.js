import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import LoginUI from './loginUI';
import * as APIServiceCall from './../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CUSTOMER_URL } from '../../config/environment/environmentConfig';
import { isValidUrl } from '../../utils/helper/helper';
import { setUrlInGlobal } from '../../config/environment/environmentConfig';
import axios from 'axios';
import useOnlineStatus from '../../utils/Hooks/useOnlineStatus';


const LoginComponent = ({ navigation, route, ...props }) => {

  const [isHidePassword, set_isHidePassword] = useState(true);
  const [code, set_code] = useState('');
  const [userName, set_userName] = useState('');
  const [userPswd, set_userPswd] = useState('');
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState('');
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const onlineStatus = useOnlineStatus();


  const validatePassword = (psdValue) => {
    set_userPswd(psdValue);
  };

  const validateUser = (user) => {
    set_userName(user);
  };

  useEffect(() => {
    const loadStoredCredentials = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('save_username');
        const storedPassword = await AsyncStorage.getItem('save_password');
        const storedCode = await AsyncStorage.getItem('save_code');

        if (storedUsername && storedPassword && storedCode) {
          set_userName(storedUsername);
          set_userPswd(storedPassword);
          set_code(storedCode);
          setIsChecked(true);
        }
      } catch (error) {
        console.error('Error loading stored credentials:', error);
      }
    };

    loadStoredCredentials();
  }, []);

  const getCustomercode = async () => {
    set_isLoading(true);
    handleEmptyInputs();
    try {
      const response = await axios.get(CUSTOMER_URL + code);
      set_isLoading(false);
      console.log('API Response:', response?.data?.response?.url);
      if (isValidUrl(response?.data?.response?.url)) {
        await setUrlInGlobal(response?.data?.response?.url);
        handleLogin();
        console.log("Success");
      } else {
        popUpAction(Constant.Wrong_Code_Msg, Constant.DefaultAlert_MSG, 'OK', true, false)
      }
    } catch (error) {
      set_isLoading(false);
      if (error.response && error.response.status === 400) {
        popUpAction(Constant.Wrong_Code_Msg, Constant.DefaultAlert_MSG, 'OK', true, false)
      } else if (error.response && (error.response.status === 502 || error.response.status === 404)) {
        popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
      }
    }
  };


  const handleEmptyInputs = () => {

    setErrorMsg([]);

    if (code.trim().length === 0) {
      setErrorMsg(prevErrors => [...prevErrors, 'no_Code']);
    }

    if (userName.trim().length === 0) {
      setErrorMsg(prevErrors => [...prevErrors, 'no_Username']);
    }

    // Check for empty password
    if (userPswd.trim().length === 0) {
      setErrorMsg(prevErrors => [...prevErrors, 'no_Password']);
    }


  }

  const handleLogin = async () => {
    set_isLoading(true);

    try {
      let obj1 = {
        "username": userName,
        "password": userPswd,
      };

      let loginAPIObj = await APIServiceCall.loginUserAPIService(obj1);

      if (loginAPIObj.error) {
        popUpAction(loginAPIObj.error, Constant.DefaultAlert_MSG, 'OK', true, false);
      } else if (loginAPIObj.statusData) {
        console.log("Response data =====>", loginAPIObj.responseData.userName)
        await AsyncStorage.setItem('userDisplayName', loginAPIObj.responseData.userName);
        await AsyncStorage.setItem('role_name', loginAPIObj?.responseData?.role_name ? loginAPIObj?.responseData?.role_name : "USER");
        await AsyncStorage.setItem('userName', userName);
        await AsyncStorage.setItem('userPsd', userPswd);

        if (loginAPIObj?.responseData?.userRoleId) await AsyncStorage.setItem('userId', (loginAPIObj.responseData.userId.toString()));

        if (loginAPIObj?.responseData?.userRoleId) await AsyncStorage.setItem('roleId', (loginAPIObj.responseData.userRoleId.toString()));
        if (loginAPIObj?.responseData?.usercompanyId) await AsyncStorage.setItem('companyId', (loginAPIObj.responseData.usercompanyId.toString()));
        if (loginAPIObj?.responseData?.company) await AsyncStorage.setItem('companyObj', JSON.stringify(loginAPIObj.responseData.company));
        if (loginAPIObj?.responseData?.companyMap) {
          if (loginAPIObj?.responseData?.companyIds === "0") {
            await AsyncStorage.setItem('CompaniesList', JSON.stringify(loginAPIObj.responseData.companyMap));
          } else {
            const companyList = extractCompanyList(loginAPIObj?.responseData?.companyIds, loginAPIObj.responseData.companyMap);
            await AsyncStorage.setItem('CompaniesList', JSON.stringify(companyList));
          }
        }
        if (loginAPIObj?.responseData?.locIds) await AsyncStorage.setItem('locIds', (loginAPIObj.responseData.locIds));
        if (loginAPIObj?.responseData?.companyIds) await AsyncStorage.setItem('companyIds', (loginAPIObj.responseData.companyIds));
        if (loginAPIObj?.responseData?.brandIds) await AsyncStorage.setItem('brandIds', (loginAPIObj.responseData.brandIds));

        if (loginAPIObj?.responseData?.locIds && loginAPIObj?.responseData?.usercompanyId) {

          const extractedLocationIds = await Constant.extractLocationIds(loginAPIObj?.responseData?.locIds, loginAPIObj?.responseData?.usercompanyId)
          console.log("CurrentCompanyLocations", extractedLocationIds);
          await AsyncStorage.setItem('CurrentCompanyLocations', extractedLocationIds);
        }

        if (isChecked) {
          await AsyncStorage.setItem('save_username', userName);
          await AsyncStorage.setItem('save_password', userPswd);
          await AsyncStorage.setItem('save_code', code);
        } else {
          await AsyncStorage.removeItem('save_username');
          await AsyncStorage.removeItem('save_password');
          await AsyncStorage.removeItem('save_code');
        }
        set_userName('');
        set_userPswd('');
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

    set_isLoading(false);
  };


  const hidePassword = (value) => {
    set_isHidePassword(value);
  };

  const signInAction = () => {
    console.log("online status ===> ", onlineStatus)

    if (onlineStatus === false) {
      popUpAction(Constant.ONLINE_STATUS, Constant.DefaultAlert_MSG, 'OK', true, false);
      console.log("online status false ===> ", onlineStatus)
      return;
    } else {
      console.log("online status true ===> ", onlineStatus)
      getCustomercode();
    }
  };

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
  const handleForgotPassword = () => {
    // Alert.alert('Forgot password clicked');
    navigation.navigate('MailConfirmation');
    // navigation.navigate('EnterOtp');
    // navigation.navigate('ConfirmPassword');
  };

 
  const extractCompanyList = (companyIds, companyMap) => {

    const idsArray = companyIds.split(',').map(id => id.trim());

    const filtered = idsArray.reduce((acc, id) => {
      if (companyMap[id]) {
        acc[id] = companyMap[id];
      }
      return acc;
    }, {});

    return filtered;
  }

  return (

    <LoginUI
      isHidePassword={isHidePassword}
      code={code}
      isChecked={isChecked}
      errorMsg={errorMsg}
      set_code={set_code}
      setIsChecked={setIsChecked}
      userName={userName}
      userPswd={userPswd}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      validateUser={validateUser}
      validatePassword={validatePassword}
      hidePassword={hidePassword}
      signInAction={signInAction}
      popOkBtnAction={popOkBtnAction}
      handleForgotPassword={handleForgotPassword}
    />

  );

}

export default LoginComponent;