import React, { useState } from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkerWagesReportUI from './WorkerWagesReportUI';


const WorkerWagesReport = ({ navigation, route, ...props }) => {

  const [itemsObj, set_itemsObj] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [lists, set_lists] = useState({
    getStockFabrics: [],
    getStockStyles: [],
  });


  // React.useEffect(() => {
  //   getStockFabrics();
  //   getStockStyles();
  // }, []);


  const backBtnAction = () => {
    navigation.goBack();
  };

  const getStockFabrics = async () => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }

    let STOREDETAILSAPIObj = await APIServiceCall.getStockFabrics(obj);
    // console.log('STOREDETAILSAPIObj,', STOREDETAILSAPIObj,'\nSTOREDETAILSAPIObj,',  STOREDETAILSAPIObj.responseData.sizeDetails)
    set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      set_lists(prevLists => ({
        ...prevLists,
        getStockFabrics: STOREDETAILSAPIObj.responseData
      }));

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

  const submitAction = (reqBody) => {
    // let tempObj = itemsObj;
    // tempObj.comments = remarks;

    // let filteredRequestDetails = stockTable.map(detail => ({
    //   "stockType": detail.stockType,
    //   "stockTypeName": detail.stockTypeName,
    //   "stock": detail.stock,
    //   "stock_rm_lot": detail.stock_rm_lot,
    //   "stockLocationId": detail.stockLocationId,
    //   "styleRmSizeId": detail.styleRmSizeId,
    //   "inputQty": detail.inputQty,
    //   "uomstock": detail.uomstock
    // }));

    // tempObj.requestDetails = filteredRequestDetails;

    // console.log("filteredRequestDetails==>", tempObj.requestDetails);

    saveStoreRequest(reqBody);
  };

  const saveStoreRequest = async (tempObj) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    let obj = {
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

      "processId": tempObj.processId,
      "woStyleId": tempObj.woStyleId,
      "trimId": tempObj.trimId,
      "locationId": tempObj.locationId,
      "unitMasterId": tempObj.unitMasterId,
      "comments": tempObj.comments,
      "general": tempObj.general,
      "styleWise": tempObj.styleWise,
      "fabricQty": tempObj.fabricQty,
      "uom": tempObj.uom,
      "rmDetails": tempObj.rmDetails,
    }
    console.log("saving obj ==>", obj);

    set_isLoading(true);
    let SAVEAPIObj = await APIServiceCall.saveStockRequest(obj);
    set_isLoading(false);

    if (SAVEAPIObj && SAVEAPIObj.statusData && SAVEAPIObj.responseData !== "false") {
      console.log("Sucess");
      backBtnAction();
    } else {
      popUpAction(Constant.Fail_Save_Dtls_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (SAVEAPIObj && SAVEAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const setLoad=(val)=> {
    set_isLoading(val);
  }

  return (

    <WorkerWagesReportUI
      lists={lists}
      isLoading={isLoading}
      setLoad={setLoad}
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

export default WorkerWagesReport;

