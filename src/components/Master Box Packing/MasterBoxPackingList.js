import React, { useState, useEffect,useRef } from 'react';
import * as APIServiceCall from '../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import MasterBoxPackingListUI from './MasterBoxPackingListUI';

const MasterBoxPackingList = ({ route }) => {
  const navigation=useNavigation();
  const ListSize=10;

    const [itemsArray, set_itemsArray] = useState();
    const [isLoading, set_isLoading] = useState(false);
    const [MainLoading, set_MainLoading] = useState(false);
    const [isPopUp, set_isPopUp] = useState(false);
    const [popUpMessage, set_popUpMessage] = useState(undefined);
    const [popUpAlert, set_popUpAlert] = useState(undefined);
    const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
    const [isPopupLeft, set_isPopupLeft] = useState(false);
    const [page, setpage] = useState(0);

    const [hasMore, setHasMore] = useState(true); 


    
  React.useEffect(() => {
    getInitialData(0, true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getInitialData(0, true);
    }, [])
  );
  
  const backBtnAction = () => {
    navigation.goBack();
  };

  const fetchMore= (more) =>{
    console.log("fetch more ==> ", hasMore, isLoading );
    
    if(more){
      if(!hasMore || MainLoading || isLoading) return;
      const next =page + 1  ;
      setpage(next);
      getInitialData(next, false);
    }else{
      getInitialData(0, true);
      // setpage(0);
      // setHasMore(true);
    }
  }



  const getInitialData = async (page = 0, reload = false) => {

    if (reload) {
      setpage(0);  
      setHasMore(true);
  }
    
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(!reload);
    set_MainLoading(reload);

    const fromRecord = reload ? 0 : page * ListSize;
    const toRecord = fromRecord + ListSize - 1;

    console.log("from : ",fromRecord, "to : ",  toRecord);
    try{
     
      let obj = {  
        "menuId": 5,
        "searchKeyValue": "",
        "styleSearchDropdown": "-1", // mandatory
        "dataFilter": "0", 
        "locIds": 0,
        "brandIds": 0,
        "username": userName,
        "password" : userPsd,
        "fromRecord": fromRecord,
        "toRecord": toRecord,
        "compIds": usercompanyId,
        "company":JSON.parse(companyObj),
        "vendorLogin":"Admin",
        "vendorId":0,
        "days":"0",
    }
      let LISTAPIOBJ = await APIServiceCall.LoadAllMasterBoxPacking(obj);
      set_isLoading(false);
      
      if(LISTAPIOBJ && LISTAPIOBJ.statusData){
    
        if(LISTAPIOBJ && LISTAPIOBJ.responseData){
          set_itemsArray(prevItems => reload 
            ? LISTAPIOBJ.responseData 
            : [...prevItems, ...LISTAPIOBJ.responseData] 
          );
          if(LISTAPIOBJ?.responseData?.length<ListSize-1){
            setHasMore(false);
          }
          
        }
      } else {
        popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
      }
    
      if(LISTAPIOBJ && LISTAPIOBJ.error) {
        popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
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

    let obj =  {
      "username": userName,
       "password": userPsd,
       "menuId": 587,
       "fromRecord": 0,
       "toRecord": 999,
       "searchKeyValue": "",
       "styleSearchDropdown": "-1",
       "categoryType" : types,
       "categoryIds" : Ids,
       "compIds": usercompanyId,
       "company":JSON.parse(companyObj),
     }

    //  console.log("requested filtered body ==> ", obj)
  
    let stichingOutAPIObj = await APIServiceCall.getFilteredListFBI(obj);
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


  const popUpAction = (popMsg, popAlert,rBtnTitle,isPopup,isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  }

  const popOkBtnAction = () => {
    popUpAction(undefined,undefined,'', false,false)
  };

  const actionOnRow = (item,index) => {
    navigation.navigate('SaveMasterBoxPacking', {item:item});
  };

  const handleNavigation = () => {
    navigation.navigate('SavePartProcessing');
  };
  

  return (

    <MasterBoxPackingListUI
      itemsArray = {itemsArray}
      isLoading = {isLoading}
      MainLoading = {MainLoading}
      popUpAlert = {popUpAlert}
      popUpMessage = {popUpMessage}
      popUpRBtnTitle = {popUpRBtnTitle}
      isPopupLeft = {isPopupLeft}
      isPopUp = {isPopUp}
      actionOnRow = {actionOnRow}
      backBtnAction = {backBtnAction}
      popOkBtnAction = {popOkBtnAction}
      fetchMore={fetchMore}
      applyFilterFxn={getFilteredList}
      handleNavigation={handleNavigation}

    />

  );

}
export default MasterBoxPackingList;

