import React, {useState, useEffect, useRef} from 'react';
import * as APIServiceCall from './../../utils/apiCalls/apiCallsComponent';
import * as Constant from './../../utils/constants/constant';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {useNavigation} from '@react-navigation/native';
import CreateNewOutInProcessUI from './CreateNewOutInProcessUI';

const CreateNewOutInProcess = ({route}) => {
  const navigation = useNavigation();

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  const [itemsObj, set_itemsObj] = useState([]);
  const [childObj, set_childObj] = useState([]);
  const [childObjSizes, set_childObjSizes] = useState([]);
  const [childPricesObj, set_childPricesObj] = useState([]);
  const [companyId, set_companyId] = useState('');


  React.useEffect(() => {
    getInitialData();
    getCompanyId();
  }, []);

  const getCompanyId = async() => {
    let usercompanyId = await AsyncStorage.getItem('companyId');
    set_companyId(companyId);
  };
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
      username: userName,
      password: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };
    let LISTAPIOBJ = await APIServiceCall.GetCreateNewOutInProcess(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
        // console.log('resp from ai ===> ', LISTAPIOBJ.responseData);
        set_itemsObj(LISTAPIOBJ.responseData);
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

  const getStylesList = async (idx, type, brand) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      menuId: idx,
      username: userName,
      password: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };
    let EditDDAAPIObj;
    if (type === 0) {
      EditDDAAPIObj = await APIServiceCall.loadOutwardChildList(obj);
    } else {
      obj.brandId =brand;
      // console.log("req body style list ===> ", obj)
      EditDDAAPIObj = await APIServiceCall.loadOutwardChildStyleList(obj);
    }
    set_isLoading(false);

    if (EditDDAAPIObj && EditDDAAPIObj.statusData) {
      set_childObj(EditDDAAPIObj?.responseData);
    } else {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (EditDDAAPIObj && EditDDAAPIObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };
  const getSizesList = async tempObj => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    console.log('getSizesList req body ', tempObj);
    set_isLoading(true);
    const splitted =tempObj.Sid.split('_')
    let obj = {
      menuId: tempObj.Pid, // process id
      styleId: splitted[0], // styleid
      soId: splitted[1], //
      fabOrRm: 0,
      reProcess: 0,
      rmenuId: 246,
      buyerpoId: 0,
      orderId: 0,
      outpId: 0,
      reGst: 0,
      regVendor: 0,
      workOrderId: 0,
      username: userName,
      password: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };

    let EditDDAAPIObj = await APIServiceCall.loadOutwardChildSizesList(obj);
    set_isLoading(false);

    if (EditDDAAPIObj && EditDDAAPIObj.statusData) {
      set_childObjSizes(EditDDAAPIObj?.responseData);
    } else {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (EditDDAAPIObj && EditDDAAPIObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };
  const getPricesList = async tempObj => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    console.log('getPricesList req body 22 ', tempObj);
    // return;
    set_isLoading(true);
    let obj = {
      menuId: tempObj.processId, 
      masterType: tempObj.outId, 
      username: userName,
      password: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };
    // return;
    let EditDDAAPIObj = await APIServiceCall.loadOutwardChildUnitPricesList(obj);
    set_isLoading(false);

    if (EditDDAAPIObj && EditDDAAPIObj.statusData) {
      set_childPricesObj(EditDDAAPIObj?.responseData);
    } else {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (EditDDAAPIObj && EditDDAAPIObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
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

  const submitAction = async tempObj => {
    // const validateVendorName = await ValidateVendorName(tempObj.vendor_name);
    // console.log("validated value of name ==> ",tempObj.vendor_name, validateVendorName);

    // if (validateVendorName === 'true') {
    //   console.log('pop up');
    //   popUpAction(
    //     Constant.Fail_Validate_VENDORMASTER_MSG,
    //     Constant.DefaultAlert_MSG,
    //     'OK',
    //     true,
    //     false,
    //   );
    //   return;
    // }
    // console.log("creating new ");

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let userId = await AsyncStorage.getItem('userId');

    tempObj.menuId = 17;
    tempObj.userId = userId;
    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.compIds = usercompanyId;
    tempObj.company = JSON.parse(companyObj);

    console.log('saving obj ==>', tempObj);
    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.saveCreateOutwardOutProcess(tempObj);
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
    <CreateNewOutInProcessUI
      itemsObj={itemsObj}
      childObj={childObj}
      childObjSizes={childObjSizes}
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
      getStylesList={getStylesList}
      getSizesList={getSizesList}
      getPricesList={getPricesList}
      childPricesObj={childPricesObj}
      companyId={companyId}
    />
  );
};

export default CreateNewOutInProcess;
