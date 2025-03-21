import React, {useState, useEffect, useRef} from 'react';
import * as APIServiceCall from '../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useNavigation} from '@react-navigation/native';
import CreateBoxPackingUI from './CreateBoxPackingUI';

const CreateBoxPacking = ({route}) => {
  const navigation = useNavigation();

  useEffect(() => {
    getInitialData();
  }, []);

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [lists1, set_lists1] = useState([]);
  const [lists2, set_lists2] = useState([]);
  const [initialDataLists, set_initialDataLists] = useState([]);

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
      menuId: 345,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
      dataFilter: '0',
      locIds: 0,
      brandIds: 0,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      fromRecord: 0,
      toRecord: 25,
      username: userName,
      password: userPsd,
      vendorLogin: 'Admin',
      vendorId: 0,
      days: '0',
    };
    let LISTAPIOBJ = await APIServiceCall.getBoxPackingCreateList(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
        set_initialDataLists(LISTAPIOBJ.responseData);
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
  const getData = async (tempObj, id) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj1 = {
      menuId: 345,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
      dataFilter: '0',
      locIds: 0,
      brandIds: 0,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      fromRecord: 0,
      toRecord: 25,
      username: userName,
      password: userPsd,
      vendorLogin: 'Admin',
      vendorId: 0,
      days: '0',
      buyerPoId: tempObj.buyerPoId,
    };
    let obj2 = {
      menuId: 345,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
      dataFilter: '0',
      locIds: 0,
      brandIds: 0,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      fromRecord: 0,
      toRecord: 25,
      username: userName,
      password: userPsd,
      vendorLogin: 'Admin',
      vendorId: 0,
      days: '0',
      buyerPoId: tempObj.buyerPoId,
      styleId: tempObj.styleId,
      soId: 0,
      locId: 0,
      fabOrRm: 0,
      reProcess: 0,
      rmenuId: 345,
      outpId: 0,
      re_gst: 0,
      reg_vendor: 0,
      workOrderId: 0,
      styleIds: tempObj.styleId,
    };

    let LISTAPIOBJ;

    if (id === 1) {
      // console.log("req for 1 api ===> ", obj1)
      LISTAPIOBJ = await APIServiceCall.getBoxPackingCreateStylesList(obj1);
    } else {
      // console.log("req for 2 api ===> ", obj2)
      LISTAPIOBJ = await APIServiceCall.getBoxPackingCreateColorsList(obj2);
    }

    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      // if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
      //   set_lists(LISTAPIOBJ.responseData);
      // }
      if (id === 1) {
        set_lists1(LISTAPIOBJ.responseData);
    } else {
        set_lists2(LISTAPIOBJ.responseData);
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

  const submitAction = async tempObj => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let userId = await AsyncStorage.getItem('userId');
    let locIds = await AsyncStorage.getItem('CurrentCompanyLocations');


    tempObj.menuId = 345;
    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.userId = userId;
    tempObj.locId = locIds;
    tempObj.compIds = usercompanyId;
    tempObj.company = JSON.parse(companyObj);

    console.log('saving obj ==>', tempObj);

    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.saveCreateBoxPacking(tempObj);
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
    <CreateBoxPackingUI
      isLoading={isLoading}
      popUpAction={popUpAction}
      set_isLoading={set_isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      lists1={lists1}
      lists2={lists2}
      initialDataLists={initialDataLists}
      submitAction={submitAction}
      getData={getData}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
    />
  );
};

export default CreateBoxPacking;
