import React, { useState } from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import StockRecieveEditUi from './stockRecieveEditUi';


const StockRecieveEdit = ({ navigation, route, ...props }) => {

  const [itemsObj, set_itemsObj] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  React.useEffect(() => {

    if (route?.params) {
      getInitialData(route?.params?.item.stockId);
    }

  }, [route.params]);


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
      "username": userName,
      "password": userPsd,
      "requestId": stockId,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }

    let STOREDETAILSAPIObj = await APIServiceCall.GetEditStockRecieveDetails(obj);
    // console.log('STOREDETAILSAPIObj========> ', STOREDETAILSAPIObj)
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

  const submitAction = (remarks, checkboxT2, T2, fabricCheckboxes) => {
    let tempObj = itemsObj;
    console.log("SUBMIT ACTION==> ", remarks, checkboxT2, T2, fabricCheckboxes);

    const flag = fabricCheckboxes.every(item => item === false) ? 1 : 0;

    if( T2 && !checkboxT2 && fabricCheckboxes.length>0 &&  flag){
      popUpAction("Please Select Atleast one Style", Constant.DefaultAlert_MSG, 'OK', true, false);
      return;
    }
    
    if (T2 && checkboxT2) {
      tempObj.fabricApprovalStatus = 3;
    }
    tempObj.comments = remarks;
    const reqList = tempObj?.requestDetails.map((item, index) => {
      item.approveStatus = fabricCheckboxes[index] ? 3 : 1;
      return item;
    });

    tempObj.requestDetails = reqList;

    const filteredRequestDetails = tempObj?.requestDetails.map(item => ({
      id: item.id, // stockChildId
      stock: item.stock, // rmId
      styleRmSizeId: item.styleRmSizeId, // sizeId
      inputQty: item.inputQty // rmqty
  }));

  console.log("filteredRequestDetails==>", filteredRequestDetails)
  tempObj.requestDetails = filteredRequestDetails;

    tempObj.stockapprove_remarks = remarks;
    saveStockRecieve(tempObj);
  };

  const saveStockRecieve = async (tempObj) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    let obj = {
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
      "trimId": tempObj.fabricLocationId,
      "comments": tempObj.comments,
      "fabricQty": tempObj.fabricqty,
      "stockId": tempObj.id,
      "rmDetails": tempObj.requestDetails,
      
    }
    console.log("SAVING ITEM ===> ", obj);
    
    set_isLoading(true);
    let SAVEAPIObj = await APIServiceCall.saveStockReceive(obj);
    console.log("SAVEAPIObj ===> ", SAVEAPIObj);
    set_isLoading(false);

    if (SAVEAPIObj && SAVEAPIObj.statusData && SAVEAPIObj.responseData !== "false") {
      console.log("status in if ", SAVEAPIObj.responseData);
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

    <StockRecieveEditUi
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

export default StockRecieveEdit;

