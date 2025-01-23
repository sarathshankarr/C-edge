import React, { useState, useEffect, useRef } from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import CreateRawMaterialsMasterUI from './CreateRawMaterialsMasterUI';

const CreateRawMaterialsMasterComponent = ({ route }) => {
  const navigation = useNavigation();

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);

  
  const [lists, set_lists] = useState({
    trimTypesMap: [],
    uomMap: [],
    colorMap: [],
    locationsMap: [],
    brandsMap: [],
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
      "menuId": 69,
      "flag": 1,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    let LISTAPIOBJ = await APIServiceCall.GetCreateDropdownsList(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {

       
        if (LISTAPIOBJ?.responseData?.trimTypesMap) {
          const trimTypesMapList = Object.keys(LISTAPIOBJ.responseData.trimTypesMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.trimTypesMap[key]
          }));

          const prioritizedMachine = { id: "ADD_NEW_TRIMTYPE", name: "Add New Raw Material Type" }; // Define your first element
          const updatedtrimTypesMapList = [prioritizedMachine, ...trimTypesMapList];
      
          set_lists(prevLists => ({
              ...prevLists,
              trimTypesMap: updatedtrimTypesMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.uomMap) {
          const uomMapList = Object.keys(LISTAPIOBJ.responseData.uomMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.uomMap[key]
          }));

          const prioritizeduomMap = { id: "ADD_NEW_UOM", name: "Add New UOM" }; // Define your first element
          const updateduomMapList = [prioritizeduomMap, ...uomMapList];
      
          set_lists(prevLists => ({
              ...prevLists,
              uomMap: updateduomMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.colorMap) {
          const colorMapList = Object.keys(LISTAPIOBJ.responseData.colorMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.colorMap[key]
          }));

          const prioritizedcolorMap = { id: "ADD_NEW_COLOR", name: "Add New Color" }; 
          const updatedcolorMapList = [prioritizedcolorMap, ...colorMapList];

          set_lists(prevLists => ({
            ...prevLists,
            colorMap: updatedcolorMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.locationsMap) {
          const locationsMapList = Object.keys(LISTAPIOBJ.responseData.locationsMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.locationsMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            locationsMap: locationsMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.brandsMap) {
          const brandsMapList = Object.keys(LISTAPIOBJ.responseData.brandsMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.brandsMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            brandsMap: brandsMapList
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

  const ValidateAction = async (type) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    let Obj={
     "menuid":82,
    "username": userName,
    "password": userPsd,
    "trimtype": type,
    "compIds" : usercompanyId,
    "company" :JSON.parse(companyObj),
    }

    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.validateRawMaterialTypeMasters(Obj);
    set_isLoading(false);

    console.log("validation result ", SAVEAPIObj?.responseData);

    return SAVEAPIObj?.responseData;
  };

  const submitAction = async (tempObj) => {

    
    const checked= await ValidateAction();
    if(!checked){
      popUpAction(Constant.Fail_Validate_RMM_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
      return;
    }

    // return;

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let userId = await AsyncStorage.getItem('userId');

  
    tempObj.menuid = 69;
    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.userId = userId;
    tempObj.compIds = usercompanyId;
    tempObj.companyId = usercompanyId;
    tempObj.company = JSON.parse(companyObj);


    console.log("saving obj for create save 1==>", tempObj);
    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.saveCreateRawMaterialMasters(tempObj);
    set_isLoading(false);

    console.log("Sucess before returned obj ", SAVEAPIObj?.responseData);

    if (SAVEAPIObj && SAVEAPIObj?.statusData && SAVEAPIObj?.responseData === "True") {
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

    <CreateRawMaterialsMasterUI
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

export default CreateRawMaterialsMasterComponent;
