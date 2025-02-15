import React, { useState } from 'react';
import * as APIServiceCall from '../../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import CreateRequestUi from './CreateRequestUi';

const CreateRequest = ({ navigation, route, ...props }) => {

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
    getMenus: [],
    getBatches: [],
    getStockTypes:[],
    getCompanyLocations:[]
  });


  React.useEffect(() => {
    getStockFabrics();
    getStockStyles();
    getMenus();
    getBatches();
    getCompanyLocations();
    getStockTypes();
  }, []);


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

  const getStockStyles = async () => {

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

    let STOREDETAILSAPIObj = await APIServiceCall.getStockStyles(obj);
    set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      set_lists(prevLists => ({
        ...prevLists,
        getStockStyles: STOREDETAILSAPIObj.responseData
      }));
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const getMenus = async () => {

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

    let STOREDETAILSAPIObj = await APIServiceCall.getMenus(obj);
    set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      set_lists(prevLists => ({
        ...prevLists,
        getMenus: STOREDETAILSAPIObj.responseData
      }));
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const getBatches = async () => {

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

    let STOREDETAILSAPIObj = await APIServiceCall.getBatches(obj);
    set_isLoading(false);
    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      set_lists(prevLists => ({
        ...prevLists,
        getBatches: STOREDETAILSAPIObj.responseData || []
      }));
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const getCompanyLocations = async () => {

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

    let STOREDETAILSAPIObj = await APIServiceCall.getCompanyLocations(obj);
    set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      set_lists(prevLists => ({
        ...prevLists,
        getCompanyLocations: STOREDETAILSAPIObj.responseData
      }));
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };
  


  const getStockTypes = async () => {

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

    let STOREDETAILSAPIObj = await APIServiceCall.getStockTypes(obj);
    set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      set_lists(prevLists => ({
        ...prevLists,
        getStockTypes: STOREDETAILSAPIObj.responseData
      }));
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };


  const actionOnRow = (item, index) => {
    // console.log("Clicked on the row");
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
      "buyerpowise": tempObj.buyerpowise,
      "fabricQty": tempObj.fabricQty,
      "uom": tempObj.uom,
      "rmDetails": tempObj.rmDetails,
      "ts_create": tempObj.ts_create,
    };
    
    console.log("req for save craete stock req ====>   ", obj)

    set_isLoading(true);
    let SAVEAPIObj = await APIServiceCall.saveStockRequest(obj);
    set_isLoading(false);

    if (SAVEAPIObj && SAVEAPIObj.statusData && SAVEAPIObj.responseData !== "false") {
      console.log("Sucessfully saved create stock");
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

    <CreateRequestUi
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

export default CreateRequest;

