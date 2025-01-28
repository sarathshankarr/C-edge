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
    currencys: [],
    stateMap:[],
    countryMap:[]
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
        if (LISTAPIOBJ?.responseData?.countryMap) {
          const countryMapList = Object.keys(LISTAPIOBJ.responseData.countryMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.countryMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            countryMap: countryMapList
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

  const getStatelist = async (selectedCountryId) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      "countryId": selectedCountryId,
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
    }
    let EditDDAAPIObj = await APIServiceCall.loadVendorMasterStatesList(obj);
    set_isLoading(false);

    
    if (EditDDAAPIObj && EditDDAAPIObj.statusData) {

      if (EditDDAAPIObj?.responseData?.stateMap) {
        const stateMapList = Object.keys(EditDDAAPIObj.responseData.stateMap).map(key => ({
          id: key,
          name: EditDDAAPIObj.responseData.stateMap[key]
        }));
        set_lists(prevLists => ({
          ...prevLists,
          stateMap: stateMapList,
          phoneCode: EditDDAAPIObj?.responseData?.ph
        }));
      }
      
      
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (EditDDAAPIObj && EditDDAAPIObj.error) {
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
      getStatelist={getStatelist}
    />

  );

}

export default CreateVendorOrCustomerMasterComponent;


