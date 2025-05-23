import React, {useState} from 'react';
import * as APIServiceCall from '../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useFocusEffect} from '@react-navigation/native';
import SaveGoodsReceiptNoteUI from './SaveGoodsReceiptNoteUI';

const SaveGoodsReceiptNote = ({navigation, route, ...props}) => {
  const [itemsObj, set_itemsObj] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [fptid, set_fptid] = useState(0);

  React.useEffect(() => {
    if (route.params) {
      if (route.params?.item) {
        console.log('Route Params ===> ', route.params?.item?.poNumber);
        getInitialData(route.params?.item?.poNumber);
      }
    }
  }, [route.params]);

  const backBtnAction = () => {
    navigation.goBack();
  };

  const getInitialData = async id => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    set_isLoading(true);

    let obj = {
      menuId: 5,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
      dataFilter: '0',
      locIds: 0,
      brandIds: 0,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      fromRecord: 0,
      toRecord: 25,
      userName: userName,
      userPwd: userPsd,
      poNumber: id,
    };
    // console.log("req body ===> ", obj);
    let EditFabricProcessInObj =
      await APIServiceCall.getEditDetailsGoodsReceiptNote(obj);
    set_isLoading(false);

    if (EditFabricProcessInObj && EditFabricProcessInObj.statusData) {
      set_itemsObj(EditFabricProcessInObj.responseData);
    } else {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (EditFabricProcessInObj && EditFabricProcessInObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };

  const actionOnRow = (item, index) => {
    navigation.navigate('FabricMainComponent', {styleId: item.styleId});
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
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let userId = await AsyncStorage.getItem('userId');
    
    tempObj.userName = userName;
    tempObj.userPwd = userPsd;
    tempObj.userId = userId;
    tempObj.compIds = usercompanyId;
    tempObj.companyLocationId = usercompanyId;
    tempObj.menuId = 145;

    console.log('saving obj ==>', tempObj);
    tempObj.company = JSON.parse(companyObj);

    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.saveEditGoodsTransportReceipt(tempObj);
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
    <SaveGoodsReceiptNoteUI
      itemsObj={itemsObj}
      isLoading={isLoading}
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
};

export default SaveGoodsReceiptNote;
