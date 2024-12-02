import React, { useState } from 'react';
import StyleManageUI from './styleManageUI';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';


const StyleManageComponent = ({ navigation, route, ...props }) => {

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
    let locIds = await AsyncStorage.getItem('CurrentCompanyLocations');
    let brandIds = await AsyncStorage.getItem('brandIds');
    let usercompanyId = await AsyncStorage.getItem('companyId');

    let obj = {
      "menuId": 30,
      "searchKeyValue": "",
      "styleSearchDropdown": "-1",
      "dataFilter": "60Days",
      "locIds": locIds ? locIds : 0,
      "brandIds": brandIds ? brandIds : 0,
      "compIds": usercompanyId,
      "fromRecord": 0,
      "toRecord": 999,
      "username": userName,
      "password": userPsd,
      "flag": 1,
    }

    console.log('req obj for list ===> ', obj);


    let poEditAPIObj = await APIServiceCall.loadAllStylesAPI(obj);
    set_isLoading(false);

    if (poEditAPIObj && poEditAPIObj.statusData) {

      if (poEditAPIObj && poEditAPIObj.responseData) {
        set_itemsArray(poEditAPIObj.responseData)
      }

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (poEditAPIObj && poEditAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const actionOnRow = (item, index) => {
    navigation.navigate('StyleDetailsComponent', { sId: item.styleId, image: item.image });
  };

  const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  }

  const popOkBtnAction = () => {
    popUpAction(undefined, undefined, '', false, false)
  }

  return (

    <StyleManageUI
      itemsArray={itemsArray}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      backBtnAction={backBtnAction}
      actionOnRow={actionOnRow}
      popOkBtnAction={popOkBtnAction}
    />

  );

}

export default StyleManageComponent;