import React, { useState} from 'react';
import SaveStichingInUI from './saveStitchingInUI';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';


const SaveStichingInComponent = ({ navigation, route, ...props }) => {

  const [itemObj, set_itemObj] = useState();
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [inMainId, set_inMainId] = useState(0);

  React.useEffect(() => {
    
    if(route.params?.styleId && route.params?.soId) {
      getInitialData(route.params?.styleId,route.params?.soId);
    }
    
  }, [route.params?.styleId,route.params?.soId]);

  const backBtnAction = () => {
    navigation.navigate('StichingInComponent');
  };

  const getInitialData = async (styleId,soId) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');

    set_isLoading(true);
    let obj = {
        "menuId": 161,
        "styleId":styleId,//styleId,
        "soId": soId,//soId,
        "username": userName,
        "password": userPsd,
        "compIds": usercompanyId,

    }


    let editStichingOutAPIObj = await APIServiceCall.editStichingInDetails(obj);
    set_isLoading(false);
    console.log('edit StichingInDetails response ', editStichingOutAPIObj);
    
    
    if(editStichingOutAPIObj && editStichingOutAPIObj.statusData){

      if(editStichingOutAPIObj && editStichingOutAPIObj.responseData){
        set_itemObj(editStichingOutAPIObj.responseData);
        set_inMainId(editStichingOutAPIObj.responseData.inMainId);
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(editStichingOutAPIObj && editStichingOutAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };


  const popUpAction = (popMsg, popAlert,rBtnTitle,isPopup,isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  }

  const popOkBtnAction = () => {
    popUpAction(undefined,undefined,'', false,false)
  }

    const submitAction = (enterSizesArray, locationId, unitPrice) => {

    let temValid = false;
    if (enterSizesArray && enterSizesArray.length > 0) {

      for (let i = 0; i < enterSizesArray.length; i++) {
        if (enterSizesArray[i].enterQty && enterSizesArray[i].enterQty !== "") {
          temValid = true;
        } else {
          enterSizesArray[i].enterQty = 0;
        }
      }
    }

    if (!temValid) {
      popUpAction(Constant.validate_Fields_, Constant.DefaultAlert_MSG, 'OK', true, false)
      return
    }

    const findSizeIfExceeds = (details) => {
      for (let i = 0; i < details.length; i++) {
        if (details[i].enterQty > details[i].remQty) {
          return details[i].size;
        }
      }
      return null;
    };

    const check = findSizeIfExceeds(itemObj.sizeDetails)
    
    if (check !== null) {
      popUpAction(Constant.validate_EnterQty(check), Constant.DefaultAlert_MSG, 'OK', true, false)
      return;
    }

    let tempObj = itemObj;
    tempObj.sizeDetails = enterSizesArray;
    tempObj.companyLocation=locationId > 0 ? locationId :0;
    tempObj.unitprice=unitPrice> 0?unitPrice:0;
    set_itemObj(tempObj);
    saveStichingInDetails(tempObj);
  };
  
  const saveStichingInDetails = async (tempObj) => {
    
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let userId = await AsyncStorage.getItem('userId');
    
    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.userId = userId;
    tempObj.inMainId = inMainId;

    console.log('saving request body In==>', tempObj);
    
    
    set_isLoading(true);
    let saveStichingInAPIObj = await APIServiceCall.saveStitchingInDetails(tempObj);
    console.log('saving response  Stiching In==>', saveStichingInAPIObj);
    set_isLoading(false);

    if (saveStichingInAPIObj && saveStichingInAPIObj.statusData && saveStichingInAPIObj.responseData && saveStichingInAPIObj.responseData.status !== 'False') {
      backBtnAction();
    } else {
      popUpAction(Constant.Fail_Save_Dtls_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (saveStichingInAPIObj && saveStichingInAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  return (

    <SaveStichingInUI
      itemObj = {itemObj}
      isLoading = {isLoading}
      popUpAlert = {popUpAlert}
      popUpMessage = {popUpMessage}
      popUpRBtnTitle = {popUpRBtnTitle}
      isPopupLeft = {isPopupLeft}
      isPopUp = {isPopUp}
      backBtnAction = {backBtnAction}
      popOkBtnAction = {popOkBtnAction}
      submitAction={submitAction}
    />

  );

}

export default SaveStichingInComponent;