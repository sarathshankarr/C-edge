import React, { useState} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';
import GatePassAckEditUI from './GatePassAckEditUI';

const GatePassAckEdit = ({ navigation, route, ...props }) => {

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
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');


    set_isLoading(true);
    let obj = {
      "id" : id,
      "username": userName,
      "password" : userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }      
    let EditFabricProcessInObj = await APIServiceCall.getEditDetailsGatePassAuck(obj);
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

    saveGatePass(Obj);

  };

  const saveGatePass = async (tempObj) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.menuId=759;
    tempObj.compIds=usercompanyId;
    tempObj.company=JSON.parse(companyObj);
    

    console.log(" edit saving Obj ===> ", tempObj);

    set_isLoading(true);   
    let saveGPAEditObj = await APIServiceCall.saveGatePassAckEditSave(tempObj);
    console.log("saveGPAEditObj ", saveGPAEditObj.responseData);
    set_isLoading(false);
    if(saveGPAEditObj && saveGPAEditObj.statusData && saveGPAEditObj.responseData && saveGPAEditObj.responseData.status==="true"  ){
      console.log("success");
      backBtnAction();
    } else {
      popUpAction(Constant.Fail_Save_Dtls_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(saveGPAEditObj && saveGPAEditObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  return (
    <GatePassAckEditUI
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

export default GatePassAckEdit;