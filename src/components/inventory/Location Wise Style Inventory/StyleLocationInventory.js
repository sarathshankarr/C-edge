import React, { useState} from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import StyleLocationInventoryUI from './StyleLocationInventoryUI';

const StyleLocationInventory = ({ navigation, route, ...props }) => {

  const [itemsArray, set_itemsArray] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  React.useEffect(() => {   
    getInitialData();
  }, []);

  const backBtnAction = () => {
    navigation.goBack();
  };

  const getInitialData = async () => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');

    set_isLoading(true);
    let obj = {
        "searchKeyValue": "",
        "styleSearchDropdown": "-1",//mandatory
        // "dataFilter": "120Days",
        "fromRecord": 0, //mandatory
        "toRecord": 999, //mandatory
        "userName": userName,  //mandatory
        "userPwd": userPsd ,  //mandatory
        "compIds": usercompanyId,

    }

    let styleLocationInvAPIObj = await APIServiceCall.styleLocationInvAPI(obj);
    set_isLoading(false);
    
    if(styleLocationInvAPIObj && styleLocationInvAPIObj.statusData){

      if(styleLocationInvAPIObj && styleLocationInvAPIObj.responseData){
        set_itemsArray(styleLocationInvAPIObj.responseData)
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(styleLocationInvAPIObj && styleLocationInvAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const actionOnRow = (item,index) => {
    console.log('actionOnRow class ', item)
  };

  const popUpAction = (popMsg, popAlert,rBtnTitle,isPopup,isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  }

  const popOkBtnAction = () => {
    popUpAction(undefined,undefined,'', false,false)
  }

  return (

    <StyleLocationInventoryUI
      itemsArray = {itemsArray}
      isLoading = {isLoading}
      popUpAlert = {popUpAlert}
      popUpMessage = {popUpMessage}
      popUpRBtnTitle = {popUpRBtnTitle}
      isPopupLeft = {isPopupLeft}
      isPopUp = {isPopUp}
      backBtnAction = {backBtnAction}
      actionOnRow = {actionOnRow}
      popOkBtnAction = {popOkBtnAction}
    />

  );

}

export default StyleLocationInventory;