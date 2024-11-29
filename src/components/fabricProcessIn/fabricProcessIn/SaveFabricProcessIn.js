import React, { useState} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import SaveFabricProcessInUI from './SaveFabricProcessInUI';

const SaveFabricProcessIn = ({ navigation, route, ...props }) => {

    const [itemsObj, set_itemsObj] = useState([]);
    const [isLoading, set_isLoading] = useState(false);
    const [isPopUp, set_isPopUp] = useState(false);
    const [popUpMessage, set_popUpMessage] = useState(undefined);
    const [popUpAlert, set_popUpAlert] = useState(undefined);
    const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
    const [isPopupLeft, set_isPopupLeft] = useState(false);
    const [fptid, set_fptid] = useState(0);

  React.useEffect(() => {
    
    if(route.params) {
      if(route.params?.id) {
        getInitialData(route.params?.id);
        set_fptid(route.params?.id);
      } 
    }
    console.log("Route Params ===> ", route?.params)
    
  }, [route.params]);


  

  const backBtnAction = () => {
    navigation.goBack();
  };

  const getInitialData = async (id) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    set_isLoading(true);
    let obj = {
      "menuId": 588,
      "fptid":id,
      "username": userName,
      "password" : userPsd
    }      
    let EditFabricProcessInObj = await APIServiceCall.getEditDetailsOfFabricProcessIn(obj);
    // console.log('Fabric process in edit  data ====> ,',JSON.stringify(EditFabricProcessInObj))
    set_isLoading(false);
    
    if(EditFabricProcessInObj && EditFabricProcessInObj.statusData){
      set_itemsObj(EditFabricProcessInObj.responseData);
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(EditFabricProcessInObj && EditFabricProcessInObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const actionOnRow = (item,index) => {
    navigation.navigate('FabricMainComponent',{styleId:item.styleId});
  };

  const popUpAction = (popMsg, popAlert,rBtnTitle,isPopup,isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  };

  const popOkBtnAction = () => {
    popUpAction(undefined,undefined,'', false,false)
  };


  const submitAction = (Obj) => {

    saveFinishingOutData(Obj);

  };

  const saveFinishingOutData = async (tempObj) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');

    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.menuId=588;
    tempObj.fptid=fptid;
    tempObj.fpt_id=fptid;

    console.log(" edit saving Obj ===> ", tempObj);

    // return ;

    set_isLoading(true);   
    let saveEditFPI = await APIServiceCall.SaveFabricProcessInDetails(tempObj);
    set_isLoading(false);
    
    if(saveEditFPI && saveEditFPI.statusData && saveEditFPI.responseData ){
      backBtnAction();
    } else {
      popUpAction(Constant.Fail_Save_Dtls_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(saveEditFPI && saveEditFPI.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  return (
    <SaveFabricProcessInUI
      itemsObj = {itemsObj}
      isLoading = {isLoading}
      popUpAlert = {popUpAlert}
      popUpMessage = {popUpMessage}
      popUpRBtnTitle = {popUpRBtnTitle}
      isPopupLeft = {isPopupLeft}
      isPopUp = {isPopUp}
      backBtnAction = {backBtnAction}
      actionOnRow = {actionOnRow}
      popOkBtnAction = {popOkBtnAction}
      submitAction = {submitAction}
    />

  );

}

export default SaveFabricProcessIn;