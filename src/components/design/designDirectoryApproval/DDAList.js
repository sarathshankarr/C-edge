import React, { useState, useEffect, useRef } from 'react';
import DDAListUi from './DDAListUi';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

const DDAList = ({ navigation, route, ...props }) => {

  const [itemsArray, set_itemsArray] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [prev, setPrev]=useState(0);
  const [next, setNext]=useState(5);
  const [prevDisable, setPrevDisable]=useState(false);
  const [nextDisable, setNextDisable]=useState(false);
  
  // React.useEffect(() => {
  //   getInitialData();
  // }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getInitialData();
  //   }, [])
  // );

  React.useEffect(() => {
    getInitialData();
    //console.log("prev, next", prev, next)
  }, [prev && next]); 
  

  React.useEffect(() => {
    if(route?.params && route?.params?.reload){
      getInitialData();
    }
    console.log("route?.params==>", route?.params?.reload)
  }, [route]);


  const backBtnAction = () => {
    navigation.navigate('Main');
  };

 
  const prevBtnAction = () => {

    if(prev===0 && next===5){
      setPrevDisable(true);
      return;
    }

    set_isLoading(true);
    if (prev - 5 > 0) {
      if(prev===6){
         setPrev(prev-5-1);
      }else{
         setPrev(prev - 5);
      }
       setNext(next - 5);
    } else {
       setPrev(0);
       setNext(5);
    }
    // console.log("Prev", prev, next);
    // await getInitialData();
    set_isLoading(false);

  };
  
  const nextBtnAction = () => {
    set_isLoading(true);
    
    if(itemsArray.length===0){
      setNextDisable(true);
      return;
    }
    
    // set_itemsArray([]);
    if(prev===0){
       setPrev(prev+ 1+ 5);
    }else{
       setPrev(prev + 5);
    }
     setNext(next + 5);
    // console.log("Next", prev, next);
    // await getInitialData();
    set_isLoading(false);

    
  };
  
  const getInitialData = async () => {

    set_isLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let obj = {
      "searchKeyValue": "",
      "styleSearchDropdown": "-1",
      "menuId": 728,
      "dataFilter": "",
      "fromRecord":prev,
      "toRecord": next,
      "userName": userName,
      "userPwd": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    console.log("getInitialData==>", prev, next);

    let DDAListAPIObj = await APIServiceCall.loadDesignDirectoryApprovalList(obj);

    // console.log("DDAListAPIObj==========>", DDAListAPIObj )
    if (DDAListAPIObj && DDAListAPIObj.statusData) {

      if (DDAListAPIObj && DDAListAPIObj.responseData) {
        set_itemsArray(DDAListAPIObj.responseData);
        // console.log("DDAListAPIObj==========>", DDAListAPIObj.responseData )

      }
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (DDAListAPIObj && DDAListAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }
    set_isLoading(false);
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
  };

  const actionOnRow = (item, index) => {
    navigation.navigate('DDAEdit', { item: item });
  };

  return (

    <DDAListUi
      itemsArray={itemsArray}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      actionOnRow={actionOnRow}
      backBtnAction={backBtnAction}
      prevBtnAction={prevBtnAction}
      nextBtnAction={nextBtnAction}
      popOkBtnAction={popOkBtnAction}
      prevDisable={prevDisable}
      nextDisable={nextDisable}
    />
  );

}

export default DDAList;