import React, { useState} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import SaveUomMasterUI from './SaveUomMasterUI';

const SaveUomMaster = ({ navigation, route, ...props }) => {

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
      if(route.params?.item) {
        getInitialData(route.params?.item?.umoId);
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
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    set_isLoading(true);
    let obj = {
      "username": userName,
      "password" : userPsd,
      "umoId": id,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }      
    let EditFabricProcessInObj = await APIServiceCall.getEditDetailsOfUomMasters(obj);
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

    saveUomEdit(Obj);

  };

  const saveUomEdit = async (tempObj) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    tempObj.menuid = 123;
    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.compIds = usercompanyId;
    tempObj.company = JSON.parse(companyObj);


    console.log(" edit saving Obj ===> ", tempObj);

    set_isLoading(true);   
    let saveEditFPI = await APIServiceCall.SaveUomMastersEdit(tempObj);
    set_isLoading(false);
    
    if(saveEditFPI && saveEditFPI.statusData && saveEditFPI.responseData ){
      console.log("Sucess");
      backBtnAction();
    } else {
      popUpAction(Constant.Fail_Save_Dtls_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(saveEditFPI && saveEditFPI.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  return (
    <SaveUomMasterUI
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

export default SaveUomMaster;


