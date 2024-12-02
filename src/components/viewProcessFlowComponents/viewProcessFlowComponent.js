import React, { useState} from 'react';
import { NativeModules, Platform,BackHandler,Linking } from 'react-native';
import ViewProcessFlowUI from './viewProcessFlowUi';
import * as APIServiceCall from './../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';


const ViewProcessFlowComponent = ({ navigation, route, ...props }) => {

  const [itemsArray, set_itemsArray] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  React.useEffect(() => {
    if(route.params?.sId){
      getInitialData(route.params?.sId);
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
      "styleId" : id,
      "process" :"singlestyle",
      "username": userName,
      "password" : userPsd,
    }

    let poEditAPIObj = await APIServiceCall.viewProcessFlow(obj);
    set_isLoading(false);
    console.log('ProcessFlow ',poEditAPIObj)
    if(poEditAPIObj && poEditAPIObj.statusData){

      if(poEditAPIObj && poEditAPIObj.responseData){
        set_itemsArray(poEditAPIObj.responseData)
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(poEditAPIObj && poEditAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const actionOnRow = (item,index) => {
    // navigation.navigate('StyleDetailsComponent',{sId:item.styleId});
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

    <ViewProcessFlowUI
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

export default ViewProcessFlowComponent;