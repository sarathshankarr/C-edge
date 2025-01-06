import React, { useState,useRef} from 'react';
import CuttingSaveUI from './cuttingSaveUI';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CuttingSaveComponent = ({ navigation, route, ...props }) => {

    const [itemsObj, set_itemsObj] = useState([]);
    const [isLoading, set_isLoading] = useState(false);
    const [isPopUp, set_isPopUp] = useState(false);
    const [popUpMessage, set_popUpMessage] = useState(undefined);
    const [popUpAlert, set_popUpAlert] = useState(undefined);
    const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
    const [isPopupLeft, set_isPopupLeft] = useState(false);

    let itemsObjRef = useRef();

    React.useEffect(() => {  
    
      if(route.params?.item) {        
        addCuttingDetails(route.params?.item);
        console.log("route.params?.item====> ", route.params?.item)
      }
      
    }, [route.params?.item]);


  const backBtnAction = () => {
    navigation.navigate('FabricMainComponent');
  };

  const addCuttingDetails = async (obj) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);

    let obj1 = {
      "menuId": 9,
      "styleId":obj.styleId,
      "soId":obj.soId,
      "fabricType" : obj.fabricType,
      "fabricId" : obj.fabricId,
      "username": userName,
      "password" : userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
   }

    // console.log("req body of add cutting ", obj1)

    let addCuttingAPIObj = await APIServiceCall.addCuttingDetails(obj1);
    set_isLoading(false);
    // console.log('addCuttingDetails Class ', addCuttingAPIObj)
    if(addCuttingAPIObj && addCuttingAPIObj.statusData){

      if(addCuttingAPIObj.responseData && addCuttingAPIObj.responseData.status !== 'False'){
        itemsObjRef.current = addCuttingAPIObj.responseData;
        set_itemsObj(addCuttingAPIObj.responseData);
      } else {
        popUpAction(Constant.Fail_Save_Dtls_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
      }

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(addCuttingAPIObj && addCuttingAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const saveCuttingDetails = async (obj) => {

    set_isLoading(true);
    // console.log('saveCuttingAPIObj before giving to api ==> ', obj)

    let saveCuttingAPIObj = await APIServiceCall.saveCuttingDetails(obj);
    set_isLoading(false);
    // console.log('saveCuttingAPIObj before giving to api ==> ', saveCuttingAPIObj)
    if(saveCuttingAPIObj && saveCuttingAPIObj.statusData){

      if(saveCuttingAPIObj.responseData && saveCuttingAPIObj.responseData.status === 'True'){
        // popUpAction(Constant.Fail_Save_Dtls_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
        console.log("sucess");
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

  const submitAction = (obj) => {
    saveCuttingDetails(obj)
  };

  return (

    <CuttingSaveUI
      itemsObj = {itemsObjRef.current}
      isLoading = {isLoading}
      popUpAlert = {popUpAlert}
      popUpMessage = {popUpMessage}
      popUpRBtnTitle = {popUpRBtnTitle}
      isPopupLeft = {isPopupLeft}
      isPopUp = {isPopUp}
      backBtnAction = {backBtnAction}
      actionOnRow = {actionOnRow}
      popOkBtnAction = {popOkBtnAction}
      popUpAction = {popUpAction}
      submitAction = {submitAction}
    />

  );

}

export default CuttingSaveComponent;