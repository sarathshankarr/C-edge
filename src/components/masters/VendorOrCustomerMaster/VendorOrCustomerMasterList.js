import React, { useState, useEffect, useRef } from 'react';
import DDAListUi from './VendorOrCustomerMasterListUi';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import VendorOrCustomerMasterListUi from './VendorOrCustomerMasterListUi';

const VendorOrCustomerMasterList = ({ navigation, route, ...props }) => {
  const ListSize=10;
  const [itemsArray, set_itemsArray] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  const [MainLoading, set_MainLoading] = useState(false);
  const [page, setpage] = useState(0);
  const [hasMore, setHasMore] = useState(true); 
  
  
  useFocusEffect(
    React.useCallback(() => {
      //  getInitialData(0, true);
    }, [])
);
  
  const backBtnAction = () => {
    navigation.navigate('Main');
  };
  
  const handleNavigation = () => {
    navigation.navigate('VendorOrCustomerMasterEdit');
  };

  const getInitialData = async (page = 0, reload = false) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    
    const fromRecord = reload ? 0 : page * ListSize;
    const toRecord = fromRecord + ListSize - 1;

    set_isLoading(!reload);
    set_MainLoading(reload);

    try {
    let obj = {
      "searchKeyValue": "",
      "styleSearchDropdown": "-1",
      "menuId": 728,
      "dataFilter": "",
      "fromRecord":fromRecord,
      "toRecord": toRecord,
      "userName": userName,
      "userPwd": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }

    let DDAListAPIObj = await APIServiceCall.loadDesignDirectoryApprovalList(obj);

    if (DDAListAPIObj && DDAListAPIObj.statusData) {

      if (DDAListAPIObj && DDAListAPIObj.responseData) {
        // set_itemsArray(DDAListAPIObj.responseData);
        set_itemsArray(prevItems => reload 
          ? DDAListAPIObj.responseData 
          : [...prevItems, ...DDAListAPIObj.responseData] 
        );

        if(DDAListAPIObj?.responseData?.length < ListSize-1){
          setHasMore(false);
        }

      }
    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (DDAListAPIObj && DDAListAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }
  }finally{
    set_isLoading(false);
    set_MainLoading(false);
  }
  };
  
  const getFilteredList = async (types, Ids) => {

    set_MainLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let obj =   {
      "menuId": 40,
      "designId": 24,
      "menuId": 728,
      "userName": userName,
      "userPwd" : userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
      "categoryType" : types,
      "categoryIds" : Ids,
      "approvedStatus": 1,

  }
    //  console.log("requested filtered body ==> ", obj);
  
    let stichingOutAPIObj = await APIServiceCall.getFiltered_DDA(obj);
    set_MainLoading(false);
    
    if(stichingOutAPIObj && stichingOutAPIObj.statusData){

      if(stichingOutAPIObj && stichingOutAPIObj.responseData){
        set_itemsArray(stichingOutAPIObj.responseData)
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(stichingOutAPIObj && stichingOutAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

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

  // const actionOnRow = (item, index) => {
  //   navigation.navigate('LocationMasterEdit', { item: item });
  // };

  const fetchMore= (more) =>{
    console.log("fetch more ==> ", hasMore, isLoading );
    
    if(more){
      if(!hasMore || MainLoading || isLoading) return;
      const next =page + 1  ;
      setpage(next);
    //   getInitialData(next, false);
    // }else{
      setpage(0);
      // getInitialData(0, true);
      setHasMore(true);
    }
  }

  return (

    <VendorOrCustomerMasterListUi
      itemsArray={itemsArray}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      backBtnAction={backBtnAction}
      // actionOnRow={actionOnRow}
      popOkBtnAction={popOkBtnAction}
      fetchMore={fetchMore}
      MainLoading = {MainLoading}
      applyFilterFxn={getFilteredList}
      handleNavigation={handleNavigation}
    />
  );

}

export default VendorOrCustomerMasterList;




