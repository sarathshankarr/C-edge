import React, { useState} from 'react';
import BundlingUI from './bundlingUI';
import * as APIServiceCall from './../../utils/apiCalls/apiCallsComponent';
import * as Constant from "./../../utils/constants/constant";

const BundlingComponent = ({ navigation, route, ...props }) => {

    const [itemsArray, set_itemsArray] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  React.useEffect(() => {   
    getInitialData();
  }, []);

  const backBtnAction = () => {
    navigation.navigate('Main');
  };

  const getInitialData = async () => {

    set_isLoading(true);

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');

    let obj = {
        "menuId": 10,
        "searchKeyValue": "",
        "styleSearchDropdown": "-1",
        "dataFilter": "120Days",
        "locIds": 0,
        "brandIds": 0,
        "compIds": 0,
        "fromRecord": 0,
        "toRecord": 999,
        "userName":userName,
        "userPwd":userPsd,
        "prevMenuId":9
    }

    let bundlingAPIObj = await APIServiceCall.bundlingDetails(obj);
    set_isLoading(false);
    
    if(bundlingAPIObj && bundlingAPIObj.statusData){

      if(bundlingAPIObj && bundlingAPIObj.responseData){
        set_itemsArray(bundlingAPIObj.responseData)
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(bundlingAPIObj && bundlingAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const actionOnRow = (item,index) => {
    // navigation.navigate('SaveStichingOutComponent');
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

  return (

    <BundlingUI
      itemsArray = {itemsArray}
      isLoading = {isLoading}
      popUpAlert = {popUpAlert}
      popUpMessage = {popUpMessage}
      popUpRBtnTitle = {popUpRBtnTitle}
      isPopupLeft = {isPopupLeft}
      isPopUp = {isPopUp}
      backBtnAction = {backBtnAction}
      actionOnRow = {actionOnRow}
      popOkBtnAction = {popOkBtnAction}
    />

  );

}

export default BundlingComponent;