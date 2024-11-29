import React, { useState} from 'react';
import SaveStichingOutUI from './saveStichingOutUI';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';


const SaveStichingOutComponent = ({ navigation, route, ...props }) => {

  const [itemsObj, set_itemsObj] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  React.useEffect(() => {
    
    if(route.params?.styleId && route.params?.soId) {
      getInitialData(route.params?.styleId,route.params?.soId);
    }
    
  }, [route.params?.styleId,route.params?.soId]);

  const backBtnAction = () => {
    navigation.navigate('StichingOutComponent');
  };

  const getInitialData = async (styleId,soId) => {
    
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');

    set_isLoading(true);
    let obj = {
      "menuId": 12,
      "styleId":soId,
      "soId":styleId,
      "username": userName,
      "password" : userPsd,
      "compIds": usercompanyId,

    }

    let saveStichingOutAPIObj = await APIServiceCall.addStitchingOutDetails(obj);
    // console.log('Save Stich Out ',saveStichingOutAPIObj)
    set_isLoading(false);
    
    if(saveStichingOutAPIObj && saveStichingOutAPIObj.statusData){

      set_itemsObj(saveStichingOutAPIObj.responseData);

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(saveStichingOutAPIObj && saveStichingOutAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const saveStitchingOutDetails = async (obj) => {

    set_isLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let userId = await AsyncStorage.getItem('userId');

    obj.username = userName;
    obj.password = userPsd;
    obj.userId = userId;


    let saveCuttingAPIObj = await APIServiceCall.saveStitchingOutDetails(obj);
    set_isLoading(false);
    // console.log('saveStitchingOutDetails ', saveCuttingAPIObj)
    if(saveCuttingAPIObj && saveCuttingAPIObj.statusData){

      if(saveCuttingAPIObj.responseData && saveCuttingAPIObj.responseData.status !== 'False'){

        backBtnAction();

      } else {
        popUpAction(Constant.Fail_Save_Dtls_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
      }

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(saveCuttingAPIObj && saveCuttingAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const actionOnRow = (item,index) => {
    navigation.navigate('FabricMainComponent',{styleId:item.styleId,soId:item.soId});
  };

  const popUpAction = (popMsg, popAlert,rBtnTitle,isPopup,isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  };

  const popOkBtnAction = () => {
    popUpAction(undefined,undefined,'', false,false)
  };

  const submitAction = (enterSizesArray, locationId, unitPrice) => {

    let temValid = false;
    if(enterSizesArray && enterSizesArray.length > 0) {
      
      for (let i = 0; i < enterSizesArray.length; i++) {
        if (enterSizesArray[i].enterQty && enterSizesArray[i].enterQty !== "") {
          temValid = true;
        } else {
          enterSizesArray[i].enterQty=0;
        }
      }
    }

    if(!temValid) {
      popUpAction(Constant.validate_Fields_,Constant.DefaultAlert_MSG,'OK', true,false)
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
  
  const check=findSizeIfExceeds(itemsObj.sizeDetails)
  if(check!==null) {
    popUpAction(Constant.validate_EnterQty(check),Constant.DefaultAlert_MSG,'OK', true,false)
    return;
  }


    let tempObj = itemsObj
    tempObj.sizeDetails = enterSizesArray;
    tempObj.companyLocation=locationId>0?locationId:0;
    tempObj.unitprice=unitPrice>0?unitPrice:0;
    console.log('Saving obj ==> ',tempObj);
    // return;
    saveStitchingOutDetails(tempObj);
  };

  return (

    <SaveStichingOutUI
      isLoading = {isLoading}
      popUpAlert = {popUpAlert}
      popUpMessage = {popUpMessage}
      popUpRBtnTitle = {popUpRBtnTitle}
      isPopupLeft = {isPopupLeft}
      isPopUp = {isPopUp}
      itemsObj = {itemsObj}
      backBtnAction = {backBtnAction}
      actionOnRow = {actionOnRow}
      popOkBtnAction = {popOkBtnAction}
      submitAction = {submitAction}
    />

  );

}

export default SaveStichingOutComponent;