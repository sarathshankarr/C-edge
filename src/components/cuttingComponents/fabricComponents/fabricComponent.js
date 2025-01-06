import React, { useState} from 'react';
import { NativeModules, Platform,BackHandler,Linking } from 'react-native';
import FabricUI from './fabricUI';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
const FabricMainComponent = ({ navigation, route, ...props }) => {

const [itemsArray, set_itemsArray] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [trimFabric, set_trimFabric]=useState([]);

  const [styleId, set_styleId]=useState('');
  const [soId, set_soId]=useState('');


  React.useEffect(() => {  
    
    if(route.params?.styleId && route.params?.soId) {
      console.log("params ==> ", route.params?.styleId , route.params?.soId, typeof route.params?.soId);
      set_styleId(route.params?.styleId);
      set_soId(route.params?.soId);
        getInitialData(route.params?.styleId,route.params?.soId);
    }
    
  }, [route.params?.styleId,route.params?.soId]);

  useFocusEffect(
    React.useCallback(() => {
      if(route.params?.styleId && route.params?.soId) {
        getInitialData(route.params?.styleId,route.params?.soId);
    } 
    }, [])
);

  const backBtnAction = () => {
    navigation.navigate('CuttingMainComponent');
  };

  const getInitialData = async (id,sid) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
        "menuId": 9,
        "styleId":id,
        "soId":sid,
        "username": userName,
        "password" : userPsd,
        "compIds": usercompanyId,
        "company":JSON.parse(companyObj),
    }
    console.log( "styleId ",id,"soId ",  sid,)
    // console.log( "re body before getting fab details ==> ","start", obj, "end");


    let fabricAPIObj = await APIServiceCall.getFabricDetails(obj);
    set_isLoading(false);
    
    if(fabricAPIObj && fabricAPIObj.statusData){

      if(fabricAPIObj && fabricAPIObj.responseData){
        set_itemsArray([fabricAPIObj.responseData])
      } 
      if(fabricAPIObj && fabricAPIObj.responseData && fabricAPIObj.responseData.cuttingFabricDetailsList){
        set_trimFabric(fabricAPIObj.responseData.cuttingFabricDetailsList)
      } 
      

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(fabricAPIObj && fabricAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const actionOnRow = (item,index) => {
    item.styleId=styleId;
    item.soId=soId;
    // console.log("item selecetd ==> ", item);
    navigation.navigate('CuttingSaveComponent',{item:item})
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

  return (

    <FabricUI
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
      trimFabric={trimFabric}
    />

  );

}

export default FabricMainComponent;