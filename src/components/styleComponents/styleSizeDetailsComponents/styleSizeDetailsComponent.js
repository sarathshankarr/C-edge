import React, { useState} from 'react';
import { NativeModules, Platform,BackHandler,Linking } from 'react-native';
import StyleSizeDetailsUI from './styleSizeDetailsUI';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';


const StyleSizeDetailsComponent = ({ navigation, route, ...props }) => {

  const [itemObj, set_itemObj] = useState([]);
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
      "styleId":id,
      "username": userName,
      "password" : userPsd
    }

    let styleSDdetailsAPIObj = await APIServiceCall.styleSizeDetails(obj);
    set_isLoading(false);
    
    if(styleSDdetailsAPIObj && styleSDdetailsAPIObj.statusData){

      if(styleSDdetailsAPIObj && styleSDdetailsAPIObj.responseData){
        set_itemObj(styleSDdetailsAPIObj.responseData)
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(styleSDdetailsAPIObj && styleSDdetailsAPIObj.error) {
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

    <StyleSizeDetailsUI
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

export default StyleSizeDetailsComponent;