import React, { useState } from 'react';
import ViewTimeSummaryUI from './viewTimeSummaryUI';
import * as APIServiceCall from './../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';


const ViewTimeSummaryComponent = ({ navigation, route, ...props }) => {

  const [itemObj, set_itemObj] = useState(undefined);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  const [itemsArray, set_itemsArray] = useState([]);

  React.useEffect(() => {

    if(route.params?.sId){
        getInitialData(route.params?.sId);
        console.log('Item Obj ',route.params?.sId)
    }

  }, [route.params?.sId]);

  const backBtnAction = () => {
    navigation.navigate('StyleDetailsComponent');
  };

  const getInitialData = async (id) => {

    set_isLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let obj = {
      "styleId":id,
      "oldOrNewProcess":0,
      "username": userName,
      "password" : userPsd,
    }

    let vTimeActionAPIObj = await APIServiceCall.vieTimeAction(obj);
    set_isLoading(false);
    console.log('ViewTimeAction ',vTimeActionAPIObj)
    if(vTimeActionAPIObj && vTimeActionAPIObj.statusData){

      if(vTimeActionAPIObj && vTimeActionAPIObj.responseData){
        set_itemsArray(vTimeActionAPIObj.responseData.styletimeandactionlist)
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(vTimeActionAPIObj && vTimeActionAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const actionOnRow = (item,index) => {
    // navigation.navigate('StyleDetailsComponent',{item:item});
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

    <ViewTimeSummaryUI
      itemsArray = {itemsArray}
      itemObj = {itemObj}
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

export default ViewTimeSummaryComponent;