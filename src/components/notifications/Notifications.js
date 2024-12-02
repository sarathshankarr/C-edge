
import React, { useState } from 'react';
import * as APIServiceCall from '../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import NotificationsUI from './NotificationsUI';

const Notifications = ({ navigation, route, ...props }) => {

  const [itemsArray, set_itemsArray] = useState([]);
  const [latestId, set_latestId] = useState(0);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);


  React.useEffect(() => {
    loadAllNotifications();
  }, []);



  const backBtnAction = () => {
    navigation.navigate('Main');
    if(latestId){
      UpdateUnreadMessages();
    }
  };


  const loadAllNotifications = async () => {

    // let userName = await AsyncStorage.getItem('userName');
    // let userPsd = await AsyncStorage.getItem('userPsd');
    let userId = await AsyncStorage.getItem('userId');
    let roleId = await AsyncStorage.getItem('roleId');
    let companyId = await AsyncStorage.getItem('companyId');

    set_isLoading(true);
    let obj = {
      "userId": userId,
      "roleId": roleId,
      "companyId": companyId
    }


    let GETNOTIFICATIONSAPIObj = await APIServiceCall.loadAllNotifications(obj);
    set_isLoading(false);

    if (GETNOTIFICATIONSAPIObj && GETNOTIFICATIONSAPIObj.statusData) {

      if (GETNOTIFICATIONSAPIObj && GETNOTIFICATIONSAPIObj.responseData) {
        set_itemsArray(GETNOTIFICATIONSAPIObj.responseData);
        set_latestId(GETNOTIFICATIONSAPIObj.responseData[0]?.id || 0);
        // console.log("latest id ==> ", GETNOTIFICATIONSAPIObj.responseData[0]?.id);
      }
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (GETNOTIFICATIONSAPIObj && GETNOTIFICATIONSAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const UpdateUnreadMessages = async () => {

    // let userName = await AsyncStorage.getItem('userName');
    // let userPsd = await AsyncStorage.getItem('userPsd');
    let userId = await AsyncStorage.getItem('userId');
    let roleId = await AsyncStorage.getItem('roleId');
    let companyId = await AsyncStorage.getItem('companyId');


    let Obj = {
      "userId": userId,
      "roleId": roleId,
      "companyId": companyId,
      "msgId": latestId,
    }

    set_isLoading(true);
    let UPDATEREADMSGSAPIObj = await APIServiceCall.UpdateUnreadMessages(Obj);
    // console.log('UPDATEReadMSGS,', UPDATEREADMSGSAPIObj)
    set_isLoading(false);

    if (UPDATEREADMSGSAPIObj && UPDATEREADMSGSAPIObj.statusData && UPDATEREADMSGSAPIObj.responseData && UPDATEREADMSGSAPIObj.responseData.status !== 'False') {
      // backBtnAction();
      console.log("SUCESS")
    } else {
      popUpAction(Constant.Fail_Save_Dtls_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (UPDATEREADMSGSAPIObj && UPDATEREADMSGSAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const ClearAllNotifications = async () => {

    // let userName = await AsyncStorage.getItem('userName');
    // let userPsd = await AsyncStorage.getItem('userPsd');
    let userId = await AsyncStorage.getItem('userId');
    let roleId = await AsyncStorage.getItem('roleId');
    let companyId = await AsyncStorage.getItem('companyId');
    let Obj = {
      "userId": userId,
      "roleId": roleId,
      "companyId": companyId,
      "msgId": latestId,
      // "userId": 1,
      // "roleId": 1,
      // "companyId": 1,
      // "msgId": 1,
    }

    set_isLoading(true);
    let CLEARALLAPIOBJ = await APIServiceCall.ClearAllNotifications(Obj);
    // console.log('Clear All ', CLEARALLAPIOBJ)
    set_isLoading(false);

    if (CLEARALLAPIOBJ && CLEARALLAPIOBJ?.statusData && CLEARALLAPIOBJ?.responseData && CLEARALLAPIOBJ?.responseData.status !== 'False') {
      // backBtnAction();
      console.log("SUCESS=> Cleared")
    } else {
      popUpAction(Constant.Fail_Save_Dtls_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (CLEARALLAPIOBJ && CLEARALLAPIOBJ.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  }

  const popOkBtnAction1 = () => {
    console.log("Clicked on the 2 btns=>  clear");
    if (!latestId) {
      console.log("Nothing to Clear");
      popUpAction(undefined, undefined, '', false, false);
      return;
    };
    ClearAllNotifications();
    popUpAction(undefined, undefined, '', false, false);
  };
  const popOkBtnAction = () => {
    console.log("Clicked on the 1 btns=>  no clear");
    popUpAction(undefined, undefined, '', false, false);
  };
  
  const popCancelBtnAction = () => {
    console.log("Clicked on cancel btn");
    popUpAction(undefined, undefined, '', false, false);
  };

  const actionOnRow = (item, index) => {
    console.log("Clicked on the row")
  };

  const handleClear = () => {
    popUpAction("Are you sure...you want to clear all messages?", "Alert !", "Yes", true, true);
    
  };

  return (

    <NotificationsUI
      itemsArray={itemsArray}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      actionOnRow={actionOnRow}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
      popOkBtnAction1={popOkBtnAction1}
      popCancelBtnAction={popCancelBtnAction}
      handleClear={handleClear}
    />

  );

}

export default Notifications;