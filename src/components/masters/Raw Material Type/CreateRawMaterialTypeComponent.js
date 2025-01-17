import React, { useState, useEffect, useRef } from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import CreateRawMaterialTypeUI from './CreateRawMaterialTypeUI';

const CreateRawMaterialTypeComponent = ({ route }) => {
  const navigation = useNavigation();

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);




  const backBtnAction = () => {
    navigation.goBack();
  };



  const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  }

  const popOkBtnAction = () => {
    popUpAction(undefined, undefined, '', false, false)
  };

  const ValidateAction = async (type) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    let Obj={
     "menuid":82,
    "username": userName,
    "password": userPsd,
    "trimtype": type,
    "compIds" : usercompanyId,
    "company" :JSON.parse(companyObj),
    }

    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.validateRawMaterialTypeMasters(Obj);
    set_isLoading(false);

    console.log("Sucess before returned obj ", SAVEAPIObj);

    if (SAVEAPIObj && SAVEAPIObj?.statusData && SAVEAPIObj?.responseData !== 0) {
      console.log("Sucessfully saved ===> ");
      backBtnAction();
    } else {
      console.log("failed  saving =====> ")
      popUpAction(Constant.Fail_Save_Dtls_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (SAVEAPIObj && SAVEAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }
  };


  const submitAction = async (tempObj) => {

    // if(ValidateAction)

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    
    tempObj.menuid= 82;
    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.compIds = usercompanyId;
    tempObj.company = JSON.parse(companyObj);

    console.log("saving obj ==>", tempObj);


    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.saveCreateRawMaterialTypeMasters(tempObj);
    set_isLoading(false);

    console.log("Sucess before returned obj ", SAVEAPIObj);

    if (SAVEAPIObj && SAVEAPIObj?.statusData && SAVEAPIObj?.responseData !== 0) {
      console.log("Sucessfully saved ===> ");
      backBtnAction();
    } else {
      console.log("failed  saving =====> ")
      popUpAction(Constant.Fail_Save_Dtls_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (SAVEAPIObj && SAVEAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }


  };

  return (

    <CreateRawMaterialTypeUI
      isLoading={isLoading}
      popUpAction={popUpAction}
      set_isLoading={set_isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      submitAction={submitAction}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
    />

  );

}

export default CreateRawMaterialTypeComponent;




