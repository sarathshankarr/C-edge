import React, { useState } from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import StoreApproveEditUi from './storeApproveEditUi';

const StoreApproveEdit = ({ navigation, route, ...props }) => {

  const [itemsObj, set_itemsObj] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  React.useEffect(() => {

    if (route.params?.stockId) {
      getInitialData(route.params?.stockId);
    }

  }, [route.params?.stockId]);


  const backBtnAction = () => {
    navigation.goBack();
  };

  const getInitialData = async (stockId) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    set_isLoading(true);
    let obj = {
      "stockId": stockId,
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }

    let STOREDETAILSAPIObj = await APIServiceCall.GetEditStockAprroveDetails(obj);
    // console.log('STOREDETAILSAPIObj,', STOREDETAILSAPIObj,'\nSTOREDETAILSAPIObj,',  STOREDETAILSAPIObj.responseData.sizeDetails)
    set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      set_itemsObj(STOREDETAILSAPIObj.responseData);
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const actionOnRow = (item, index) => {
    console.log("Clicked on the row");
  };

  const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  };

  const popOkBtnAction = () => {
    popUpAction(undefined, undefined, '', false, false)
  };

  const submitAction = (remarks, checkboxT1, checkboxT2, T1, T2 , status,date) => {

    let tempObj = itemsObj;


    if(!checkboxT1  &&  !checkboxT2 && T1 && T2 ){
      popUpAction("Please Select Atleast one Style", Constant.DefaultAlert_MSG, 'OK', true, false);
      return;
    }
    
    if(T1 && !checkboxT1 && !T2){
      popUpAction("Please Select Atleast one Style", Constant.DefaultAlert_MSG, 'OK', true, false);
      return;
    }

    if(T2 && !checkboxT2 && !T1){
      popUpAction("Please Select Atleast one Style", Constant.DefaultAlert_MSG, 'OK', true, false);
      return;
    }


    if(T2 && checkboxT2){
      tempObj.fabricApprovalStatus=3;
    }else if(T2 && !checkboxT2){
      tempObj.fabricApprovalStatus=1;
    }

    if(T1 && checkboxT1){
      let filtered=tempObj.requestDetails.map((item)=>{
        item.approveStatus=3;
        return item;
      });
      tempObj.requestDetails=filtered;
    }

    if(!status){
      tempObj.declinedStatus=1;
      tempObj.stockRequestedStatus=0;
    }else{
      tempObj.stockRequestedStatus=1;
    }

    tempObj.stockapprove_remarks=remarks;
    tempObj.date=date;
    tempObj.fabricRecievedQty=1;
    saveStoreApprove(tempObj);
  };

  const saveStoreApprove = async (tempObj) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
  
    let obj = {
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
      "stockRequest": tempObj,
      "receiveDate":tempObj.date,
    }

    console.log("saving OBj edit ==> ", obj);
    set_isLoading(true);
    let SAVEAPIObj = await APIServiceCall.saveStoreApproval(obj);
    set_isLoading(false);

    if (SAVEAPIObj && SAVEAPIObj.statusData && SAVEAPIObj.responseData && SAVEAPIObj.responseData.status === true) {
      console.log("Sucess");
      backBtnAction();
    } else {
      popUpAction(Constant.Fail_Save_Dtls_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (SAVEAPIObj && SAVEAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  return (

    <StoreApproveEditUi
      itemsObj={itemsObj}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      backBtnAction={backBtnAction}
      actionOnRow={actionOnRow}
      popOkBtnAction={popOkBtnAction}
      submitAction={submitAction}
    />

  );

}

export default StoreApproveEdit;

