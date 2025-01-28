import React, { useState, useEffect, useRef } from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import CreateVendorOrCustomerMasterUI from './CreateVendorOrCustomerMasterUI';

const CreateVendorOrCustomerMasterComponent = ({ route }) => {
  const navigation = useNavigation();

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  
  const [lists, set_lists] = useState({
    termsMap: [],
    priceMap: [],
    processMap: [],
    paymenttermsMap: [],
    invfrmts: [],
    taxType: [],
    currencys: [],
    regionMap: [],
    shipMode: [],
  });


  React.useEffect(() => {
    getInitialData();
  }, []);


  const backBtnAction = () => {
    navigation.goBack();
  };

  const getInitialData = async () => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    
    set_isLoading(true);
    let obj = {
      "username": userName,
      "password": userPsd,
      "menuId": 587,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    let LISTAPIOBJ = await APIServiceCall.GetCreateVendorsMastersList(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {

        if (LISTAPIOBJ?.responseData?.termsMap) {
          const termsMapList = Object.keys(LISTAPIOBJ.responseData.termsMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.termsMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            termsMap: termsMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.priceMap) {
          const priceMapList = Object.keys(LISTAPIOBJ.responseData.priceMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.priceMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            priceMap: priceMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.processMap) {
          const processMapList = Object.keys(LISTAPIOBJ.responseData.processMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.processMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            processMap: processMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.paymenttermsMap) {
          const paymenttermsMapList = Object.keys(LISTAPIOBJ.responseData.paymenttermsMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.paymenttermsMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            paymenttermsMap: paymenttermsMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.invfrmts) {
          const invfrmtsList = Object.keys(LISTAPIOBJ.responseData.invfrmts).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.invfrmts[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            invfrmts: invfrmtsList
          }));
        }
        if (LISTAPIOBJ?.responseData?.taxType) {
          const taxTypeList = Object.keys(LISTAPIOBJ.responseData.taxType).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.taxType[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            taxType: taxTypeList
          }));
        }
        if (LISTAPIOBJ?.responseData?.currencys) {
          const currencysList = Object.keys(LISTAPIOBJ.responseData.currencys).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.currencys[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            currencys: currencysList
          }));
        }
        if (LISTAPIOBJ?.responseData?.regionMap) {
          const regionMapList = Object.keys(LISTAPIOBJ.responseData.regionMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.regionMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            regionMap: regionMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.shipMode) {
          const shipModeList = Object.keys(LISTAPIOBJ.responseData.shipMode).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.shipMode[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            shipMode: shipModeList
          }));
        }
      }
    }
    else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (LISTAPIOBJ && LISTAPIOBJ.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  }

  const popOkBtnAction = () => {
    popUpAction(undefined, undefined, '', false, false)
  };

  const submitAction = async (tempObj) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.compIds = usercompanyId;
    tempObj.company = JSON.parse(companyObj);

    console.log("saving obj ==>", tempObj);


    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.saveCreateVendorMasters(tempObj);
    set_isLoading(false);

    console.log("Sucess before returned obj ", SAVEAPIObj);

    if (SAVEAPIObj && SAVEAPIObj?.statusData && SAVEAPIObj?.responseData !== 0) {
      console.log("Sucessfully saved ===> ");
      backBtnAction();
    } else {
      console.log("failed  saving =====> ")
      popUpAction(Constant.Fail_Save_Dtls_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (SAVEAPIObj && SAVEAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }


  };

  return (

    <CreateVendorOrCustomerMasterUI
      itemsArray={lists}
      isLoading={isLoading}
      popUpAction={popUpAction}
      set_isLoading={set_isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      submitAction={submitAction}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
    />

  );

}

export default CreateVendorOrCustomerMasterComponent;


