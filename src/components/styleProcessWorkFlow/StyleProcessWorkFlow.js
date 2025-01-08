import React, { useState } from 'react';
import * as APIServiceCall from '../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import StyleProcessWorkFlowUI from './StyleProcessWorkFlowUI';

const StyleProcessWorkFlow = ({ navigation, route, ...props }) => {

  const [itemsObj, set_itemsObj] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);


  React.useEffect(() => {

    if (route.params) {
      getInitialData(route.params.process, route.params.style);
    }
    console.log(" Request props List  ==>", route.params.process, route.params.style)
  }, [route.params]);


  const backBtnAction = () => {
    navigation.goBack();
  };

  const getInitialData = async (process, style) => {
    set_isLoading(true);

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let obj = {
      "username": userName,
      "password": userPsd,
      "style": style,
      "process": process,
      "company": JSON.parse(companyObj),
    }
    // console.log("red body ==> ", obj);

    let STOREDETAILSAPIObj = await APIServiceCall.GetStyleStatusFlow(obj);


    set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData && STOREDETAILSAPIObj?.responseData?.length > 0) {
      set_itemsObj(STOREDETAILSAPIObj.responseData);
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
      // navigation.goBack();

    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
      // navigation.goBack();
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
    popUpAction(undefined, undefined, '', false, false);
    navigation.goBack();
  };

  const submitAction = (remarks, stockTable) => {
    //     let tempObj = itemsObj;
    //     tempObj.comments=remarks;

    //     let filteredRequestDetails = stockTable.map(detail => ({
    //       "stockType": detail.stockType,    
    //       "stockTypeName": detail.stockTypeName, 
    //       "stock": detail.stock,  
    //       "stock_rm_lot": detail.stock_rm_lot, 
    //       "stockLocationId": detail.stockLocationId, 
    //       "styleRmSizeId": detail.styleRmSizeId,   
    //       "inputQty": detail.inputQty,      
    //       "uomstock": detail.uomstock      
    //   }));

    //   tempObj.requestDetails=filteredRequestDetails;

    //   console.log("filteredRequestDetails==>", tempObj.requestDetails );

    saveStoreRequest(tempObj);
  };

  const saveStoreRequest = async (tempObj) => {

    // let userName = await AsyncStorage.getItem('userName');
    // let userPsd = await AsyncStorage.getItem('userPsd');

    // let obj = {
    //   "username": userName,
    //   "password": userPsd,
    //   "processId":0,
    //   "woStyleId":tempObj.styleId,
    //   "trimId":tempObj.fabricId,
    //   "locationId":tempObj.fabricLocationId,
    //   "unitMasterId":tempObj.unitmasterId,
    //   "comments":tempObj.comments,
    //   "general":0,
    //   "styleWise":1,
    //   "fabricQty":tempObj.fabricqty,
    //   "uom":tempObj.uomfabric,
    //   "rmDetails":tempObj.requestDetails,
    // }
    // console.log("saving obj ==>", obj);

    // set_isLoading(true);
    // let SAVEAPIObj = await APIServiceCall.saveStockRequest(obj);
    // set_isLoading(false);

    // if (SAVEAPIObj && SAVEAPIObj.statusData && SAVEAPIObj.responseData !== "false") {
    //   console.log("Sucess");
    //   backBtnAction();
    // } else {
    //   popUpAction(Constant.Fail_Save_Dtls_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    // }

    // if (SAVEAPIObj && SAVEAPIObj.error) {
    //   popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    // }

  };

  return (

    <StyleProcessWorkFlowUI
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

export default StyleProcessWorkFlow;

