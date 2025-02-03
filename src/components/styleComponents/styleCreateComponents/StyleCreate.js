import React, { useState, useEffect, useRef } from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import StyleCreateUI from './StyleCreateUI';

const StyleCreate = ({ route }) => {
  const navigation = useNavigation();

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [colorObj, set_colorObj] = useState([]);
  
  const [lists, set_lists] = useState({
    colorsMap: [],
    loadFabricStyles:[],
    locationsMap:[],
    sizeGroupsMap:[],
    confMap:[],
    brandsMap:[],
  });

  const [sizeRangesMap, setSizeRangesMap]=useState([]);
  const [sizeMap, setsizeMap]=useState([]);

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
      "menuId": 30,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
    }
    let LISTAPIOBJ = await APIServiceCall.GetCreateStyleList(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
        if (LISTAPIOBJ?.responseData?.colorsMap) {
          const colorsMapList = Object.keys(LISTAPIOBJ.responseData.colorsMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.colorsMap[key]
          }));
          set_lists(prevLists => ({
            ...prevLists,
            colorsMap: colorsMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.loadFabricStyles) {
          const loadFabricStylesList = Object.keys(LISTAPIOBJ.responseData.loadFabricStyles).map(key => ({
            id: LISTAPIOBJ.responseData.loadFabricStyles[key],
            name: key
          }));
          set_lists(prevLists => ({
            ...prevLists,
            loadFabricStyles: loadFabricStylesList
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
        if (LISTAPIOBJ?.responseData?.sizeGroupsMap) {
          const sizeGroupsMapList = Object.keys(LISTAPIOBJ.responseData.sizeGroupsMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.sizeGroupsMap[key],
          }));
          set_lists(prevLists => ({
            ...prevLists,
            sizeGroupsMap: sizeGroupsMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.confMap) {
          const confMapList = Object.keys(LISTAPIOBJ.responseData.confMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.confMap[key],
          }));
          set_lists(prevLists => ({
            ...prevLists,
            confMap: confMapList
          }));
        }
        if (LISTAPIOBJ?.responseData?.brandsMap) {
          const brandsMapList = Object.keys(LISTAPIOBJ.responseData.brandsMap).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.brandsMap[key],
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

  const getloadScalesOnSizeGroup = async (seasonId) => {

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
      "menuId":30,
      "sizeGroupId":seasonId
    }
    let EditDDAAPIObj = await APIServiceCall.loadScalesOnSizeGroup(obj);
    set_isLoading(false);

    
    if (EditDDAAPIObj && EditDDAAPIObj.statusData) {

      if (EditDDAAPIObj?.responseData?.sizeRangesMap) {
        const sizeRangesMapList = Object.keys(EditDDAAPIObj.responseData.sizeRangesMap).map(key => ({
          id: key,
          name: EditDDAAPIObj.responseData.sizeRangesMap[key],
        }));

        setSizeRangesMap(sizeRangesMapList);
      }
      
      
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (EditDDAAPIObj && EditDDAAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };
  const getColorBasedOnFabric = async (fabricName) => {

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
      "menuId":30,
      "fabric":fabricName,
  
    }
    let EditDDAAPIObj = await APIServiceCall.getColorBasedOnFabric(obj);
    set_isLoading(false);

    
    if (EditDDAAPIObj && EditDDAAPIObj.statusData) {

      if (EditDDAAPIObj?.responseData) {
        set_colorObj(EditDDAAPIObj?.responseData);
      }
      
      
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (EditDDAAPIObj && EditDDAAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const getSizesBasedOnScale = async (seasonId, scaleOrSizeId) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      "menuId":30,
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
      "sizeGroupId":seasonId,
      "sizeRangeId":scaleOrSizeId
    }
    let EditDDAAPIObj = await APIServiceCall.loadgetSizesBasedOnScaleList(obj);
    set_isLoading(false);

    
    if (EditDDAAPIObj && EditDDAAPIObj.statusData) {

      if (EditDDAAPIObj?.responseData?.sizeMap) {
        const sizeMapList = Object.keys(EditDDAAPIObj.responseData.sizeMap).map(key => ({
          id: key,
          name: EditDDAAPIObj.responseData.sizeMap[key],
          consumption:"",
          invLimit:""
        }));
      setsizeMap(sizeMapList);
      }
      
      
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (EditDDAAPIObj && EditDDAAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };
 
  const getcolorcode = async () => {

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
    let EditDDAAPIObj = await APIServiceCall.getcolorcode(obj);
    set_isLoading(false);

    
    if (EditDDAAPIObj && EditDDAAPIObj.statusData) {

      if (EditDDAAPIObj?.responseData?.stateMap) {
        const stateMapList = Object.keys(EditDDAAPIObj.responseData.stateMap).map(key => ({
          id: key,
          name: EditDDAAPIObj.responseData.stateMap[key]
        }));

        const prioritized = { id: "ADD_NEW_STATE", name: "Add New State" }; 
          const updatedstateMapList = [prioritized, ...stateMapList];


        set_lists(prevLists => ({
          ...prevLists,
          stateMap: updatedstateMapList,
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

    const validateCreate= await ValidateCreateStyle(tempObj);

    if(validateCreate==="true"){
      console.log("pop up")
      popUpAction(Constant.Fail_Validate_CREATE_STYLE_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
      return;
    }
    console.log("creating new ");


    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let userId = await AsyncStorage.getItem('userId');

    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.userId = userId;
    tempObj.compIds = usercompanyId;
    tempObj.company = JSON.parse(companyObj);

    console.log("saving obj ==>", tempObj);


    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.saveCreateStyle(tempObj);
    set_isLoading(false);


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

  const ValidateCreateStyle = async (tempObj) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let userId = await AsyncStorage.getItem('userId');

    const Obj=tempObj;

    Obj.username = userName;
    Obj.password = userPsd;
    Obj.userId = userId;
    Obj.compIds = usercompanyId;
    Obj.company = JSON.parse(companyObj);

    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.validateCreateStyle(Obj);
    set_isLoading(false);

    console.log("Sucess before returned obj ", SAVEAPIObj);

    return SAVEAPIObj?.responseData;
  };

  return (

    <StyleCreateUI
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
      getloadScalesOnSizeGroup={getloadScalesOnSizeGroup}
      getSizesBasedOnScale={getSizesBasedOnScale}
      sizeMap={sizeMap}
      sizeRangesMap={sizeRangesMap}
      popOkBtnAction={popOkBtnAction}
      getColorBasedOnFabric={getColorBasedOnFabric}
      colorObj={colorObj}
    />

  );

}

export default StyleCreate;


