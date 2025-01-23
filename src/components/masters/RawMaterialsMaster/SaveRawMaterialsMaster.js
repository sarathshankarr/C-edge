import React, { useState} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import SaveRawMaterialsMasterUI from './SaveRawMaterialsMasterUI';

const SaveRawMaterialsMaster = ({ navigation, route, ...props }) => {

    const [itemsObj, set_itemsObj] = useState([]);
    const [isLoading, set_isLoading] = useState(false);
    const [isPopUp, set_isPopUp] = useState(false);
    const [popUpMessage, set_popUpMessage] = useState(undefined);
    const [popUpAlert, set_popUpAlert] = useState(undefined);
    const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
    const [isPopupLeft, set_isPopupLeft] = useState(false);
    const [trimconstructionId, set_trimconstructionId] = useState(0);

  React.useEffect(() => {
    
    if(route.params) {
      if(route.params.item?.trimconstruction_id) {
        console.log("Route Params ===> ", route?.params.item.trimconstruction_id);
        set_trimconstructionId(route?.params.item.trimconstruction_id);
        getInitialData(route.params?.item?.trimconstruction_id);
      } 
    }
    
  }, [route.params]);


  

  const backBtnAction = () => {
    navigation.goBack();
  };

  const getInitialData = async (id) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    set_isLoading(true);
    let obj = {
      "menuId": 69,
      "trimconstruction_id":id,
      "username": userName,
      "password" : userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }      
    // console.log("req body for edit ==> ", obj);
    let EditFabricProcessInObj = await APIServiceCall.getEditDetailsOfRawMaterialMasters(obj);
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
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.trimconstruction_id = trimconstructionId;
    tempObj.compIds = usercompanyId;
    tempObj.company = JSON.parse(companyObj);
    tempObj.menuid=69;

    console.log(" edit saving Obj ===> ", tempObj);

    set_isLoading(true);   
    let saveEditFPI = await APIServiceCall.SaveRawMaterialsMastersEdit(tempObj);
    set_isLoading(false);
    
    if(saveEditFPI && saveEditFPI.statusData && saveEditFPI.responseData ){
      console.log("sucess")
      backBtnAction();
    } else {
      popUpAction(Constant.Fail_Save_Dtls_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(saveEditFPI && saveEditFPI.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  return (
    <SaveRawMaterialsMasterUI
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

export default SaveRawMaterialsMaster;


