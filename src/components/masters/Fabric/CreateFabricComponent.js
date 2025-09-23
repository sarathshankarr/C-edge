import React, { useState, useEffect, useRef } from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import CreateFabricUI from './CreateFabricUI';

const CreateFabricComponent = ({ route }) => {
  const navigation = useNavigation();

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  
  const [lists, set_lists] = useState({
    locationsMap: [],
    colorMap: [],
    uomMap: [],
    brandsMap: [],
    fabrictypeMap: [],
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
      "menuId": 12,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    let LISTAPIOBJ = await APIServiceCall.GetCreateFabricMastersList(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {

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
        if (LISTAPIOBJ?.responseData?.colorMap) {
          const colorMapList = Object.keys(LISTAPIOBJ.responseData.colorMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.colorMap[key]
          }));

          const prioritized = { id: "ADD_NEW_COLOR", name: "Add New Color" }; 
          const updatedcolorMapList = [prioritized, ...colorMapList];
      
          set_lists(prevLists => ({
              ...prevLists,
              colorMap: updatedcolorMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.uomMap) {
          const uomMapList = Object.keys(LISTAPIOBJ.responseData.uomMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.uomMap[key]
          }));

          const prioritized = { id: "ADD_NEW_UOM", name: "Add New UOM " }; 
          const updateduomMapList = [prioritized, ...uomMapList];
      
          set_lists(prevLists => ({
              ...prevLists,
              uomMap: updateduomMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.fabrictypeMap) {
          const fabrictypeMapList = Object.keys(LISTAPIOBJ.responseData.fabrictypeMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.fabrictypeMap[key]
          }));

          const prioritized = { id: "ADD_NEW_FABRIC_TYPE", name: "Add New Fabric Type " }; 
          const updatedfabrictypeMapList = [prioritized, ...fabrictypeMapList];
      
          set_lists(prevLists => ({
              ...prevLists,
              fabrictypeMap: updatedfabrictypeMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.brandsMap) {
          const brandsMapList = Object.keys(LISTAPIOBJ.responseData.brandsMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.brandsMap[key]
          }));

          const prioritized = { id: "ADD_NEW_BRAND", name: "Add New Brand/Project" }; 
          const updatedbrandsMapList = [prioritized, ...brandsMapList];
      
          set_lists(prevLists => ({
              ...prevLists,
              brandsMap: updatedbrandsMapList
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

    console.log("saving obj ==>", tempObj);
    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.compIds = usercompanyId;
    tempObj.company = JSON.parse(companyObj);



    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.saveCreateFabricMasters(tempObj);
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

    <CreateFabricUI
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

export default CreateFabricComponent;

 