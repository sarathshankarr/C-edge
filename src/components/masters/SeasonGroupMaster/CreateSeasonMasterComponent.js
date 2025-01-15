import React, { useState, useEffect, useRef } from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import CreateSeasonMasterUI from './CreateSeasonMasterUI';

const CreateSeasonMasterComponent = ({ route }) => {
  const navigation = useNavigation();

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [lists, set_lists] = useState({
    processMap: [],
    machineNosMap: [],
    shiftMap: [],
    empMap: [],
    batchNoMap: [],
    ordersMap: [],
    colorsMap: [],
  });


  React.useEffect(() => {
    // getInitialData();
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
    let LISTAPIOBJ = await APIServiceCall.GetProcessList(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {

        if (LISTAPIOBJ?.responseData?.processMap) {
          const processList = Object.keys(LISTAPIOBJ.responseData.processMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.processMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            processMap: processList
          }));
        }

        console.log("LISTAPIOBJ?.responseData?.machineNosMap===> ", LISTAPIOBJ?.responseData?.machineNosMap)
        if (LISTAPIOBJ?.responseData?.machineNosMap) {
          const machineNosList = Object.keys(LISTAPIOBJ.responseData.machineNosMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.machineNosMap[key]
          }));

          const prioritizedMachine = { id: "ADD", name: "Add Machine No" }; // Define your first element
          const updatedMachineNosList = [prioritizedMachine, ...machineNosList];
      
          set_lists(prevLists => ({
              ...prevLists,
              machineNosMap: updatedMachineNosList
          }));


          // set_lists(prevLists => ({
          //   ...prevLists,
          //   machineNosMap: machineNosList
          // }));
        }

        // Handle shiftMap
        if (LISTAPIOBJ?.responseData?.shiftMap) {
          const shiftList = Object.keys(LISTAPIOBJ.responseData.shiftMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.shiftMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            shiftMap: shiftList
          }));
        }

        // Handle empMap
        if (LISTAPIOBJ?.responseData?.empMap) {
          const empList = Object.keys(LISTAPIOBJ.responseData.empMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.empMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            empMap: empList
          }));
        }

        // Handle batchNoMap
        if (LISTAPIOBJ?.responseData?.batchNoMap) {
          const batchNoList = Object.keys(LISTAPIOBJ.responseData.batchNoMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.batchNoMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            batchNoMap: batchNoList
          }));
        }

        // Handle ordersMap
        if (LISTAPIOBJ?.responseData?.ordersMap) {
          const ordersList = Object.keys(LISTAPIOBJ.responseData.ordersMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.ordersMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            ordersMap: ordersList  // Store the array format
          }));
        }

        // Handle colorsMap
        if (LISTAPIOBJ?.responseData?.colorsMap) {
          const colorsList = Object.keys(LISTAPIOBJ.responseData.colorsMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.colorsMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            colorsMap: colorsList  // Store the array format
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

    let SAVEAPIObj = await APIServiceCall.saveCreateProcessIn(tempObj);
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

    <CreateSeasonMasterUI
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

export default CreateSeasonMasterComponent;




