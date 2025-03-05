import React, {useState, useEffect, useRef} from 'react';
import * as APIServiceCall from '../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useNavigation} from '@react-navigation/native';
import CreatePurchaseOrderDraftUI from './CreatePurchaseOrderDraftUI';

const CreatePurchaseOrderDraft = ({route}) => {
  const navigation = useNavigation();

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [lists, set_lists] = useState({
    vendorsMap: [],
    ShipTo: [],
    ShipLocation: [],
  });
  const [modalLists, set_modalLists] = useState({
    StyleFg: [],
    styleTrimfab: [],
    styleRm: [],
    styleFab: [],
  });


  useEffect(() => {
    getInitialData();
  }, []);

  const backBtnAction = () => {
    navigation.goBack();
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
  };

  const getInitialData = async tempObj => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      userName: userName,
      userPwd: userPsd,
      menuId: '145',
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };

    let LISTAPIOBJ = await APIServiceCall.getPurchaseOrderDraftDetails(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
        if (LISTAPIOBJ?.responseData?.vendorsMap) {
          const vendorsMapList = Object.keys(
            LISTAPIOBJ.responseData.vendorsMap,
          ).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.vendorsMap[key],
          }));
          set_lists(prevLists => ({
            ...prevLists,
            vendorsMap: vendorsMapList,
          }));
        }
        if (LISTAPIOBJ?.responseData?.locationsMap1) {
          const locationsMap1List = Object.keys(
            LISTAPIOBJ.responseData.locationsMap1,
          ).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.locationsMap1[key],
          }));
          set_lists(prevLists => ({
            ...prevLists,
            ShipLocation: locationsMap1List,
          }));
        }
        if (LISTAPIOBJ?.responseData?.locationsMap) {
          const locationsMapList = Object.keys(
            LISTAPIOBJ.responseData.locationsMap,
          ).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.locationsMap[key],
          }));
          set_lists(prevLists => ({
            ...prevLists,
            ShipTo: locationsMapList,
          }));
        }
      }
    } else {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (LISTAPIOBJ && LISTAPIOBJ.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };
  const getModalStyleFgList = async tempObj => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      fromRecord: 0,
      userName: userName,
      userPwd: userPsd,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
      menuId: 145,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };

    let LISTAPIOBJ = await APIServiceCall.getPODStyeleFogDetails(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
     console.log("modal lsit ===> ",  LISTAPIOBJ.responseData)
          set_modalLists(prevLists => ({
            ...prevLists,
            StyleFg: LISTAPIOBJ.responseData,
          }));
      
        
      }
    } else {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (LISTAPIOBJ && LISTAPIOBJ.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };

  const submitAction = async checkedData => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    const tempObj = {};

    tempObj.menuId = 787;
    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.compIds = usercompanyId;
    tempObj.checkedData = checkedData;
    tempObj.company = JSON.parse(companyObj);

    console.log('saving obj ==>', tempObj);

    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.saveCreatePartsProcessing(tempObj);
    set_isLoading(false);

    console.log('Sucess before returned obj ', SAVEAPIObj);

    if (
      SAVEAPIObj &&
      SAVEAPIObj?.statusData &&
      SAVEAPIObj?.responseData !== 0
    ) {
      console.log('Sucessfully saved ===> ');
      backBtnAction();
    } else {
      console.log('failed  saving =====> ');
      popUpAction(
        Constant.Fail_Save_Dtls_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (SAVEAPIObj && SAVEAPIObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };

  return (
    <CreatePurchaseOrderDraftUI
      isLoading={isLoading}
      popUpAction={popUpAction}
      set_isLoading={set_isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      lists={lists}
      modalLists={modalLists}
      getModalStyleFgList={getModalStyleFgList}
      submitAction={submitAction}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
    />
  );
};

export default CreatePurchaseOrderDraft;
