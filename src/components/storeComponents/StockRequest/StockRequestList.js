import React, { useState} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import StockRequestListUI from './StockRequestListUI';
 

const StockRequestList = ({ navigation, route, ...props }) => {

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
    navigation.navigate('Main');
  };

  const getInitialData = async () => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    set_isLoading(true);
    let obj = {
      "searchKeyValue": "",
      "styleSearchDropdown": "-1",    
      "fromRecord": 0,
      "toRecord": 999,
      "username": userName,
      "password" : userPsd
  }

    let stockStylesAPIObj = await APIServiceCall.stockApproveListDetails(obj);
    set_isLoading(false);
    
    if(stockStylesAPIObj && stockStylesAPIObj.statusData){

      if(stockStylesAPIObj && stockStylesAPIObj.responseData){
        set_itemsArray(stockStylesAPIObj.responseData)
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(stockStylesAPIObj && stockStylesAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const actionOnRow = (item,index) => {
    navigation.navigate('StockRequestEdit',{item:item});
  };
  const create = () => {
    navigation.navigate('CreateStockRequest');
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

    <StockRequestListUI
      itemsArray = {itemsArray}
      isLoading = {isLoading}
      popUpAlert = {popUpAlert}
      popUpMessage = {popUpMessage}
      popUpRBtnTitle = {popUpRBtnTitle}
      isPopupLeft = {isPopupLeft}
      isPopUp = {isPopUp}
      create={create}
      backBtnAction = {backBtnAction}
      actionOnRow = {actionOnRow}
      popOkBtnAction = {popOkBtnAction}
    />
  );

}

export default StockRequestList;