import React, { useState } from 'react';
import DDAEditUi from './FabricEditUi';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import FabricEditUi from './FabricEditUi';

const FabricEdit = ({ navigation, route, ...props }) => {

  const [itemsObj, set_itemsObj] = useState([]);
  const [fabricId, set_fabricId] = useState('');
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  React.useEffect(() => {

    if (route.params?.item) {
      getInitialData(route.params.item.fabricId);
      set_fabricId(route.params.item.fabricId);
      console.log("route.params?.item===========> ", route.params.item.fabricId);
    }

  }, [route.params]);



  const backBtnAction = () => {
    navigation.goBack();
  };





  const getInitialData = async (id) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      "fabricId":id,
      "username": userName,
      "password": userPsd,
      "menuid":29,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    let EditDDAAPIObj = await APIServiceCall.EditFabricMasters(obj);
    set_isLoading(false);

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


  const submitAction = async (tempObj) => {

    set_isLoading(true);

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let userId = await AsyncStorage.getItem('userId');

    tempObj.username=userName,
    tempObj.password=userPsd,
    tempObj.compIds=usercompanyId,
    tempObj.fabricId=fabricId,
    tempObj.userId=userId,
    tempObj.company=JSON.parse(companyObj)
 
    let  saveEditObj = await APIServiceCall.saveFabricEdit(tempObj);
    set_isLoading(false);
    console.log("response after approving", saveEditObj?.responseData)

    if (saveEditObj && saveEditObj.statusData && saveEditObj.responseData && saveEditObj.responseData === 'True') {
      console.log("sucess");
      backBtnAction();
    } else {
      popUpAction(Constant.Fail_Save_Dtls_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (saveEditObj && saveEditObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  return (
    <FabricEditUi
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

export default FabricEdit;