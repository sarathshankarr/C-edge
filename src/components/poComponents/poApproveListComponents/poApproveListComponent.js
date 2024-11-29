import React, { useState, useEffect,useRef } from 'react';
import POApproveUI from './poApproveListUI';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

const POApproveListComponent = ({ navigation, route, ...props }) => {

  const [itemsArray, set_itemsArray] = useState();
    const [isLoading, set_isLoading] = useState(false);
    const [isPopUp, set_isPopUp] = useState(false);
    const [popUpMessage, set_popUpMessage] = useState(undefined);
    const [popUpAlert, set_popUpAlert] = useState(undefined);
    const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
    const [isPopupLeft, set_isPopupLeft] = useState(false);


  React.useEffect(() => {
    getInitialData();
    console.log("props ===>", props )
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getInitialData();
    }, [])
  );
  
  const backBtnAction = () => {
    navigation.navigate('Main');
  };

  const getInitialData = async () => {
    
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let locIds = await AsyncStorage.getItem('CurrentCompanyLocations');
    let brandIds = await AsyncStorage.getItem('brandIds');
    let usercompanyId = await AsyncStorage.getItem('companyId');

    set_isLoading(true);
    let obj = {
      "menuId": '4',
      "searchKeyValue": "Not Approved",
      "styleSearchDropdown": "Po_status",
      "dataFilter": "120Days", 
      "locIds": locIds ? locIds : 0,
      "brandIds":brandIds ? brandIds: 0 ,
      "compIds": usercompanyId,
      "fromRecord": 0,
      "toRecord": 999,
      "userName":userName,
      "userPwd": userPsd
  }

  console.log("list pos req obj ===> ", obj);

    let poEditAPIObj = await APIServiceCall.allPOAPIService(obj);
    set_isLoading(false);
    
    if(poEditAPIObj && poEditAPIObj.statusData){

      if(poEditAPIObj && poEditAPIObj.responseData){
        set_itemsArray(poEditAPIObj.responseData);
      }
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(poEditAPIObj && poEditAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

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
  };

  const actionOnRow = (item,index) => {
    navigation.navigate('POApprovalComponent',{item:item});
  };

  return (

    <POApproveUI
      itemsArray = {itemsArray}
      isLoading = {isLoading}
      popUpAlert = {popUpAlert}
      popUpMessage = {popUpMessage}
      popUpRBtnTitle = {popUpRBtnTitle}
      isPopupLeft = {isPopupLeft}
      isPopUp = {isPopUp}
      actionOnRow = {actionOnRow}
      backBtnAction = {backBtnAction}
      popOkBtnAction = {popOkBtnAction}
    />

  );

}

export default POApproveListComponent;