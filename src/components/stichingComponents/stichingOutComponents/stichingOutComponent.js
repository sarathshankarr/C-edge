import React, { useState} from 'react';
import StichingOutUI from './stichingOutUI';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
const StichingOutComponent = ({ navigation, route, ...props }) => {

  const [itemsArray, set_itemsArray] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  React.useEffect(() => {
    getInitialData(route.params?.styleId,route.params?.soId);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getInitialData(route.params?.styleId,route.params?.soId);
    }, [])
);

  const backBtnAction = () => {
    navigation.navigate('Main');
  };

  const getInitialData = async (styleId,soID) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');


    set_isLoading(true);
    let obj = {
      "menuId": 12,
      "searchKeyValue": "",
      "styleSearchDropdown": "-1",
      "dataFilter": "",
      "locIds": 0,
      "brandIds": 0,
      "compIds": usercompanyId,
      "fromRecord": 0,
      "toRecord": 999,
      "username": userName,
      "password" : userPsd
  }

    let stichingOutAPIObj = await APIServiceCall.stichingOutDetails(obj);
    set_isLoading(false);
    if(stichingOutAPIObj && stichingOutAPIObj.statusData){

      if(stichingOutAPIObj && stichingOutAPIObj.responseData){
        set_itemsArray(stichingOutAPIObj.responseData)
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(stichingOutAPIObj && stichingOutAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const actionOnRow = (item,index) => {
    navigation.navigate('SaveStichingOutComponent',{styleId:item.styleId,soId:item.soId});
    console.log('SaveStichingOutComponent=============',{item})
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

    <StichingOutUI
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

export default StichingOutComponent;