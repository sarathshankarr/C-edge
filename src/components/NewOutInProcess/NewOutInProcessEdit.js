import React, { useState } from 'react';
import * as APIServiceCall from './../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewOutInProcessEditUI from './NewOutInProcessEditUI';


const NewOutInProcessEdit = ({ navigation, route, ...props }) => {

  const [itemsObj, set_itemsObj] = useState([]);
  const [statesList, set_statesList] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [outprocessId, set_outprocessId]=useState('');


  React.useEffect(() => {

    if (route.params?.item) {
      getInitialData(route.params?.item.outprocessId);
      set_outprocessId(route.params?.item.outprocessId)
      console.log("route.params?.item===========> ", route.params?.item);
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
      "outprocessId": id,
      "menuId":17,
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
    }
    let EditDDAAPIObj = await APIServiceCall.EditNewOutInProcess(obj);
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

  const getStatelist = async (selectedCountryId) => {

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
    let EditDDAAPIObj = await APIServiceCall.loadVendorMasterStatesList(obj);
    set_isLoading(false);

    
    if (EditDDAAPIObj && EditDDAAPIObj.statusData) {
      // set_itemsObj({...itemsObj, state:EditDDAAPIObj.responseData});
      set_statesList(EditDDAAPIObj.responseData);
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

    tempObj.menuId=247,
    tempObj.username=userName,
    tempObj.password=userPsd,
    tempObj.compIds=usercompanyId,
    tempObj.id=usercompanyId,
    tempObj.userId=userId,
    tempObj.company=JSON.parse(companyObj)

 console.log("edit save req body ==> ", tempObj)

    let saveEditObj = await APIServiceCall.saveEditOutwardNewInProcess(tempObj);
    set_isLoading(false);
    console.log("response after approving", saveEditObj?.responseData, typeof saveEditObj?.responseData, saveEditObj?.responseData === true)

    if (saveEditObj && saveEditObj.statusData && saveEditObj.responseData && saveEditObj?.responseData === true) {
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
    <NewOutInProcessEditUI
      itemsObj={itemsObj}
      statesList={statesList}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
      submitAction={submitAction}
      getStatelist={getStatelist}
    />

  );

}

export default NewOutInProcessEdit;

