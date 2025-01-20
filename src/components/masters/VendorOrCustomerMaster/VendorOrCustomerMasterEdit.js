import React, { useState } from 'react';
import DDAEditUi from './VendorOrCustomerMasterEditUI';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import VendorOrCustomerMasterEditUI from './VendorOrCustomerMasterEditUI';

const VendorOrCustomerMasterEdit = ({ navigation, route, ...props }) => {

  const [itemsObj, set_itemsObj] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  React.useEffect(() => {

    if (route.params?.item) {
      // getInitialData(route.params?.item);
      console.log("route.params?.item===========> ", route.params?.item.designId);
    }

  }, [route.params]);



  const backBtnAction = () => {
    navigation.goBack();
  };

  const saveBack = () => {
    navigation.navigate('DDAList', {reload:true});
  };



  const getInitialData = async (item) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      "designId": item.designId,
      "menuId": 728,
      "userName": userName,
      "userPwd": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    console.log(' DDA edit request body --->,',obj);
    let EditDDAAPIObj = await APIServiceCall.EditDDA(obj);
    set_isLoading(false);

    console.log("edit get data ==> ", EditDDAAPIObj.statusData);
    if (EditDDAAPIObj && EditDDAAPIObj.statusData) {
      set_itemsObj(EditDDAAPIObj.responseData);
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (EditDDAAPIObj && EditDDAAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  // const actionOnRow = (item,index) => {
  //   navigation.navigate('FabricMainComponent',{styleId:item.styleId});
  // };

  const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  };

  const popOkBtnAction = () => {
    popUpAction(undefined, undefined, '', false, false)
  };


  const submitAction = async (designId,remarks1, statusId, remarks) => {

    if(statusId===0){
      popUpAction(Constant.SELECT_STATUS, Constant.DefaultAlert_MSG, 'OK', true, false);
      return;
    }

    console.log("saving params ==> ", designId, statusId, remarks?.length);

    if (statusId === 2 && remarks.trim().length === 0) {
      popUpAction(Constant.PO_Rejected_MSG_WITHOUT_REMARKS, Constant.DefaultAlert_MSG, 'OK', true, false);
      return;
    }

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    const obj = {
      "designId": designId,
      "menuId": 728,
      "approvedStatus": statusId,
      "remarks": remarks,
      "note": remarks1,
      "userName": userName,
      "userPwd": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    saveEditObj(obj);

  };

  const saveEditObj = async (tempObj) => {
 
    set_isLoading(true);
    let saveEditObj = await APIServiceCall.saveDDA(tempObj);
    set_isLoading(false);
    console.log("response after approving", saveEditObj?.responseData)

    if (saveEditObj && saveEditObj.statusData && saveEditObj.responseData && saveEditObj.responseData.status !== 'false') {
      console.log("sucess");
      saveBack();
    } else {
      popUpAction(Constant.Fail_Save_Dtls_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (saveEditObj && saveEditObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  return (
    <VendorOrCustomerMasterEditUI
      itemsObj={itemsObj}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      backBtnAction={backBtnAction}
      // actionOnRow = {actionOnRow}
      popOkBtnAction={popOkBtnAction}
      submitAction={submitAction}
    />

  );

}

export default VendorOrCustomerMasterEdit;

